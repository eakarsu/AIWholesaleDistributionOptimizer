// Apply pass 5 — additive backlog endpoints (NEEDS-CREDS / NEEDS-PRODUCT-DECISION / TOO-RISKY-additive).
// Documented env vars:
//   FREIGHT_API_KEY        — freight rate market data feed (NEEDS-CREDS)
//   EDI_PROVIDER_API_KEY   — EDI VAN partner (NEEDS-CREDS)
//   SAP_BASE_URL           — SAP ERP integration (NEEDS-CREDS)
//   NETSUITE_ACCOUNT_ID    — NetSuite ERP integration (NEEDS-CREDS)
//   FINANCING_API_KEY      — credit/financing partner (NEEDS-CREDS)
// PRODUCT-DECISION: financing returns underwrite-only payloads (no money movement).
// TOO-RISKY-additive: claims processing uses a new in-memory-style table (CREATE TABLE IF NOT EXISTS).
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { sequelize } = require('../models');

router.use(auth);

function gate(envVar) {
  return (req, res, next) => {
    const v = process.env[envVar];
    if (!v || v.startsWith('your_') || v === 'placeholder') {
      return res.status(503).json({ message: 'Integration not configured', missing: envVar });
    }
    next();
  };
}

async function ensureTables() {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS claims (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        order_id INTEGER,
        claim_type VARCHAR(64),
        amount NUMERIC(14,2),
        description TEXT,
        status VARCHAR(32) DEFAULT 'submitted',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS integration_calls (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        provider VARCHAR(64),
        kind VARCHAR(64),
        request JSONB,
        response JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  } catch (e) {
    // ignore — additive tables only
  }
}
ensureTables();

// ---- 1. Freight rate prediction (NEEDS-CREDS) ----
router.post('/freight/quote', gate('FREIGHT_API_KEY'), async (req, res) => {
  res.json({ ok: true, provider: 'freight', message: 'Live rate market feed would be queried here' });
});

// ---- 2. EDI inbound/outbound (NEEDS-CREDS) ----
router.post('/edi/send', gate('EDI_PROVIDER_API_KEY'), async (req, res) => {
  res.json({ ok: true, provider: 'edi', message: 'Outbound EDI document would be sent here' });
});

// ---- 3. SAP ERP push (NEEDS-CREDS) ----
router.post('/erp/sap/push', gate('SAP_BASE_URL'), async (req, res) => {
  res.json({ ok: true, provider: 'sap', message: 'BAPI / OData call would run here' });
});

// ---- 4. NetSuite ERP push (NEEDS-CREDS) ----
router.post('/erp/netsuite/push', gate('NETSUITE_ACCOUNT_ID'), async (req, res) => {
  res.json({ ok: true, provider: 'netsuite', message: 'SuiteTalk call would run here' });
});

// ---- 5. Financing / credit underwrite (NEEDS-CREDS, PRODUCT-DECISION) ----
router.post('/financing/underwrite', gate('FINANCING_API_KEY'), async (req, res) => {
  res.json({
    ok: true,
    provider: 'financing',
    message: 'PRODUCT-DECISION: underwrite-only — no money movement performed server-side',
  });
});

// ---- 6. Claims — submit ----
router.post('/claims', async (req, res) => {
  try {
    const { order_id, claim_type, amount, description } = req.body || {};
    const user_id = req.user?.id || null;
    const r = await sequelize.query(
      `INSERT INTO claims (user_id, order_id, claim_type, amount, description)
       VALUES (:u, :o, :t, :a, :d) RETURNING *`,
      {
        replacements: { u: user_id, o: order_id || null, t: claim_type || 'damage', a: amount || 0, d: description || null },
        type: sequelize.QueryTypes.INSERT,
      }
    );
    res.json({ claim: r[0] && r[0][0] });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// ---- 7. Claims — list ----
router.get('/claims', async (req, res) => {
  try {
    const rows = await sequelize.query(
      `SELECT * FROM claims ORDER BY created_at DESC LIMIT 200`,
      { type: sequelize.QueryTypes.SELECT }
    );
    res.json({ claims: rows });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
