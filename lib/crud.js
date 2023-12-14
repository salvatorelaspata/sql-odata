const { handlerCreate } = require('./handler/create')
const { handlerGet, handlerGetAssociation } = require('./handler/get')
const { handlerQuery } = require('./handler/query')
const { capitalize } = require('./util/string')

const _composeKeys = (entity) => {
  const { primaryKeys } = entity
  if (primaryKeys.size === 1) return `:${primaryKeys.values().next().value}`
  const _keys = []
  for (const key of primaryKeys) {
    _keys.push(`${key}=:${key}`)
  }
  return _keys.join(',')
}
const crudOperations = ({ entity }) => {
  const { pluralName } = entity
  return {
    query: {
      method: 'GET',
      url: `/${capitalize(pluralName)}`,
      handler: handlerQuery
    },
    read: {
      method: 'GET',
      url: `/${capitalize(pluralName)}(${_composeKeys(entity)})`,
      handler: handlerGet,
      handlerAssociation: handlerGetAssociation,
    },
    create: {
      method: 'POST',
      url: `/${capitalize(pluralName)}`,
      handler: handlerCreate
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

module.exports = {
  crudOperations
}
