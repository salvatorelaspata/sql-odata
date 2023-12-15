const { handlerCreate } = require('./handler/create')
const { handlerGet, handlerGetAssociation } = require('./handler/get')
const { handlerQuery } = require('./handler/query')
const { composeKeysPlaceholder } = require('./util/compose')
const { capitalize } = require('./util/string')

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
      url: `/${capitalize(pluralName)}(${composeKeysPlaceholder(entity)})`,
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
      url: `/${capitalize(pluralName)}(${composeKeysPlaceholder(entity)})`
    },
    delete: {
      method: 'DELETE',
      url: `/${capitalize(pluralName)}(${composeKeysPlaceholder(entity)})`
    }
  }
}

module.exports = {
  crudOperations
}
