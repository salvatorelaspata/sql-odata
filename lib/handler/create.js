const { manageOutput, createMetadata } = require("../util/compose");

// # TODO - ADD VALIDATOR
const handlerCreate = async (req, reply, entity) => {
    const { body } = req;
    if (!body) return reply.status(400).json({ error: 'Bad Request' });
    if (!Object.keys(body).length) return reply.status(400).json({ error: 'Bad Request' });
    let inputs = body;
    let fields = ['id', ...Object.keys(body).map(v => v.toLowerCase())];
    if (!Array.isArray(body)) inputs = [body] // insert only one row if body is not an array
    // lowercase all key in body
    inputs.map(v => {
        Object.keys(v).map(k => {
            v[k.toLowerCase()] = v[k];
            delete v[k];
        })
    })
    try {
        const res = await entity.insert({
            fields, inputs
        });
        reply.statusCode = 201;
        return { d: { ...createMetadata(req, entity, res[0]), ...manageOutput(res[0]) } };
    } catch (error) {
        reply.statusCode = 500;
        return { error: error.message };
    }
}

module.exports = { handlerCreate }