import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
test('built pilot has crawlable content and dedicated metadata before JavaScript',async()=>{
  const html=await readFile(new URL('../dist/dive-centres/index.html',import.meta.url),'utf8');
  assert.match(html,/<link rel="canonical" href="https:\/\/centres.scubasteve.rocks\/dive-centres"/);
  assert.match(html,/<meta property="og:url" content="https:\/\/centres.scubasteve.rocks\/dive-centres"/);
  assert.match(html,/<meta name="twitter:title" content="AI for Dive Centres/);
  assert.match(html,/<h1[^>]*>Your dive centre already has the answers/);
  assert.match(html,/name="businessName"/);
  const schema=JSON.parse(html.match(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)[1]);
  assert.equal(schema['@type'],'WebPage');assert.equal(schema.url,'https://centres.scubasteve.rocks/dive-centres');
  assert.doesNotMatch(html,/data-home-schema=/);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  const root=await readFile(new URL("../dist/index.html",import.meta.url),"utf8");
  assert.match(root, /http-equiv="refresh" content="0; url=\/dive-centres"/);
  assert.match(root, /centres.scubasteve.rocks\/dive-centres/);
});
