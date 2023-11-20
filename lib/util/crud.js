const { capitalize, sanifyParam } = require('./string')

const _composeKeys = (entity) => {
  const { primaryKeys } = entity
  if (primaryKeys.size === 1) return `:${primaryKeys.values().next().value}`
  const _keys = []
  for (const key of primaryKeys) {
    _keys.push(`${key}=:${key}`)
  }
  return _keys.join(',')
}

// TODO: manage multiple params ($filter)
const _getQuery = (params) => {
  let config = {}
  Object.entries(params).forEach(([key, value]) => {
    if (key === '$filter') {
      config.filter = {}
      value.split(' and ').forEach((filter) => {
        console.log('***', value)
        const [key, operator, _value] = filter.split(' ')
        config.filter[key] = {
          [operator]: sanifyParam(_value)
        }
      })
    }
    else if (key === '$select') {
      config.select = value.split(',');
    } else if (key === '$top' || key === '$skip' || key === '$orderby' || key === '$format' || key === '$inlinecount') {
      config[key.substring(1)] = value;
    }
  });
  return config;
}

// SELECT
const _composeFields = (select) => {
  const _fields = []
  Object.keys(select).forEach(key => {
    const _key = sanifyParam(key)
    _fields.push(_key)
  })
  return _fields.join(',').toString()
}


// WHERE
const _composeWhereFromFilter = (query) => {
  const _where = {}
  Object.keys(query).forEach(key => {
    const _key = sanifyParam(key)
    Object.assign(_where, { [_key]: query[key] })
  })
  return _where
}

const _composeWhereFromKeys = (params) => {
  console.log(params)
  const _where = {}
  Object.keys(params).forEach(key => {
    const _key = sanifyParam(key)
    const _value = sanifyParam(params[key])
    Object.assign(_where, { [_key]: { eq: _value } })
  })
  console.log(_where)
  return _where
}

const _crudOperations = ({ entity }) => {
  const { pluralName } = entity
  return {
    query: {
      method: 'GET',
      url: `/${capitalize(pluralName)}`,
      handler: async (request, reply, entity) => {
        // for now the query option is ignored ($format=json is always used)
        // manage query options ($filter, $select, $expand, $orderby, $top, $skip, $count, $format)
        const { query } = request
        console.log({ query })
        const { filter, select } = _getQuery(query)
        console.log('*****', filter, select)
        const res = await entity.find({
          ...(filter && { where: _composeWhereFromFilter(filter) }),
          ...(select && { fields: select })
        }
        ) // TODO: manage where and fields
        return { d: { results: res } }
      }
    },
    read: {
      method: 'GET',
      url: `/${capitalize(pluralName)}(${_composeKeys(entity)})`,
      handler: async (request, reply, entity) => {
        // for now the query option is ignored ($format=json is always used)
        // manage query options ($filter, $select, $expand, $orderby, $top, $skip, $count, $format)

        try {
          const { params } = request
          const res = await entity.find({
            where: _composeWhereFromKeys(params),
          }) // TODO: manage where and fields
          return { d: { results: res } }
        } catch (error) {
          reply.statusCode = 404
          return { error: 'Not found' }
        }
      },
      handlerAssociation: async (request, reply, entities, relation) => {
        const { params } = request
        try {
          const resEntity = await entity.find({
            where: _composeWhereFromKeys(params)
          })
          console.log(resEntity)
          const res = await entities[relation.entityName].find({
            where: _composeWhereFromKeys({ [relation.foreign_column_name]: resEntity[0][relation.foreign_column_name] })
          })
          return { d: { ...resEntity[0], [relation.table_name]: res } }

        } catch (error) {
          reply.statusCode = 404
          return { error: 'Not found' }
        }
      }
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

module.exports = _crudOperations
