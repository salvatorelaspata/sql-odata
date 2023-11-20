const _crudOperations = require('./crud')
const { capitalize } = require('./string')

const createCrudRoutes = (fastify, entities) => {
  const entityTuple = Object.entries(entities)
  for (let i = 0; i < entityTuple.length; i++) {
    const [entityKey, entity] = entityTuple[i]
    for (const c of Object.entries(_crudOperations({ entity, associations: entity.reverseRelationships }))) {
      const [crudKey, { method, url, handler: _handler, handlerAssociation: _handlerAssociation }] = c
      console.log(method, url, crudKey)
      // fastify[method.toLowerCase()](url, async (request, reply) => {
      //   const { query, params } = request
      //   debugger;
      //   reply.send({ query, params })
      // })
      fastify.route({
        method,
        url,
        handler: async (request, reply) => await _handler(request, reply, entity)
      })
      // manage associations to create entity /{enntity}({id})/{association}
      if (crudKey === 'read' && entity.reverseRelationships && entity.reverseRelationships.length > 0) {
        const associations = entity.reverseRelationships;
        for (let i = 0; i < associations.length; i++) {
          const a = associations[i];
          const { relation } = a
          if (relation.constraint_type === 'FOREIGN KEY') {
            fastify.get(`${url}/${capitalize(relation.table_name)}`, async (request, reply) => await _handlerAssociation(request, reply, fastify.platformatic.entities, relation)
            )
            console.log(method, `${url}/${capitalize(relation.table_name)}`, crudKey)
          }

        }
      }
    }
  }
}

module.exports = createCrudRoutes;