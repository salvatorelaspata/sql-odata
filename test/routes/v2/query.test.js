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
          __metadata: {
            type: 'NorthwindModel.Movies',
            uri: `http://localhost:80/Movies(${id})`
          },
          Id: id.toString(),
          Title: 'The Matrix',
        }]
      }
    })
  }
})

test('query with filter (eq)', async (t) => {
  const server = await getServer(t)
  const title = 'The Matrix 2'
  let id
  {
    const res = await server.inject({
      method: 'POST',
      url: '/movies',
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
      url: `/v2/Movies?$filter=Title eq ${title}`
    })

    assert.strictEqual(res.statusCode, 200)
    assert.deepStrictEqual(res.json(), {
      d: {
        results: [{
          __metadata: {
            type: 'NorthwindModel.Movies',
            uri: `http://localhost:80/Movies(${id})`
          },
          Id: `${id.toString()}`,
          Title: title
        }]
      }
    })
  }
})

const _createEntity = async (server, title) => {
  const res = await server.inject({
    method: 'POST',
    url: '/movies',
    body: {
      title
    }
  })

  assert.strictEqual(res.statusCode, 200)
  const body = res.json()
  assert.strictEqual(body.title, title)
  assert.strictEqual(body.id !== undefined, true)
  return body.id
}

test('query with filter (cp)', async (t) => {
  const server = await getServer(t)
  const title1 = 'The Matrix'
  const title2 = 'The Matrix 2'
  const id1 = await _createEntity(server, title1)
  const id2 = await _createEntity(server, title2)

  {
    const res = await server.inject({
      method: 'GET',
      url: `/v2/Movies?$filter=Title cp ${title1.split(' ')[0]}`
    })

    assert.strictEqual(res.statusCode, 200)
    assert.deepStrictEqual(res.json(), {
      d: {
        results: [{
          __metadata: {
            type: 'NorthwindModel.Movies',
            uri: `http://localhost:80/Movies(${id1})`
          },
          Id: `${id1.toString()}`,
          Title: title1
        }, {
          __metadata: {
            type: 'NorthwindModel.Movies',
            uri: `http://localhost:80/Movies(${id2})`
          },
          Id: `${id2.toString()}`,
          Title: title2
        }]
      }
    })
  }
})

test('query with select', async (t) => {
  const server = await getServer(t)
  const title = 'The Matrix'
  let id
  {
    const res = await server.inject({
      method: 'POST',
      url: '/movies',
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

  // success
  {
    const res = await server.inject({
      method: 'GET',
      url: `/v2/Movies?$select=Title`
    })

    assert.strictEqual(res.statusCode, 200)
    assert.deepStrictEqual(res.json(), {
      d: {
        results: [{
          __metadata: {
            type: 'NorthwindModel.Movies',
            uri: `http://localhost:80/Movies(${id})`
          },
          Title: title.toString()
        }]
      }
    })
  }
})