import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
test('built pilot has crawlable content and dedicated metadata before JavaScript',async()=>{
  const html=await readFile(new URL('../dist/dive-centres/index.html',import.meta.url),'utf8');
  assert.match(html,/<link rel="canonical" href="https:\/\/www.scubasteve.rocks\/dive-centres"/);
  assert.match(html,/<meta property="og:url" content="https:\/\/www.scubasteve.rocks\/dive-centres"/);
  assert.match(html,/<meta name="twitter:title" content="Dive Centre Pilot/);
  assert.match(html,/<h1[^>]*>Your dive centre already has the answers/);
  assert.match(html,/name="businessName"/);
  const schema=JSON.parse(html.match(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)[1]);
  assert.equal(schema['@type'],'WebPage');assert.equal(schema.url,'https://www.scubasteve.rocks/dive-centres');
  assert.match(html,/data-home-schema=/);
});
