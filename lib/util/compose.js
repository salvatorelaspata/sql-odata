const { sanifyParam } = require("./string");


// TODO: manage multiple params ($filter)
const getQueryOptions = (params) => {
    let config = {}
    Object.entries(params).forEach(([key, value]) => {
        if (key === '$filter') {
            config.filter = {}
            value.split(' and ').forEach((filter) => {
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
const composeWhereFromFilter = (query) => {
    const _where = {}
    Object.keys(query).forEach(key => {
        const _key = sanifyParam(key)
        Object.assign(_where, { [_key]: query[key] })
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