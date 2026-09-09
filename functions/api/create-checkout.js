export async function onRequestPost({request,env}){
  if(!env.STRIPE_SECRET_KEY) return Response.json({error:"Stripe non configurato: aggiungi STRIPE_SECRET_KEY nelle variabili d'ambiente."},{status:500});
  const body=await request.json(); const items=body.items||[];
  if(!items.length) return Response.json({error:"Carrello vuoto."},{status:400});
  const params=new URLSearchParams();
  params.set("mode","payment");
  params.set("success_url",new URL("/ordine-ok.html",request.url).toString()+"?session_id={CHECKOUT_SESSION_ID}");
  params.set("cancel_url",new URL("/carrello.html",request.url).toString());
  params.set("billing_address_collection","required");
  params.set("shipping_address_collection[allowed_countries][0]","IT");
  items.forEach((i,n)=>{
    params.set(`line_items[${n}][price_data][currency]`,"eur");
    params.set(`line_items[${n}][price_data][product_data][name]`,i.name);
    params.set(`line_items[${n}][price_data][product_data][description]`,`${i.storage||""} • ${i.color||""} • ${i.condition||""}`);
    params.set(`line_items[${n}][price_data][unit_amount]`,String(Math.round(Number(i.price)*100)));
    params.set(`line_items[${n}][quantity]`,String(Math.max(1,Number(i.qty)||1)));
  });
  params.set("metadata[source]","MD Mobile Center");
  const r=await fetch("https://api.stripe.com/v1/checkout/sessions",{method:"POST",headers:{"Authorization":`Bearer ${env.STRIPE_SECRET_KEY}`,"Content-Type":"application/x-www-form-urlencoded"},body:params});
  const d=await r.json(); if(!r.ok)return Response.json({error:d.error?.message||"Stripe error"},{status:500});
  return Response.json({url:d.url});
}