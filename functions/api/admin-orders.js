import {isAuthed} from '../_auth.js';
export async function onRequestGet({request,env}){
  if(!await isAuthed(request,env)) return Response.json({error:"Non autorizzato"},{status:401});
  if(!env.DB) return Response.json({error:"D1 non configurato"},{status:500});
  const {results}=await env.DB.prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT 100").all();
  return Response.json(results);
}
