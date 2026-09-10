import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const spec = JSON.parse(await readFile(new URL('../public/openapi/jobs.json',import.meta.url),'utf8'));
const catalogue = JSON.parse(await readFile(new URL('../public/api/catalog.json',import.meta.url),'utf8'));
test('Jobs OpenAPI exposes only documented customer operations and public proof', () => {
  assert.equal(spec.openapi,'3.1.0');
  assert.equal(spec.servers[0].url,'https://data.exende.dev');
  const jobs = catalogue.products.find(p=>p.id==='jobs-data');
  const paid = [...jobs.credit_metering.fixed,...jobs.credit_metering.per_returned_record];
  assert.equal(Object.keys(spec.paths).length,paid.length+2);
  for(const route of paid) {
    const op=spec.paths[route.route]?.get;
    assert.ok(op,`Missing ${route.route}`);
    assert.match(op['x-credit-cost'],new RegExp(String(route.credits)));
    assert.ok(['jobs:read','companies:read','signals:read'].includes(op['x-required-scope']));
    assert.equal(op.security,undefined,'customer routes inherit bearer auth');
  }
  assert.deepEqual(spec.paths['/v1/public/overview'].get.security,[]);
  assert.equal(jobs.openapi,'https://www.exende.dev/openapi/jobs.json');
});
test('search and history document the implemented bounds instead of invented pagination', () => {
  assert.equal(spec.paths['/v1/jobs/search'].get.parameters.find(p=>p.name==='q').required,true);
  for(const path of ['/v1/jobs','/v1/jobs/search','/v1/companies/{domain}/jobs']) {
    assert.equal(spec.paths[path].get.parameters.find(p=>p.name==='limit').schema.maximum,100);
    assert.ok(spec.paths[path].get.parameters.find(p=>p.name==='cursor'));
  }
  for(const path of ['/v1/skills','/v1/history']) assert.deepEqual(spec.paths[path].get.parameters,[]);
  assert.equal(spec.paths['/v1/jobs/{id}/history'].get.parameters.some(p=>p.name==='cursor'),false);
  assert.deepEqual(spec.components.schemas.Job.properties.country_code.type,['string','null']);
});

test('public preview declares bounded anonymous access and strict sample schema',()=>{
 const op=spec.paths['/v1/public/search'].get;
 assert.deepEqual(op.security,[]);
 assert.deepEqual(op.parameters.map(p=>p.name),['q']);
 assert.equal(op.parameters[0].schema.maxLength,80);
 assert.equal(spec.components.schemas.PublicCataloguePreview.properties.sample_jobs.maxItems,5);
 assert.equal(spec.components.schemas.PublicJobSample.additionalProperties,false);
 for(const field of ['description_text','source_payload','source_health','email','api_key','billing']) assert.equal(spec.components.schemas.PublicJobSample.properties[field],undefined);
});
