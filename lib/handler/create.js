// # TODO - ADD VALIDATOR
const handlerCreate = async (req, res, entity) => {
    const { body } = req;
    if (!body) return res.status(400).json({ error: 'Bad Request' });
    if (!Object.keys(body).length) return res.status(400).json({ error: 'Bad Request' });
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
    console.log(fields, inputs)
    try {
        const res = await entity.insert({
            fields, inputs
        });
        return { d: res };
    } catch (error) {
        res.statusCode = 500;
        return { error: error.message };
    }
}

module.exports = { handlerCreate }