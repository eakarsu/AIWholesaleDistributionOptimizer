const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

// 503 helper
const requireAIKey = (req, res, next) => {
  const k = process.env.OPENROUTER_API_KEY;
  if (!k || k === 'your_openrouter_api_key_here' || k === 'your_openrouter_key_here') {
    return res.status(503).json({ message: 'AI not configured', error: 'AI not configured. Set OPENROUTER_API_KEY in server .env.' });
  }
  next();
};

const callOpenRouter = async (prompt, systemPrompt) => {
  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: process.env.OPENROUTER_MODEL || 'anthropic/claude-haiku-4.5',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:4000',
        'X-Title': 'Wholesale Distribution Optimizer'
      }
    }
  );
  return response.data.choices[0].message.content;
};

// Territory Analysis AI
router.post('/territory-analysis', auth, async (req, res) => {
  try {
    const { territory } = req.body;
    const prompt = `Analyze this wholesale distribution territory and provide strategic recommendations:
    Territory: ${territory.name}
    Region: ${territory.region}
    State: ${territory.state}
    Customer Count: ${territory.customerCount}
    Annual Revenue: $${territory.annualRevenue}
    Growth Rate: ${territory.growthRate}%
    Market Potential: ${territory.marketPotential}

    Provide: 1) Market opportunity assessment 2) Growth strategy recommendations 3) Resource allocation suggestions 4) Competitive positioning advice 5) Risk factors to consider`;

    const analysis = await callOpenRouter(prompt, 'You are an expert wholesale distribution territory planning analyst. Provide actionable, data-driven insights for territory optimization. Format your response with clear sections using markdown headers and bullet points.');
    res.json({ analysis });
  } catch (err) {
    console.error('AI Error:', err.response?.data || err.message);
    res.status(500).json({ message: 'AI analysis failed', error: err.response?.data?.error?.message || err.message });
  }
});

// Order Pattern Analysis AI
router.post('/order-analysis', auth, async (req, res) => {
  try {
    const { orders } = req.body;
    const orderSummary = orders.map(o => `${o.customerName}: ${o.products} - Qty: ${o.quantity}, Total: $${o.totalAmount}, Freq: ${o.frequency}, Pattern: ${o.pattern}`).join('\n');

    const prompt = `Analyze these wholesale order patterns and provide insights:
    ${orderSummary}

    Provide: 1) Order frequency patterns 2) Seasonal trends 3) Customer segmentation 4) Revenue optimization opportunities 5) Demand forecasting suggestions`;

    const analysis = await callOpenRouter(prompt, 'You are an expert wholesale distribution order analyst. Identify patterns, anomalies, and opportunities in order data. Format your response with clear sections using markdown headers and bullet points.');
    res.json({ analysis });
  } catch (err) {
    console.error('AI Error:', err.response?.data || err.message);
    res.status(500).json({ message: 'AI analysis failed', error: err.response?.data?.error?.message || err.message });
  }
});

// Cross-sell Recommendation AI
router.post('/crosssell-analysis', auth, async (req, res) => {
  try {
    const { customer } = req.body;
    const prompt = `Generate cross-sell recommendations for this wholesale customer:
    Customer: ${customer.customerName}
    Current Products: ${customer.currentProducts}
    Territory: ${customer.territory}
    Last Purchase: ${customer.lastPurchaseDate}

    Provide: 1) Top 5 product recommendations with confidence scores 2) Bundle suggestions 3) Upsell opportunities 4) Timing recommendations 5) Expected revenue impact`;

    const analysis = await callOpenRouter(prompt, 'You are an expert wholesale cross-selling strategist. Provide specific, actionable product recommendations based on customer purchase history. Format your response with clear sections using markdown headers and bullet points.');
    res.json({ analysis });
  } catch (err) {
    console.error('AI Error:', err.response?.data || err.message);
    res.status(500).json({ message: 'AI analysis failed', error: err.response?.data?.error?.message || err.message });
  }
});

