
/// <reference path="../global.d.ts" />
'use strict'

const composeXml = require('../lib/util/xml');
const createCrudRoutes = require('../lib/util/v2-routes');

/**
 * Registers the Routing v2.
 * @param {import('fastify').FastifyInstance} fastify - The Fastify instance.
 * @param {import('fastify').FastifyOptions} opts - The Fastify options.
 */
const _oDataV2 = async function (fastify, opts, done) {
  const entities = fastify.platformatic.entities;
  fastify.get('/$metadata', async (request, reply) => {
    reply.type('application/xml').send(composeXml({ entities }))
  })
  createCrudRoutes(fastify, entities)
}

/**
 * Registers the OData v2 plugin with Fastify.
 * @param {import('fastify').FastifyInstance} fastify - The Fastify instance.
 * @param {import('fastify').FastifyOptions} opts - The Fastify options.
 */
module.exports = async function (fastify, opts, done) {
  const { v2, v4 } = opts;

  await fastify.register(require('fastify-xml-body-parser'))

  await fastify.register(_oDataV2, { prefix: '/v2' })

  fastify.decorate('odata', 'v2')
  done()
}

// TODO
// [ ] Prevedere la gestione della label per le property
// [ ] Gestire MaxLength="15" Unicode="true" FixedLength="false" Precision="15" Scale="0"
// [ ] Gestire le relazioni
// [ ] Gestire crud: GET Query, GET Read, POST Create, PUT Update, DELETE Delete
// [ ] Gestire le query option (se necessario) $filter, $select, $expand, $orderby, $top, $skip, $count, $search, $format