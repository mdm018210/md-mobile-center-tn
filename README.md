# MD Mobile Center — e-commerce starter

## Cosa c'è già
- Homepage nello stile nero/giallo del progetto.
- Catalogo prodotti da `products.json`.
- Carrello in browser.
- Checkout Stripe con carta.
- Pagina di ordine completato.
- Pagine legali segnaposto.
- Struttura pronta per Cloudflare Pages/Functions.

## Per attivare i pagamenti
1. Crea un account Stripe Business.
2. In Cloudflare Pages aggiungi la variabile segreta `STRIPE_SECRET_KEY`.
3. Pubblica il progetto.
4. Sostituisci i prodotti demo in `products.json` con i tuoi prodotti e prezzi reali.
5. Per un vero pannello ordini/notifiche email, aggiungi una funzione webhook Stripe + database (D1) e un provider email (es. Resend). Non inserire mai la chiave Stripe nel codice del browser.

## Importante
I testi legali presenti sono solo segnaposto e vanno adattati alla tua attività con un professionista.

## Ordini e avvisi
Il progetto include anche:
- webhook Stripe per registrare gli ordini;
- database Cloudflare D1;
- pannello `/admin.html`;
- notifica email via Resend.

### Variabili segrete da impostare in Cloudflare Pages
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `ADMIN_PASSWORD`
- `RESEND_API_KEY` (se vuoi l'email automatica)
- `ORDER_NOTIFY_EMAIL` (la tua email per gli avvisi)
- `EMAIL_FROM` (mittente verificato su Resend, opzionale)

### D1
Crea un database D1, inserisci il suo ID in `wrangler.toml`, poi esegui `schema.sql` sul database.

### Stripe webhook
Dopo la pubblicazione, crea in Stripe un endpoint verso:
`https://TUO-SITO.it/api/stripe-webhook`
e abilita almeno l'evento `checkout.session.completed`. Copia il signing secret nella variabile `STRIPE_WEBHOOK_SECRET`.

### Prima della pubblicazione
- Sostituisci i prodotti demo con prodotti reali.
- Inserisci le foto reali dei telefoni.
- Completa i testi legali con i dati della tua attività.
- Configura spedizioni, IVA e condizioni di vendita secondo la tua situazione fiscale.
