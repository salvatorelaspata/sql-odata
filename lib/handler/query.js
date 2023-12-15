const { composeWhereFromFilter, getQueryOptions } = require("../util/compose")

const handlerQuery = async (request, reply, entity) => {
    // for now the query option is ignored ($format=json is always used)
    // manage query options ($filter, $select, $expand, $orderby, $top, $skip, $count, $format)

    const { query } = request
    const { filter, select } = getQueryOptions(query)

    const res = await entity.find({
        ...(filter && { where: composeWhereFromFilter(filter) }),
        ...(select && { fields: select })
    }
    ) // TODO: manage where and fields
    return { d: { results: res } }
}

module.exports = { handlerQuery }