const _crudOperations = require('./crud')
const { capitalize } = require('./string')

const createCrudRoutes = (fastify, entities) => {
  const entityTuple = Object.entries(entities)
  for (let i = 0; i < entityTuple.length; i++) {
    const [entityKey, entity] = entityTuple[i]
    for (const c of Object.entries(_crudOperations(entity))) {
      const [crudKey, { method, url, handler: _handler }] = c
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
        // for (const a of Object.entries(associations)) {
        for (let i = 0; i < associations.length; i++) {
          const a = associations[i];
          const { relation } = a
          if (relation.constraint_type === 'FOREIGN KEY') {
            fastify.get(`${url}/${capitalize(foreign_table_name)}`)
          }

        }
      }
    }
  }
}

module.exports = createCrudRoutes;