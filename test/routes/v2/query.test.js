'use strict'

const test = require('node:test')
const assert = require('node:assert')
const { getServer } = require('../../helper')

test('query', async (t) => {
  const server = await getServer(t)

  {
    const res = await server.inject({
      method: 'GET',
      url: '/v2/Movies'
    })

    assert.strictEqual(res.statusCode, 200)
    assert.deepStrictEqual(res.json(), { d: { results: [] } })
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
      url: '/v2/Movies'
    })

    assert.strictEqual(res.statusCode, 200)
    assert.deepStrictEqual(res.json(), {
      d: {
        results: [{
          id: id.toString(),
          title: 'The Matrix'
        }]
      }
    })
  }
})

test('query with filter', async (t) => {
  const server = await getServer(t)
  const title = 'The Matrix 2'
  let id
  {
    const res = await server.inject({
      method: 'POST',
      url: '/v2/Movies',
      body: {
        title
      }
    })

    assert.strictEqual(res.statusCode, 200)
    const body = res.json()
    assert.strictEqual(body.title, title)
    assert.strictEqual(body.id !== undefined, true)
    id = body.id
  }

  {
    const res = await server.inject({
      method: 'GET',
      url: `/movies?$filter=Title eq The ${title}`
    })

    assert.strictEqual(res.statusCode, 200)
    assert.deepStrictEqual(res.json(), {
      d: {
        results: [{
          id,
          title: 'The Matrix'
        }]
      }
    })
  }
})