// Route Optimization AI
router.post('/route-analysis', auth, async (req, res) => {
  try {
    const { route } = req.body;
    const prompt = `Optimize this wholesale distribution route:
    Route: ${route.routeName}
    Driver: ${route.driverName}
    Territory: ${route.territory}
    Stops: ${route.stops}
    Current Distance: ${route.totalDistance} miles
    Vehicle: ${route.vehicleType}

    Provide: 1) Route optimization suggestions 2) Stop reordering recommendations 3) Fuel efficiency improvements 4) Time window optimization 5) Alternative route options`;

    const analysis = await callOpenRouter(prompt, 'You are an expert logistics and route optimization specialist for wholesale distribution. Provide specific, actionable route improvements. Format your response with clear sections using markdown headers and bullet points.');
    res.json({ analysis });
  } catch (err) {
    console.error('AI Error:', err.response?.data || err.message);
    res.status(500).json({ message: 'AI analysis failed', error: err.response?.data?.error?.message || err.message });
  }
});

// Inventory Allocation AI
router.post('/inventory-analysis', auth, async (req, res) => {
  try {
    const { inventory } = req.body;
    const prompt = `Analyze and optimize inventory allocation for this wholesale product:
    Product: ${inventory.productName}
    SKU: ${inventory.sku}
    Category: ${inventory.category}
    Region: ${inventory.region}
    Warehouse: ${inventory.warehouse}
    Current Stock: ${inventory.currentStock}
    Min Stock: ${inventory.minStock}
    Max Stock: ${inventory.maxStock}
    Reorder Point: ${inventory.reorderPoint}
    Turnover Rate: ${inventory.turnoverRate}

    Provide: 1) Stock level optimization 2) Reorder strategy 3) Regional allocation recommendations 4) Demand forecasting 5) Cost reduction opportunities`;

    const analysis = await callOpenRouter(prompt, 'You are an expert wholesale inventory management specialist. Provide data-driven inventory allocation recommendations. Format your response with clear sections using markdown headers and bullet points.');
    res.json({ analysis });
  } catch (err) {
    console.error('AI Error:', err.response?.data || err.message);
    res.status(500).json({ message: 'AI analysis failed', error: err.response?.data?.error?.message || err.message });
  }
});

// Customer Analysis AI
router.post('/customer-analysis', auth, async (req, res) => {
  try {
    const { customer } = req.body;
    const prompt = `Analyze this wholesale customer and provide strategic recommendations:
    Company: ${customer.companyName}, Contact: ${customer.contactName}, Segment: ${customer.segment}
    Lifetime Value: $${customer.lifetimeValue}, Total Orders: ${customer.totalOrders}, Avg Order: $${customer.avgOrderValue}
    Territory: ${customer.territory}, Payment Terms: ${customer.paymentTerms}, Credit Limit: $${customer.creditLimit}
    Provide: 1) Customer health score 2) Retention strategies 3) Growth opportunities 4) Risk assessment 5) Account development plan`;
    const analysis = await callOpenRouter(prompt, 'You are an expert wholesale CRM analyst. Provide actionable customer insights. Format with markdown headers and bullet points.');
    res.json({ analysis });
  } catch (err) { res.status(500).json({ message: 'AI analysis failed', error: err.response?.data?.error?.message || err.message }); }
});

// Forecast Analysis AI
router.post('/forecast-analysis', auth, async (req, res) => {
  try {
    const { forecast } = req.body;
    const prompt = `Analyze this sales forecast for wholesale distribution:
    Territory: ${forecast.territory}, Product: ${forecast.product}, Period: ${forecast.period}
    Forecasted: $${forecast.forecastedRevenue}, Actual: $${forecast.actualRevenue}, Variance: ${forecast.variance}%
    Confidence: ${forecast.confidence}%, Growth Rate: ${forecast.growthRate}%, Method: ${forecast.method}
    Provide: 1) Forecast accuracy assessment 2) Trend analysis 3) Risk factors 4) Adjusted forecast recommendation 5) Action items`;
    const analysis = await callOpenRouter(prompt, 'You are an expert sales forecasting analyst for wholesale distribution. Format with markdown headers and bullet points.');
    res.json({ analysis });
  } catch (err) { res.status(500).json({ message: 'AI analysis failed', error: err.response?.data?.error?.message || err.message }); }
});

