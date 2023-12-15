'use strict'
const fs = require('fs')
const test = require('node:test')
const assert = require('node:assert')
const { getServer } = require('../../helper')
const xml2js = require('xml2js') // xml parser to compare file without considering the indentation (woraound)
const path = require('path')

// read file metadata.xml
const metadata = fs.readFileSync(path.join(__dirname, '..', '..', 'metadata.xml'), 'utf8')
test('$metadata', async (t) => {
  const server = await getServer(t)
  const res = await server.inject({
    method: 'GET',
    url: '/v2/$metadata'
  })
  const parser = new xml2js.Parser();
  const _body = await parser.parseStringPromise(res.body)
  const _metadata = await parser.parseStringPromise(metadata)
  assert.strictEqual(res.statusCode, 200)
  assert.deepStrictEqual(_body, _metadata)
})
