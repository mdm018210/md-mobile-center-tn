import {makeSession} from '../_auth.js';
export async function onRequestPost({request,env}){
  const {password}=await request.json();
  if(!env.ADMIN_PASSWORD || password!==env.ADMIN_PASSWORD) return Response.json({error:"Password errata"},{status:401});
  const token=await makeSession(env.ADMIN_PASSWORD);
  return new Response(JSON.stringify({ok:true}),{headers:{"content-type":"application/json","Set-Cookie":`md_admin=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`}});
}
