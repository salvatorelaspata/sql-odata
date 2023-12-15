const { sanifyParam } = require("./string");

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent?retiredLocale=it#decoding_query_parameters_from_a_url
function decodeQueryParam(p) {
    return decodeURIComponent(p.replace(/\+/g, " "));
}
// TODO: manage multiple params ($filter)
const getQueryOptions = (params) => {
    let config = {}
    Object.entries(params).forEach(([key, originalValue]) => {
        console.log(key, originalValue)
        let value = originalValue
        try {
            value = decodeQueryParam(originalValue)
        } catch (error) {
            console.log(error)
        }
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
const _composeFields = (select) => {
    const _fields = []
    Object.keys(select).forEach(key => {
        const _key = sanifyParam(key)
        _fields.push(_key)
    })
    return _fields.join(',').toString()
}

const _composeValueFromOperator = (field, obj) => {
    const operator = Object.keys(obj)[0]
    const value = obj[operator]
    console.log('asd', { field, operator, value })
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
    console.log('****', query, Object.keys(query))
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


module.exports = {

    getQueryOptions,
    composeWhereFromFilter,
    composeWhereFromKeys
}