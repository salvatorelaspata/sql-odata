const _crud = {
  query: {
    method: 'GET',
    handler: async (request, reply) => {
      reply.send({ hello: 'antani' })
    }
  },
  read: {
    method: 'GET'
  },
  create: {
    method: 'POST'
  },
  update: {
    method: 'PUT'
  },
  delete: {
    method: 'DELETE'
  }
}
const createCrudRoutes = (fastify, entities) => {
  const entityTuple = Object.entries(entities)
  for (let i = 0; i < entityTuple.length; i++) {
    const [entityKey, entityValue] = entityTuple[i]

    for (const [crudKey, crudValue] of Object.entries(_crud)) {

      if (crudKey === 'read' || crudKey === 'update') url = `/${entityKey}(:id)` // per le read e l'update deve essere fornita la chiave primaria
      else url = `/${entityKey}`
      fastify.route({
        method: crudValue.method,
        url,
        handler: crudValue.handler || (async (request, reply) => {
          reply.send({ hello: crudKey })
        })
      })
    }
  }
}

module.exports = createCrudRoutes