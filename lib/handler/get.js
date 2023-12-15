const { composeWhereFromKeys, composeSelectFields, getQueryOptions, manageOutput } = require("../util/compose")

const handlerGet = async (request, reply, entity) => {
    // for now the query option is ignored ($format=json is always used)
    // manage query options ($filter, $select, $expand, $orderby, $top, $skip, $count, $format)

    try {
        const { params, query } = request
        const { select } = getQueryOptions(query)
        const res = await entity.find({
            where: composeWhereFromKeys(params),
            ...(select && { fields: composeSelectFields(select) })
        })
        return { d: manageOutput(res[0]) }
    } catch (error) {
        reply.statusCode = 404
        return { error: 'Not found' }
    }
}

const handlerGetAssociation = async (request, reply, entities, relation) => {
    const { params } = request
    try {
        const resEntity = await entity.find({
            where: composeWhereFromKeys(params)
        })
        const res = await entities[relation.entityName].find({
            where: composeWhereFromKeys({ [relation.foreign_column_name]: resEntity[0][relation.foreign_column_name] })
        })
        return { d: manageOutput({ ...resEntity[0], [relation.table_name]: res }) }

    } catch (error) {
        reply.statusCode = 404
        return { error: 'Not found' }
    }
}

module.exports = { handlerGet, handlerGetAssociation }