// Supplier Analysis AI
router.post('/supplier-analysis', auth, async (req, res) => {
  try {
    const { supplier } = req.body;
    const prompt = `Evaluate this wholesale supplier performance:
    Company: ${supplier.companyName}, Category: ${supplier.category}, Lead Time: ${supplier.leadTimeDays} days
    Reliability: ${supplier.reliabilityScore}%, On-Time: ${supplier.onTimeDeliveryRate}%, Quality: ${supplier.qualityRating}/5
    Total Orders: ${supplier.totalOrders}, Payment: ${supplier.paymentTerms}
    Provide: 1) Performance scorecard 2) Risk assessment 3) Negotiation recommendations 4) Alternative supplier suggestions 5) Improvement areas`;
    const analysis = await callOpenRouter(prompt, 'You are an expert supply chain analyst for wholesale distribution. Format with markdown headers and bullet points.');
    res.json({ analysis });
  } catch (err) { res.status(500).json({ message: 'AI analysis failed', error: err.response?.data?.error?.message || err.message }); }
});

// Pricing Analysis AI
router.post('/pricing-analysis', auth, async (req, res) => {
  try {
    const { pricing } = req.body;
    const prompt = `Analyze pricing strategy for this wholesale product:
    Product: ${pricing.productName}, Category: ${pricing.category}
    Base Cost: $${pricing.baseCost}, Current Price: $${pricing.currentPrice}, Margin: ${pricing.margin}%
    Competitor Price: $${pricing.competitorPrice}, Demand: ${pricing.demandLevel}, Elasticity: ${pricing.priceElasticity}
    Strategy: ${pricing.strategy}
    Provide: 1) Optimal price recommendation 2) Competitive positioning 3) Margin optimization 4) Dynamic pricing suggestions 5) Revenue impact forecast`;
    const analysis = await callOpenRouter(prompt, 'You are an expert wholesale pricing strategist. Format with markdown headers and bullet points.');
    res.json({ analysis });
  } catch (err) { res.status(500).json({ message: 'AI analysis failed', error: err.response?.data?.error?.message || err.message }); }
});

// Returns Analysis AI
router.post('/returns-analysis', auth, async (req, res) => {
  try {
    const { returnItem } = req.body;
    const prompt = `Analyze this wholesale return/claim and recommend resolution:
    Return#: ${returnItem.returnNumber}, Order#: ${returnItem.orderNumber}, Customer: ${returnItem.customerName}
    Product: ${returnItem.product}, Quantity: ${returnItem.quantity}, Reason: ${returnItem.reason}
    Type: ${returnItem.type}, Refund: $${returnItem.refundAmount}, Status: ${returnItem.status}
    Provide: 1) Root cause analysis 2) Resolution recommendation 3) Prevention strategies 4) Customer retention approach 5) Process improvement suggestions`;
    const analysis = await callOpenRouter(prompt, 'You are an expert wholesale returns and claims analyst. Format with markdown headers and bullet points.');
    res.json({ analysis });
  } catch (err) { res.status(500).json({ message: 'AI analysis failed', error: err.response?.data?.error?.message || err.message }); }
});

// Sales Rep Analysis AI
router.post('/salesrep-analysis', auth, async (req, res) => {
  try {
    const { rep } = req.body;
    const prompt = `Analyze this wholesale sales representative's performance:
    Name: ${rep.name}, Territory: ${rep.territory}, Region: ${rep.region}
    Quota: $${rep.quota}, Actual: $${rep.actualSales}, Attainment: ${rep.attainment}%
    Total Deals: ${rep.totalDeals}, Avg Deal: $${rep.avgDealSize}, Win Rate: ${rep.winRate}%
    Customers: ${rep.customerCount}, Rank: #${rep.rank}
    Provide: 1) Performance assessment 2) Strengths and areas for improvement 3) Coaching recommendations 4) Territory optimization 5) Goal-setting suggestions`;
    const analysis = await callOpenRouter(prompt, 'You are an expert wholesale sales performance coach. Format with markdown headers and bullet points.');
    res.json({ analysis });
  } catch (err) { res.status(500).json({ message: 'AI analysis failed', error: err.response?.data?.error?.message || err.message }); }
});

