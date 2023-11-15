const { capitalize } = require('./string')

const _composeKeys = (entity) => {
  const { primaryKeys } = entity
  if (primaryKeys.size === 1) return `:${primaryKeys.values().next().value}`
  const _keys = []
  for (const key of primaryKeys) {
    _keys.push(`${key}=:${key}`)
  }
  return _keys.join(',')
}

const _crudOperations = (entity) => {
  const { pluralName } = entity
  return {
    query: {
      method: 'GET',
      url: `/${capitalize(pluralName)}`,
      handler: async (request, reply, entity) => {
        // for now the query option is ignored ($format=json is always used)
        // manage query options ($filter, $select, $expand, $orderby, $top, $skip, $count, $format)
        const res = await entity.find() // TODO: manage where and fields
        return { d: { results: res } }
      }
    },
    read: {
      method: 'GET',
      url: `/${capitalize(pluralName)}(${_composeKeys(entity)})`
    },
    create: {
      method: 'POST',
      url: `/${capitalize(pluralName)}`
    },
    update: {
      method: 'PUT',
      url: `/${capitalize(pluralName)}(${_composeKeys(entity)})`
    },
    delete: {
      method: 'DELETE',
      url: `/${capitalize(pluralName)}(${_composeKeys(entity)})`
    }
  }
}
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
    }
  }
}

module.exports = createCrudRoutes