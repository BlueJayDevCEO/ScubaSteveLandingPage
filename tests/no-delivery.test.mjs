import { test } from 'node:test';
import assert from 'node:assert/strict';
delete process.env.RESEND_API_KEY;
delete process.env.ADMIN_CREDENTIALS_JSON;
delete process.env.FIREBASE_PROJECT_ID;
const {default:handler}=await import('../api/business-interest.js');
test('unconfigured delivery returns 503, never success',async()=>{
  const res={status(code){this.code=code;return this;},json(body){this.body=body;return this;},setHeader(){}};
  await handler({method:'POST',headers:{},body:{visitorType:'business',name:'Owner',email:'owner@example.test',businessName:'Test',businessType:'Dive Centre',country:'UK'}},res);
  assert.equal(res.code,503);
});