// Demand Planning AI
router.post('/demand-analysis', auth, async (req, res) => {
  try {
    const { plan } = req.body;
    const prompt = `Analyze demand planning for this wholesale product:
    Product: ${plan.productName}, Category: ${plan.category}, Region: ${plan.region}
    Current Demand: ${plan.currentDemand}, Forecasted: ${plan.forecastedDemand}, Seasonal Factor: ${plan.seasonalFactor}
    Trend: ${plan.trendDirection}, Confidence: ${plan.confidence}%, Period: ${plan.period}
    Recommended Stock: ${plan.recommendedStock}
    Provide: 1) Demand forecast validation 2) Seasonal adjustment recommendations 3) Stock level optimization 4) Risk mitigation 5) Supply chain coordination tips`;
    const analysis = await callOpenRouter(prompt, 'You are an expert wholesale demand planning analyst. Format with markdown headers and bullet points.');
    res.json({ analysis });
  } catch (err) { res.status(500).json({ message: 'AI analysis failed', error: err.response?.data?.error?.message || err.message }); }
});

// Delivery Analysis AI
router.post('/delivery-analysis', auth, async (req, res) => {
  try {
    const { delivery } = req.body;
    const prompt = `Analyze this wholesale delivery and optimize logistics:
    Tracking: ${delivery.trackingNumber}, Customer: ${delivery.customerName}
    Origin: ${delivery.origin}, Destination: ${delivery.destination}, Carrier: ${delivery.carrier}
    Weight: ${delivery.weight}lbs, Cost: $${delivery.cost}, Status: ${delivery.status}, Priority: ${delivery.priority}
    Provide: 1) Delivery optimization suggestions 2) Cost reduction opportunities 3) Carrier performance assessment 4) Timeline improvements 5) Customer communication recommendations`;
    const analysis = await callOpenRouter(prompt, 'You are an expert wholesale delivery logistics analyst. Format with markdown headers and bullet points.');
    res.json({ analysis });
  } catch (err) { res.status(500).json({ message: 'AI analysis failed', error: err.response?.data?.error?.message || err.message }); }
});

// Warehouse Analysis AI
router.post('/warehouse-analysis', auth, async (req, res) => {
  try {
    const { warehouse } = req.body;
    const prompt = `Analyze this warehouse operations for wholesale distribution:
    Name: ${warehouse.name}, Region: ${warehouse.region}, Capacity: ${warehouse.capacity} pallets
    Utilization: ${warehouse.currentUtilization}%, Dock Count: ${warehouse.dockCount}
    Monthly Cost: $${warehouse.monthlyOperatingCost}, Temp Controlled: ${warehouse.temperatureControlled}
    Provide: 1) Capacity optimization 2) Operational efficiency improvements 3) Cost reduction strategies 4) Layout recommendations 5) Technology upgrade suggestions`;
    const analysis = await callOpenRouter(prompt, 'You are an expert warehouse operations analyst. Format with markdown headers and bullet points.');
    res.json({ analysis });
  } catch (err) { res.status(500).json({ message: 'AI analysis failed', error: err.response?.data?.error?.message || err.message }); }
});

// Promotion Analysis AI
router.post('/promotion-analysis', auth, async (req, res) => {
  try {
    const { promotion } = req.body;
    const prompt = `Analyze this wholesale promotion campaign:
    Name: ${promotion.name}, Type: ${promotion.type}, Product: ${promotion.product}
    Discount: ${promotion.discountPercent}%, Target: ${promotion.targetSegment}, Territory: ${promotion.territory}
    Estimated Impact: $${promotion.estimatedImpact}, Actual Impact: $${promotion.actualImpact}, Redemptions: ${promotion.redemptions}
    Provide: 1) Campaign effectiveness analysis 2) ROI assessment 3) Optimization recommendations 4) Target audience refinement 5) Follow-up campaign suggestions`;
    const analysis = await callOpenRouter(prompt, 'You are an expert wholesale promotions strategist. Format with markdown headers and bullet points.');
    res.json({ analysis });
  } catch (err) { res.status(500).json({ message: 'AI analysis failed', error: err.response?.data?.error?.message || err.message }); }
});

