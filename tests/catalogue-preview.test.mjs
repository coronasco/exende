import test from 'node:test';
import assert from 'node:assert/strict';
import {parseCataloguePreview} from '../src/lib/catalogue-preview.ts';
function fixture(){return {data:{query:'',summary:{active_jobs:1,companies:1,countries:0,locations:0,country_unclassified_jobs:1,first_observed_at:null,last_observed_at:null},top_locations:[],top_countries:[],top_roles:[],top_companies:[],sample_jobs:[{id:'fixture',title:'Structural test record',company:'Test fixture',location:null,country_code:null,employment_type:'unknown',workplace_type:'unknown',status:'active',first_seen_at:null,last_seen_at:null,description_text:'must not reach browser'}],preview:{sample_limit:5,pool_limit:12,enrolled_samples:1,pagination:false,projection:'limited_public_fields'},private:'must not reach browser'}};}
test('browser projection excludes every unrecognized response field',()=>{const result=parseCataloguePreview(fixture());assert.equal(result.sample_jobs.length,1);assert(!JSON.stringify(result).includes('must not reach browser'));});
test('preview parser rejects widened bounds, malformed counts and invalid timestamps',()=>{
 for(const change of [d=>d.preview.pool_limit=100,d=>d.preview.pagination=true,d=>d.preview.enrolled_samples=13,d=>d.sample_jobs=Array(6).fill(d.sample_jobs[0]),d=>d.summary.active_jobs=-1,d=>d.sample_jobs[0].last_seen_at='not-a-date']){const payload=fixture();change(payload.data);assert.throws(()=>parseCataloguePreview(payload));}
});
