CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  stripe_session_id TEXT UNIQUE NOT NULL,
  email TEXT,
  customer_name TEXT,
  total_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'eur',
  status TEXT NOT NULL DEFAULT 'paid',
  items_json TEXT NOT NULL,
  shipping_json TEXT,
  created_at TEXT NOT NULL
);
