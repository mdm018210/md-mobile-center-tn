import products from '../../products.json' assert { type: 'json' };
export async function onRequestGet(){ return new Response(JSON.stringify(products),{headers:{'content-type':'application/json'}}); }
