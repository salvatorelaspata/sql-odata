const { sanifyParam, capitalize } = require("./string");

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent?retiredLocale=it#decoding_query_parameters_from_a_url
function decodeQueryParam(p) {
    return decodeURIComponent(p.replace(/\+/g, " "));
}
// TODO: manage multiple params ($filter)
const getQueryOptions = (params) => {
    let config = {}
    Object.entries(params).forEach(([key, originalValue]) => {
        let value = originalValue
        value = decodeQueryParam(originalValue)

        if (key === '$filter') {
            config.filter = {}
            if (value.split(' and ')) {
                const [key, operator, ...singleValue] = value.split(' ')
                config.filter[key] = {
                    [operator]: sanifyParam(singleValue.join(' '))
                }
            } else {
                value.split(' and ').forEach((filter) => {
                    const [key, operator, _value] = filter.split(' ')
                    config.filter[key] = {
                        [operator]: sanifyParam(_value)
                    }
                })
            }
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
const composeSelectFields = (select) => {
    return select.map(key => key.trim().toLowerCase())
}

const _composeValueFromOperator = (field, obj) => {
    const operator = Object.keys(obj)[0]
    const value = obj[operator]
    switch (operator) {
        case 'cs':
        case 'cp':
            return { [field]: { like: `%${value}%` } }
        default:
            return { [field]: obj }
    }
}

// WHERE
const composeWhereFromFilter = (query) => {
    const _where = {}
    Object.keys(query).forEach(key => {
        const _key = sanifyParam(key)
        // Object.assign(_where, { [_key.toLowerCase()]: query[key] })
        Object.assign(_where, _composeValueFromOperator(_key.toLowerCase(), query[key]))
    })
    return _where
}

const composeWhereFromKeys = (params) => {
    const _where = {}
    Object.keys(params).forEach(key => {
        const _key = sanifyParam(key)
        const _value = sanifyParam(params[key])
        Object.assign(_where, { [_key]: { eq: _value } })
    })
    return _where
}

const _toUpperCaseObjectKeys = (obj, keysToExclude) => {
    const newObj = {}
    Object.keys(obj).forEach(key => {
        if (keysToExclude && keysToExclude.includes(key)) return
        newObj[capitalize(key)] = obj[key]
    })
    return newObj
}

const manageOutput = (any, keysToExclude) => {
    if (any instanceof Array) {
        return any.map(item => _toUpperCaseObjectKeys(item, keysToExclude))
    } else {
        return _toUpperCaseObjectKeys(any, keysToExclude)
    }
}


const composeKeysPlaceholder = (entity) => {
    const { primaryKeys } = entity
    if (primaryKeys.size === 1) return `:${primaryKeys.values().next().value}`
    const _keys = []
    for (const key of primaryKeys) {
        _keys.push(`${key}=:${key}`)
    }
    return _keys.join(',')
}

const composeKeysMetadata = (entity, record) => {
    const { primaryKeys } = entity
    if (primaryKeys.size === 1) return `${record[primaryKeys.values().next().value]}`
    const _keys = []
    for (const key of primaryKeys) {
        _keys.push(`${key}=${record[key]}`)
    }
    return _keys.join(',')
}

module.exports = {
    getQueryOptions,
    composeWhereFromFilter,
    composeWhereFromKeys,
    composeSelectFields,
    manageOutput,
    composeKeysPlaceholder,
    composeKeysMetadata
}