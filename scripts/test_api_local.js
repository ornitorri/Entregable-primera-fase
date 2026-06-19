#!/usr/bin/env node
// Simple local API tester for your dev server (no extra deps).
// Usage examples:
//  node scripts/test_api_local.js --url http://localhost:9002/api/orders --token <TOKEN>
//  node scripts/test_api_local.js --url http://localhost:9002/api/orders --token <TOKEN> --method POST --data '{"shipping_address":"Calle 1","payment_method":"tarjeta"}'

const { argv } = require('process');

function parseArgs() {
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        out[key] = next;
        i++;
      } else {
        out[key] = true;
      }
    }
  }
  return out;
}

const args = parseArgs();
const url = args.url || 'http://localhost:9002/api/orders';
const token = args.token || process.env.TOKEN || '';
const method = (args.method || 'GET').toUpperCase();
let body;
if (args.data) {
  try {
    body = JSON.parse(args.data);
  } catch (e) {
    console.error('Invalid JSON for --data');
    process.exit(1);
  }
}

(async () => {
  try {
    const headers = {};
    if (token) headers['x-access-token'] = token; // we added x-access-token support for local testing
    if (method === 'POST' || method === 'PUT') headers['Content-Type'] = 'application/json';

    console.log(`Request: ${method} ${url}`);
    if (token) console.log('Using token from --token or $TOKEN');
    if (body) console.log('Body:', body);

    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const status = res.status;
    const text = await res.text();
    let parsed;
    try { parsed = JSON.parse(text); } catch (e) { parsed = text; }

    console.log('\nResponse status:', status);
    console.log('Response body:');
    console.log(parsed);
  } catch (err) {
    console.error('Error making request:', err);
    process.exit(2);
  }
})();
