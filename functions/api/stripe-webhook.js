import Stripe from 'stripe';
export async function onRequestPost({request,env}){
  if(!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) return new Response("Webhook non configurato",{status:500});
  const stripe=new Stripe(env.STRIPE_SECRET_KEY);
  const body=await request.text();
  let event;
  try{event=stripe.webhooks.constructEvent(body,request.headers.get("stripe-signature"),env.STRIPE_WEBHOOK_SECRET)}
  catch(e){return new Response("Firma non valida",{status:400})}
  if(event.type==="checkout.session.completed"){
    const s=event.data.object;
    const items=(await stripe.checkout.sessions.listLineItems(s.id,{limit:100})).data.map(x=>({name:x.description||x.price?.product||"Prodotto",qty:x.quantity,amount:x.amount_total}));
    if(env.DB){
      await env.DB.prepare(`INSERT OR IGNORE INTO orders
      (id,stripe_session_id,email,customer_name,total_cents,currency,status,items_json,shipping_json,created_at)
      VALUES(?,?,?,?,?,?,?,?,?,?)`).bind(
        crypto.randomUUID(),s.id,s.customer_details?.email||"",s.customer_details?.name||"",
        s.amount_total||0,s.currency||"eur","paid",JSON.stringify(items),
        JSON.stringify(s.shipping_details||{}),new Date().toISOString()
      ).run();
    }
    if(env.RESEND_API_KEY && env.ORDER_NOTIFY_EMAIL){
      const lines=items.map(i=>`${i.qty} × ${i.name}`).join("\n");
      await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":`Bearer ${env.RESEND_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({
        from:env.EMAIL_FROM||"MD Mobile Center <onboarding@resend.dev>",
        to:[env.ORDER_NOTIFY_EMAIL],
        subject:`🔔 Nuovo ordine MD Mobile Center`,
        text:`Nuovo ordine pagato.\n\nCliente: ${s.customer_details?.name||""}\nEmail: ${s.customer_details?.email||""}\nTotale: €${((s.amount_total||0)/100).toFixed(2)}\n\n${lines}`
      })});
    }
  }
  return new Response("ok");
}
