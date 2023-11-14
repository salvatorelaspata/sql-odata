'use strict'

const test = require('node:test')
const assert = require('node:assert')
const { getServer } = require('../helper')

test('$metadata', async (t) => {
  const server = await getServer(t)
  const res = await server.inject({
    method: 'GET',
    url: '/$metadata'
  })

  assert.strictEqual(res.statusCode, 200)
  assert.deepStrictEqual(res.json(), {})
})
