'use strict'

const test = require('node:test')
const assert = require('node:assert')
const { getServer } = require('../../helper')


test('create entity', async (t) => {
    const server = await getServer(t)
    const title = 'The Matrix'
    let id
    {
        const res = await server.inject({
            method: 'POST',
            url: '/v2/Movies',
            body: {
                Title: title
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })

        assert.strictEqual(res.statusCode, 201)
        const body = res.json()

        assert.strictEqual(body.d.Title, title)
        assert.strictEqual(body.d.Id !== undefined, true)
        id = body.d.Id
    }
    // success
    {
        const res = await server.inject({
            method: 'GET',
            url: `/movies/${id}`
        })

        assert.strictEqual(res.statusCode, 200)
        assert.deepStrictEqual(res.json().id.toString(), id.toString())
    }
})