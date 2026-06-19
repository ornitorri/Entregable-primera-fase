(async () => {
  try {
    const fetch = global.fetch || (await import('node-fetch')).default;
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJ1c3VhcmlvLnRlc3RAcmVhZHp6aS5jb20iLCJhbGlhcyI6InVzdWFyaW9fdGVzdCIsInJvbGUiOiJ1c2VyIiwic3Vic2NyaXB0aW9uX3BsYW4iOiJmcmVlIiwiaWF0IjoxNzgxODI5MjkwLCJleHAiOjE3ODI0MzQwOTB9.FwLm8NHmBDT5CGenesuibAzl_Ams-Muu6mzwfU5oOGQ';
    const url = 'http://localhost:9002/api/orders';
    const body = { shipping_address: 'Calle 1, Bogotá', payment_method: 'tarjeta', applied_points: 0 };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      },
      body: JSON.stringify(body)
    });

    const text = await res.text();
    try { console.log('status', res.status); console.log(JSON.parse(text)); }
    catch(e) { console.log('status', res.status); console.log(text); }
  } catch (err) {
    console.error('Request failed:', err);
  }
})();
