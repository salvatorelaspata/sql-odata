'use strict'

const test = require('node:test')
const assert = require('node:assert')
const { getServer } = require('../helper')

test('odata v2 decorator', async (t) => {
  const server = await getServer(t)

  assert.strictEqual(server.odata, 'v2')
})
