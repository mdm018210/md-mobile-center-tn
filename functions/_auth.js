async function hmac(value, secret){
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const sig=await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(value));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}
export async function makeSession(secret){
  const payload=`${Date.now()}.${crypto.randomUUID()}`;
  return `${payload}.${await hmac(payload,secret)}`;
}
export async function isAuthed(request,env){
  const c=request.headers.get("Cookie")||"";
  const m=c.match(/md_admin=([^;]+)/); if(!m||!env.ADMIN_PASSWORD)return false;
  const parts=m[1].split("."); if(parts.length<3)return false;
  const [a,b,sig]=parts; if(Date.now()-Number(a)>86400000)return false;
  const expected=await hmac(`${a}.${b}`,env.ADMIN_PASSWORD);
  return sig===expected;
}