// Customer Churn Prediction
// POST /api/ai/customer-churn-prediction
// Body: { customer: { name, accountAge, lastOrderDate, ordersLast90Days, lifetimeValue, supportTickets, ... } }
router.post('/customer-churn-prediction', auth, requireAIKey, async (req, res) => {
  try {
    const { customer = {} } = req.body || {};
    const prompt = `Predict churn risk for this wholesale customer and recommend retention actions.
Customer: ${customer.name || 'unspecified'}
Account age (months): ${customer.accountAge ?? 'unknown'}
Last order date: ${customer.lastOrderDate || 'unknown'}
Orders in last 90 days: ${customer.ordersLast90Days ?? 'unknown'}
Lifetime value: $${customer.lifetimeValue ?? 'unknown'}
Open support tickets: ${customer.supportTickets ?? 'unknown'}
Recent payment behavior: ${customer.paymentBehavior || 'unknown'}
Territory: ${customer.territory || 'unknown'}
Sales rep: ${customer.salesRep || 'unknown'}

Provide: 1) Churn risk score (low/medium/high/critical) and 0-100 probability estimate 2) Top 3 churn signals 3) Retention plays ranked by expected impact 4) Win-back offer suggestions 5) Suggested follow-up timeline.`;
    const analysis = await callOpenRouter(prompt, 'You are an expert wholesale customer success analyst predicting churn risk. Provide actionable, data-driven recommendations. Format your response with clear sections using markdown headers and bullet points.');
    res.json({ analysis });
  } catch (err) {
    console.error('AI Error:', err.response?.data || err.message);
    res.status(500).json({ message: 'AI analysis failed', error: err.response?.data?.error?.message || err.message });
  }
});

// Contract Renewal Recommendation
// POST /api/ai/contract-renewal-recommendation
// Body: { contract: { customerName, currentTerms, expirationDate, annualSpend, marginTrend, paymentBehavior, competitorActivity, ... } }
router.post('/contract-renewal-recommendation', auth, requireAIKey, async (req, res) => {
  try {
    const { contract = {} } = req.body || {};
    const prompt = `Recommend contract renewal strategy for this wholesale customer agreement.
Customer: ${contract.customerName || 'unspecified'}
Current terms summary: ${contract.currentTerms || 'unknown'}
Expiration date: ${contract.expirationDate || 'unknown'}
Annual spend: $${contract.annualSpend ?? 'unknown'}
Margin trend (last 12 months): ${contract.marginTrend || 'unknown'}
Payment behavior: ${contract.paymentBehavior || 'unknown'}
Competitor activity: ${contract.competitorActivity || 'unknown'}
Customer satisfaction signal: ${contract.satisfactionSignal || 'unknown'}

Provide: 1) Renewal recommendation (renew_as_is | negotiate | restructure | non_renew) with rationale 2) Suggested updated pricing tiers / volume rebates 3) Margin floor recommendation 4) Key clauses to add or revise 5) Negotiation talking points 6) Risk if not renewed.`;
    const analysis = await callOpenRouter(prompt, 'You are an expert wholesale contracts strategist. Provide actionable renewal recommendations balancing margin and retention. Format your response with clear sections using markdown headers and bullet points.');
    res.json({ analysis });
  } catch (err) {
    console.error('AI Error:', err.response?.data || err.message);
    res.status(500).json({ message: 'AI analysis failed', error: err.response?.data?.error?.message || err.message });
  }
});

// Supplier Diversification Analysis
// POST /api/ai/supplier-diversification
// Body: { supplierMix: [{ supplierName, category, share, leadTime, defectRate, onTimeRate }], constraints?, goals? }
router.post('/supplier-diversification', auth, requireAIKey, async (req, res) => {
  try {
    const { supplierMix = [], constraints = '', goals = '' } = req.body || {};
    const prompt = `Analyze this supplier portfolio and recommend diversification moves to reduce concentration and supply-chain risk.
Supplier mix: ${JSON.stringify(supplierMix).slice(0, 6000)}
Constraints: ${constraints || 'none specified'}
Goals: ${goals || 'reduce single-source risk and improve resilience'}

Provide: 1) Concentration risk per category 2) Top 3 single-points-of-failure 3) Suggested alternate supplier profiles (region, capacity tier, certifications) 4) Recommended target share per supplier 5) Phased migration plan with milestones 6) Estimated impact on lead time, cost, and quality.`;
    const analysis = await callOpenRouter(prompt, 'You are an expert wholesale supply chain strategist focused on supplier diversification and resilience. Format your response with clear sections using markdown headers and bullet points.');
    res.json({ analysis });
  } catch (err) {
    console.error('AI Error:', err.response?.data || err.message);
    res.status(500).json({ message: 'AI analysis failed', error: err.response?.data?.error?.message || err.message });
  }
});

module.exports = router;
