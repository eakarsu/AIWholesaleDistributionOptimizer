// // === Batch 09 Gaps & Frontend Mounts ===
// Auto-generated gap-nonai endpoints for AIWholesaleDistributionOptimizer.
// Calls OpenRouter via native fetch (no SDK); lazily creates gap_features table.
const express = require('express');
const router = express.Router();

const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'anthropic/claude-haiku-4.5';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function runAI(system, user) {
  if (!process.env.OPENROUTER_API_KEY) {
    const e = new Error('OPENROUTER_API_KEY missing'); e.statusCode = 503; throw e;
  }
  const r = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` },
    body: JSON.stringify({ model: OPENROUTER_MODEL, messages: [
      { role: 'system', content: system }, { role: 'user', content: user }
    ], max_tokens: 1500, temperature: 0.4 })
  });
  if (!r.ok) { const e = new Error(`AI ${r.status}`); e.statusCode = 502; throw e; }
  const data = await r.json();
  const content = data?.choices?.[0]?.message?.content || '';
  let parsed = null;
  try { const m = content.match(/\{[\s\S]*\}/); if (m) parsed = JSON.parse(m[0]); } catch {}
  return { raw: content, parsed, model: data?.model };
}

let _persistInit = false;
async function persist(feature, input, output) {
  // Lazy gap_features table — best-effort, swallow errors so AI still works.
  try {
    const { PrismaClient } = require('@prisma/client');
    const p = new PrismaClient();
    if (!_persistInit) {
      await p.$executeRawUnsafe('CREATE TABLE IF NOT EXISTS gap_features (id SERIAL PRIMARY KEY, feature TEXT, input JSONB, output JSONB, created_at TIMESTAMPTZ DEFAULT NOW())');
      _persistInit = true;
    }
    await p.$executeRawUnsafe('INSERT INTO gap_features(feature, input, output) VALUES ($1, $2::jsonb, $3::jsonb)', feature, JSON.stringify(input || {}), JSON.stringify(output || {}));
  } catch { /* swallow */ }
}

// POST /api/gap-nonai-aiwholesaledistributionoptimizer/full-edi-flow-with-customer-systems-850855856810
// Full EDI flow with customer systems (850/855/856/810)
router.post('/full-edi-flow-with-customer-systems-850855856810', async (req, res) => {
  try {
    const ai = await runAI('You are an expert assistant. Reply concisely in JSON.',
      `Feature: Full EDI flow with customer systems (850/855/856/810)\nContext: ${JSON.stringify(req.body || {})}\nReturn JSON {"summary":"","key_points":[""],"recommendations":[""]}`);
    await persist('full-edi-flow-with-customer-systems-850855856810', req.body, ai);
    res.json({ feature: 'full-edi-flow-with-customer-systems-850855856810', title: 'Full EDI flow with customer systems (850/855/856/810)', result: ai });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message || 'error' });
  }
});

// POST /api/gap-nonai-aiwholesaledistributionoptimizer/financingcredit-management-with-limits-and-aging
// Financing/credit management with limits and aging
router.post('/financingcredit-management-with-limits-and-aging', async (req, res) => {
  try {
    const ai = await runAI('You are an expert assistant. Reply concisely in JSON.',
      `Feature: Financing/credit management with limits and aging\nContext: ${JSON.stringify(req.body || {})}\nReturn JSON {"summary":"","key_points":[""],"recommendations":[""]}`);
    await persist('financingcredit-management-with-limits-and-aging', req.body, ai);
    res.json({ feature: 'financingcredit-management-with-limits-and-aging', title: 'Financing/credit management with limits and aging', result: ai });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message || 'error' });
  }
});

// POST /api/gap-nonai-aiwholesaledistributionoptimizer/claims-processing-workflow-shortages-damages
// Claims processing workflow (shortages, damages)
router.post('/claims-processing-workflow-shortages-damages', async (req, res) => {
  try {
    const ai = await runAI('You are an expert assistant. Reply concisely in JSON.',
      `Feature: Claims processing workflow (shortages, damages)\nContext: ${JSON.stringify(req.body || {})}\nReturn JSON {"summary":"","key_points":[""],"recommendations":[""]}`);
    await persist('claims-processing-workflow-shortages-damages', req.body, ai);
    res.json({ feature: 'claims-processing-workflow-shortages-damages', title: 'Claims processing workflow (shortages, damages)', result: ai });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message || 'error' });
  }
});

// POST /api/gap-nonai-aiwholesaledistributionoptimizer/compliance-reporting-for-trade-agreements-usmca-etc
// Compliance reporting for trade agreements (USMCA, etc.)
router.post('/compliance-reporting-for-trade-agreements-usmca-etc', async (req, res) => {
  try {
    const ai = await runAI('You are an expert assistant. Reply concisely in JSON.',
      `Feature: Compliance reporting for trade agreements (USMCA, etc.)\nContext: ${JSON.stringify(req.body || {})}\nReturn JSON {"summary":"","key_points":[""],"recommendations":[""]}`);
    await persist('compliance-reporting-for-trade-agreements-usmca-etc', req.body, ai);
    res.json({ feature: 'compliance-reporting-for-trade-agreements-usmca-etc', title: 'Compliance reporting for trade agreements (USMCA, etc.)', result: ai });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message || 'error' });
  }
});

// POST /api/gap-nonai-aiwholesaledistributionoptimizer/customer-self-service-portal-with-order-history
// Customer self-service portal with order history
router.post('/customer-self-service-portal-with-order-history', async (req, res) => {
  try {
    const ai = await runAI('You are an expert assistant. Reply concisely in JSON.',
      `Feature: Customer self-service portal with order history\nContext: ${JSON.stringify(req.body || {})}\nReturn JSON {"summary":"","key_points":[""],"recommendations":[""]}`);
    await persist('customer-self-service-portal-with-order-history', req.body, ai);
    res.json({ feature: 'customer-self-service-portal-with-order-history', title: 'Customer self-service portal with order history', result: ai });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message || 'error' });
  }
});

// POST /api/gap-nonai-aiwholesaledistributionoptimizer/carrier-agnostic-shipping-rate-shopping
// Carrier-agnostic shipping rate shopping
router.post('/carrier-agnostic-shipping-rate-shopping', async (req, res) => {
  try {
    const ai = await runAI('You are an expert assistant. Reply concisely in JSON.',
      `Feature: Carrier-agnostic shipping rate shopping\nContext: ${JSON.stringify(req.body || {})}\nReturn JSON {"summary":"","key_points":[""],"recommendations":[""]}`);
    await persist('carrier-agnostic-shipping-rate-shopping', req.body, ai);
    res.json({ feature: 'carrier-agnostic-shipping-rate-shopping', title: 'Carrier-agnostic shipping rate shopping', result: ai });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message || 'error' });
  }
});

module.exports = router;
