import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import NativeWorkflowStudio from './NativeWorkflowStudio';
import NativeAIReport from './components/NativeAIReport';
import config from './nativeWorkflowConfig.json';
import { readFileSync } from 'fs';
import { join } from 'path';

global.IS_REACT_ACT_ENVIRONMENT = true;

let host, root;
beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
  localStorage.clear();
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  jest.restoreAllMocks();
});
const click = async (node) => act(async () => { node.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
const render = async (node) => act(async () => { root.render(node); });

test('all native AI tools have three distinct fill-only presets, including optional fields', async () => {
  const calls = [];
  const request = async (path, options) => { calls.push({ path, method: options?.method }); return []; };
  await render(<NativeWorkflowStudio config={config} request={request} />);
  for (const feature of config.features) {
    const tool = [...host.querySelectorAll('nav[aria-label="AI tools"] button')].find(button => button.textContent === feature.title);
    await click(tool);
    const samples = [];
    for (const preset of host.querySelectorAll('.native-ai-control-buttons button')) {
      await click(preset);
      const fields = [...host.querySelectorAll('form .native-workflow-fields textarea')];
      expect(fields).toHaveLength(feature.fields.length);
      expect(fields.every(field => field.value.trim())).toBe(true);
      samples.push(fields.map(field => field.value));
    }
    expect(new Set(samples.map(sample => JSON.stringify(sample))).size).toBe(3);
  }
  expect(calls.every(call => !call.method || call.method === 'GET')).toBe(true);
});

test('returned and saved structured JSON renders labels, facts, lists and tables without losing falsy values', async () => {
  const result = { analysis: JSON.stringify({ summary: { approved: false, count: 0, note: '' }, actions: [{ name: 'Review stock', quantity: 0 }, { name: 'Contact buyer', quantity: 2 }], risks: ['Late delivery', 'Low stock'] }) };
  await render(<NativeAIReport response={result} title="Returned report" />);
  expect(host.textContent).toContain('Summary');
  expect(host.textContent).toContain('Approved');
  expect(host.textContent).toContain('No');
  expect(host.textContent).toContain('0');
  expect(host.textContent).toContain('Note');
  const note = [...host.querySelectorAll('dt')].find(node => node.textContent === 'Note');
  expect(note.nextElementSibling.textContent).toBe('');
  expect(host.querySelector('table')).not.toBeNull();
  expect(host.querySelectorAll('li').length).toBe(2);
  const request = async path => path === '/api/ai/history' ? [{ id: 7, endpoint: '/api/ai/territory-analysis', result, createdAt: '2026-10-10T00:00:00Z' }] : [];
  await render(<NativeWorkflowStudio config={config} request={request} />);
  const saved = [...host.querySelectorAll('button')].find(button => button.textContent.includes('Territory analysis ·'));
  await click(saved);
  expect(host.textContent).toContain('Saved AI reports');
  expect(host.textContent).toContain('Approved');
  expect(host.textContent).toContain('No');
  expect(host.querySelector('table')).not.toBeNull();
});

test('presets preserve real record and file selections and expose missing prerequisites', async () => {
  const fixture = { title: 'Fixture', features: [{ id: 'review', title: 'Review', description: 'Fixture review', endpoint: '/unused', fields: [
    { key: 'customer_id', label: 'Customer', resource: 'customers', required: true },
    { key: 'source_file', label: 'Source file', type: 'file', required: true },
    { key: 'notes', label: 'Notes', type: 'text', required: false, presets: ['First note', 'Second note', 'Third note'] }
  ] }], resources: [{ key: 'customers', endpoint: '/api/customers', label: 'Customers', fields: [] }] };
  const calls = [];
  const request = async (path, options) => { calls.push({ path, method: options?.method }); return path === '/api/customers' ? [{ id: 42, name: 'Existing customer' }] : []; };
  await render(<NativeWorkflowStudio config={fixture} request={request} />);
  await click(host.querySelector('.native-ai-control-buttons button'));
  expect(host.textContent).toContain('Supply actual Source file');
  const select = host.querySelector('select');
  expect(select.value).toBe('42');
  const file = new File(['fixture'], 'source.txt', { type: 'text/plain' });
  const input = host.querySelector('input[type=file]');
  Object.defineProperty(input, 'files', { configurable: true, value: [file] });
  await act(async () => input.dispatchEvent(new Event('change', { bubbles: true })));
  await click(host.querySelectorAll('.native-ai-control-buttons button')[1]);
  expect(host.querySelector('select').value).toBe('42');
  expect(host.querySelector('input[type=file]').files[0]).toBe(file);
  expect(host.querySelector('textarea').value).toBe('Second note');
  expect(calls.every(call => !call.method || call.method === 'GET')).toBe(true);
});

test('demo credentials button fills the login form without submitting', async () => {
  const calls = [];
  global.fetch = jest.fn(async (url, options) => {
    calls.push({ url, method: options?.method });
    const body = url.includes('demo-credentials') ? { email: 'demo@example.test', password: 'fixture-only' } : {};
    return { ok: true, json: async () => body };
  });
  await render(<App />);
  await click([...host.querySelectorAll('button')].find(button => button.textContent === 'Fill demo credentials'));
  expect(host.querySelector('input[type=email]').value).toBe('demo@example.test');
  expect(host.querySelector('input[type=password]').value).toBe('fixture-only');
  expect(calls.some(call => call.url.includes('/api/auth/login'))).toBe(false);
});

test('a successful login response reaches the authenticated AI workspace', async () => {
  const calls = [];
  global.fetch = jest.fn(async (url, options) => {
    calls.push({ url, method: options?.method });
    const body = url.includes('/api/auth/login') ? { token: 'fixture-token' }
      : url.includes('/api/auth/me') ? { id: 1, name: 'Fixture user' }
        : [];
    return { ok: true, json: async () => body };
  });
  await render(<App />);
  const email = host.querySelector('input[type=email]');
  const password = host.querySelector('input[type=password]');
  await act(async () => {
    email.value = 'fixture@example.test';
    email.dispatchEvent(new Event('input', { bubbles: true }));
    password.value = 'fixture-only';
    password.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await act(async () => host.querySelector('.login-card').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  expect(calls.some(call => call.url.includes('/api/auth/login') && call.method === 'POST')).toBe(true);
  expect(calls.some(call => call.url.includes('/api/auth/me'))).toBe(true);
  expect(host.querySelector('#native-ai-studio')).not.toBeNull();
});

test('stored record tables render 16 project seed rows from paginated API payloads without runtime errors', async () => {
  const seed = readFileSync(join(__dirname, '../../server/seed.js'), 'utf8');
  const names = (model, property) => {
    const block = seed.split(`await ${model}.bulkCreate([`)[1].split(']);')[0];
    return [...block.matchAll(new RegExp(`${property}: '([^']+)'`, 'g'))].map(match => ({ [property]: match[1] }));
  };
  const customers = names('Customer', 'companyName');
  const inventory = names('Inventory', 'productName');
  expect(customers).toHaveLength(16);
  expect(inventory).toHaveLength(16);
  const errors = [];
  const consoleError = jest.spyOn(console, 'error').mockImplementation((...args) => errors.push(args.join(' ')));
  const request = async path => path === '/api/customers' ? { data: customers, pagination: { total: 16 } }
    : path === '/api/inventory' ? { data: { rows: inventory }, pagination: { total: 16 } }
      : [];
  await render(<NativeWorkflowStudio config={config} request={request} />);
  const tables = [...host.querySelectorAll('.native-workflow-table table')];
  expect(tables).toHaveLength(2);
  expect(tables.map(table => table.querySelectorAll('tbody tr').length)).toEqual([16, 16]);
  expect(host.textContent).toContain('Metro Food Distributors');
  expect(host.textContent).toContain('Tropical Fruit Medley');
  expect(host.textContent).toContain('No saved AI reports found.');
  expect(errors).toEqual([]);
  consoleError.mockRestore();
});
