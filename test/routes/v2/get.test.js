'use strict'

const test = require('node:test')
const assert = require('node:assert')
const { getServer } = require('../../helper')

test('get', async (t) => {
  const server = await getServer(t)

  {
    const res = await server.inject({
      method: 'GET',
      url: '/v2/Movies(1)'
    })

    assert.strictEqual(res.statusCode, 404)
  }

  let id
  {
    const res = await server.inject({
      method: 'POST',
      url: '/movies',
      body: {
        title: 'The Matrix'
      }
    })

    assert.strictEqual(res.statusCode, 200)
    const body = res.json()
    assert.strictEqual(body.title, 'The Matrix')
    assert.strictEqual(body.id !== undefined, true)
    id = body.id
  }

  {
    const res = await server.inject({
      method: 'GET',
      url: `/v2/Movies('${id}')`
    })

    assert.strictEqual(res.statusCode, 200)
    assert.deepStrictEqual(res.json(), {
      d: {
        Id: id.toString(),
        Title: 'The Matrix'
      }
    })
  }
})


test('get with select', async (t) => {
  const server = await getServer(t)
  const title = 'The Matrix'
  let id
  {
    const res = await server.inject({
      method: 'POST',
      url: '/movies',
      body: {
        title: title
      }
    })

    assert.strictEqual(res.statusCode, 200)
    const body = res.json()
    assert.strictEqual(body.title, title)
    assert.strictEqual(body.id !== undefined, true)
    id = body.id
  }

  // success
  {
    const res = await server.inject({
      method: 'GET',
      url: `/v2/Movies(${id})?$select=Title`
    })

    assert.strictEqual(res.statusCode, 200)
    assert.deepStrictEqual(res.json(), {
      d: {
        Title: title.toString()
      }
    })
  }
})