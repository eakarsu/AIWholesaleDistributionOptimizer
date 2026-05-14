// Custom feature endpoints (batch_09 audit suggestions)
const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const router = express.Router();

const requireAIKey = (req, res, next) => {
  const k = process.env.OPENROUTER_API_KEY;
  if (!k || k.startsWith('your_')) return res.status(503).json({ message: 'AI not configured. Set OPENROUTER_API_KEY in server .env.' });
  next();
};

async function callLLM(system, user, { maxTokens = 2000, temperature = 0.5 } = {}) {
  const r = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
    model: process.env.OPENROUTER_MODEL || 'anthropic/claude-haiku-4.5',
    messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    max_tokens: maxTokens, temperature,
  }, { headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' } });
  return { content: r.data?.choices?.[0]?.message?.content || '', model: r.data?.model };
}

function parseJSON(t) {
  if (!t) return null;
  const c = String(t).replace(/```(?:json)?/gi, '').replace(/```/g, '');
  const m = c.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try { return JSON.parse(m[0]); } catch { return null; }
}

function err(res, e, label) {
  console.error(`${label} error:`, e.message);
  res.status(500).json({ message: e.message });
}

// 1. Predictive churn modeling for top wholesale customers
router.post('/customer-churn', auth, requireAIKey, async (req, res) => {
  try {
    const { customer, recent_orders, support_signals } = req.body || {};
    if (!customer) return res.status(400).json({ message: 'customer required' });
    const ai = await callLLM(
      'You score wholesale-customer churn risk. JSON only.',
      `CUSTOMER: ${JSON.stringify(customer)}\nORDERS: ${JSON.stringify(recent_orders || [])}\nSIGNALS: ${JSON.stringify(support_signals || {})}\nReturn JSON {"churn_probability_90d":0,"tier":"low|med|high","top_drivers":[""],"save_actions":[{"action":"","owner":"sales|cs|exec","ETA_days":0}]}`
    );
    res.json({ type: 'customer-churn', result: parseJSON(ai.content) || { raw: ai.content }, model: ai.model });
  } catch (e) { err(res, e, 'customer-churn'); }
});

// 2. Dynamic discount engine respecting margin floors
router.post('/dynamic-discount', auth, requireAIKey, async (req, res) => {
  try {
    const { product, customer_tier, base_price, margin_floor_pct, competitor_price } = req.body || {};
    if (!product || base_price == null) return res.status(400).json({ message: 'product and base_price required' });
    const ai = await callLLM(
      'You quote a discount that respects margin floor. JSON only.',
      `PRODUCT: ${JSON.stringify(product)}\nTIER: ${customer_tier || 'standard'}\nBASE_PRICE: ${base_price}\nMARGIN_FLOOR_PCT: ${margin_floor_pct || 15}\nCOMPETITOR: ${competitor_price || 'n/a'}\nReturn JSON {"discount_pct":0,"final_price":0,"estimated_margin_pct":0,"rationale":"","escalation_required":false}`
    );
    res.json({ type: 'dynamic-discount', result: parseJSON(ai.content) || { raw: ai.content }, model: ai.model });
  } catch (e) { err(res, e, 'dynamic-discount'); }
});

// 3. Supplier diversification optimization
router.post('/supplier-diversification', auth, requireAIKey, async (req, res) => {
  try {
    const { product_category, current_suppliers, geo_risks } = req.body || {};
    if (!Array.isArray(current_suppliers)) return res.status(400).json({ message: 'current_suppliers array required' });
    const ai = await callLLM(
      'You recommend supplier diversification to hedge supply risk. JSON only.',
      `CATEGORY: ${product_category || 'mixed'}\nSUPPLIERS: ${JSON.stringify(current_suppliers)}\nGEO_RISKS: ${JSON.stringify(geo_risks || [])}\nReturn JSON {"concentration_score":0,"single_points_of_failure":[""],"recommended_additions":[{"region":"","supplier_type":"","why":""}],"target_mix":[{"supplier_id":"","share_pct":0}]}`
    );
    res.json({ type: 'supplier-diversification', result: parseJSON(ai.content) || { raw: ai.content }, model: ai.model });
  } catch (e) { err(res, e, 'supplier-diversification'); }
});

