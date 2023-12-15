const { composeWhereFromFilter, getQueryOptions, composeSelectFields, manageOutput, composeKeysMetadata, composeKeysPlaceholder } = require("../util/compose")
const { capitalize } = require("../util/string")

const _createMetadata = (request, entity, record) => {

    const metadata = {
        __metadata: {
            uri: `${request.protocol}://${request.hostname}/${capitalize(entity.pluralName)}(${composeKeysMetadata(entity, record)})`,
            type: `${capitalize(request.ns)}Model.${capitalize(entity.pluralName)}`
        }
    }
    return metadata
}

const handlerQuery = async (request, reply, entity) => {
    // for now the query option is ignored ($format=json is always used)
    // manage query options ($filter, $select, $expand, $orderby, $top, $skip, $count, $format)


    const { query } = request
    const { filter, select } = getQueryOptions(query)
    const fields = select ? composeSelectFields(select) : []
    const { primaryKeys } = entity
    const keys = []
    for (const key of primaryKeys) {
        console.log(fields, key, fields.includes(key.toString()))
        if (!fields.includes(key))
            keys.push(key)
    }


    const res = await entity.find({
        ...(filter && { where: composeWhereFromFilter(filter) }),
        ...(select && { fields: [...fields, ...keys] }) // extract keys from select to calculate metadata
    }
    ) // TODO: manage where and fields
    return {
        d: {
            results:
                manageOutput(res.map(r => ({
                    ..._createMetadata(request, entity, r),
                    ...r
                })), select && keys)
        }
    }
}

module.exports = { handlerQuery }