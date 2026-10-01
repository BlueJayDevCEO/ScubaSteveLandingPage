import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
process.env.RESEND_API_KEY='test-key';
const { default: handler }=await import('../api/business-interest.js');
const valid={visitorType:'business',name:'Owner',email:'owner@example.test',businessName:'Test Divers',businessType:'Dive Centre',country:'UK'};
async function invoke(body,method='POST') {
  const res={code:0,body:null,setHeader(){},status(code){this.code=code;return this;},json(body){this.body=body;return this;},end(){return this;}};
  await handler({method,headers:{},body},res);return res;
}
test('validation, honeypot, body size and methods',async()=>{
  assert.equal((await invoke({...valid,email:'bad'})).code,400);
  assert.equal((await invoke({...valid,website:'javascript:bad'})).code,400);
  assert.equal((await invoke({...valid,businessName:''})).code,400);
  assert.equal((await invoke({...valid,message:'x'.repeat(9000)})).code,413);
  assert.equal((await invoke({...valid,websiteUrl:'bot'})).body.spam,true);
  assert.equal((await invoke(valid,'GET')).code,405);
});
test('Firestore fallback saves distinct repeat submissions and survives email failure',async()=>{
  const {privateKey}=crypto.generateKeyPairSync('rsa',{modulusLength:2048});
  process.env.ADMIN_CREDENTIALS_JSON=JSON.stringify({project_id:'test-project',client_email:'test@example.test',private_key:privateKey.export({type:'pkcs8',format:'pem'})});
  const original=globalThis.fetch; const paths=[];
  globalThis.fetch=async(url,options)=>{
    if(url.includes('oauth2')) return {ok:true,json:async()=>({access_token:'mock-token',expires_in:3600})};
    if(url.includes('firestore')) {paths.push(url);assert.equal(options.method,'PATCH');return {ok:true};}
    return {ok:false,status:500,text:async()=>''};
  };
  try {
    assert.equal((await invoke(valid)).body.stored,true);
    assert.equal((await invoke({...valid,message:'new information'})).body.stored,true);
    assert.equal(paths.length,2);assert.notEqual(paths[0],paths[1]);
    globalThis.fetch=async()=>({ok:false,status:500,text:async()=>''});
    assert.equal((await invoke(valid)).code,500);
  } finally {globalThis.fetch=original;delete process.env.ADMIN_CREDENTIALS_JSON;}
});
test('every submission emails; failure cannot falsely report success without storage',async()=>{
  const original=globalThis.fetch; const payloads=[];
  globalThis.fetch=async(url,options)=>{payloads.push(JSON.parse(options.body));return {ok:true};};
  try {
    assert.equal((await invoke(valid)).body.emailed,true);
    assert.equal((await invoke(valid)).body.emailed,true);
    assert.equal(payloads.length,2); assert.equal(payloads[0].reply_to,valid.email);
    globalThis.fetch=async()=>({ok:false,status:500,text:async()=>''});
    assert.equal((await invoke(valid)).code,500);
  } finally {globalThis.fetch=original;}
});