// 4. Demand sensing from downstream (POS) data
// TODO: configure credentials for POS_FEED_API_KEY (retail partner POS integration).
router.post('/pos-demand-sensing', auth, requireAIKey, async (req, res) => {
  try {
    const { sku, pos_series, lead_time_days } = req.body || {};
    if (!sku || !Array.isArray(pos_series)) return res.status(400).json({ message: 'sku and pos_series required' });
    const ai = await callLLM(
      `You sense demand from POS time-series and recommend wholesale order adjustments. POS feed: ${Boolean(process.env.POS_FEED_API_KEY)}. JSON only.`,
      `SKU: ${sku}\nPOS_SERIES: ${JSON.stringify(pos_series.slice(0,40))}\nLEAD_DAYS: ${lead_time_days || 14}\nReturn JSON {"trend":"up|flat|down","next_4wk_forecast":[0,0,0,0],"recommended_order_units":0,"signal_strength":0,"anomalies":[""]}`
    );
    res.json({ type: 'pos-demand-sensing', result: parseJSON(ai.content) || { raw: ai.content }, model: ai.model });
  } catch (e) { err(res, e, 'pos-demand-sensing'); }
});

// 5. Collaborative forecasting with key customers
router.post('/collab-forecast', auth, requireAIKey, async (req, res) => {
  try {
    const { customer_id, customer_forecast, internal_forecast } = req.body || {};
    if (!customer_id) return res.status(400).json({ message: 'customer_id required' });
    const ai = await callLLM(
      'You reconcile customer-supplied forecast with internal model and propose a consensus plan. JSON only.',
      `CUSTOMER: ${customer_id}\nCUSTOMER_FCST: ${JSON.stringify(customer_forecast || {})}\nINTERNAL_FCST: ${JSON.stringify(internal_forecast || {})}\nReturn JSON {"consensus":[{"period":"","units":0}],"divergence_pct":0,"discussion_points":[""],"confidence":0}`
    );
    res.json({ type: 'collab-forecast', result: parseJSON(ai.content) || { raw: ai.content }, model: ai.model });
  } catch (e) { err(res, e, 'collab-forecast'); }
});

// 6. Automated contract renewal recommendation engine
router.post('/contract-renewal', auth, requireAIKey, async (req, res) => {
  try {
    const { contract, performance_metrics, market_rates } = req.body || {};
    if (!contract) return res.status(400).json({ message: 'contract required' });
    const ai = await callLLM(
      'You recommend renew / renegotiate / drop for a wholesale contract. JSON only.',
      `CONTRACT: ${JSON.stringify(contract)}\nMETRICS: ${JSON.stringify(performance_metrics || {})}\nMARKET: ${JSON.stringify(market_rates || {})}\nReturn JSON {"recommendation":"renew|renegotiate|drop","target_terms":{"price":"","volume":"","duration_months":0},"justification":"","next_action_owner":""}`
    );
    res.json({ type: 'contract-renewal', result: parseJSON(ai.content) || { raw: ai.content }, model: ai.model });
  } catch (e) { err(res, e, 'contract-renewal'); }
});

// 7. Freight optimization across carriers with AI rate prediction
// TODO: configure credentials for FREIGHT_RATE_API_KEY (Project44/FreightWaves).
router.post('/freight-optimize', auth, requireAIKey, async (req, res) => {
  try {
    const { lane, weight_lb, volume_cuft, service_level } = req.body || {};
    if (!lane) return res.status(400).json({ message: 'lane required' });
    const ai = await callLLM(
      `You forecast carrier rates and recommend a freight plan. Rate API: ${Boolean(process.env.FREIGHT_RATE_API_KEY)}. JSON only.`,
      `LANE: ${JSON.stringify(lane)}\nWEIGHT_LB: ${weight_lb || 0}\nVOL_CUFT: ${volume_cuft || 0}\nSLA: ${service_level || 'standard'}\nReturn JSON {"recommended_carrier":"","estimated_rate_usd":0,"transit_days":0,"alternatives":[{"carrier":"","rate":0}],"rate_trend":"up|flat|down"}`
    );
    res.json({ type: 'freight-optimize', result: parseJSON(ai.content) || { raw: ai.content }, model: ai.model });
  } catch (e) { err(res, e, 'freight-optimize'); }
});

// 8. ERP integration (SAP, NetSuite)
// TODO: configure credentials for ERP_API_KEY / ERP_BASE_URL.
router.post('/erp-sync', auth, requireAIKey, async (req, res) => {
  try {
    const { entity, payload } = req.body || {};
    if (!entity) return res.status(400).json({ message: 'entity required' });
    const ai = await callLLM(
      `You map our wholesale entity to an ERP IDoc/REST shape (SAP/NetSuite). ERP creds set: ${Boolean(process.env.ERP_API_KEY)}. JSON only.`,
      `ENTITY: ${entity}\nPAYLOAD: ${JSON.stringify(payload || {})}\nReturn JSON {"erp_format":"SAP_IDOC|NETSUITE_REST","mapped_payload":{},"required_fields_missing":[""],"sync_status":"ready|blocked"}`
    );
    res.json({ type: 'erp-sync', result: parseJSON(ai.content) || { raw: ai.content }, model: ai.model });
  } catch (e) { err(res, e, 'erp-sync'); }
});

module.exports = router;
