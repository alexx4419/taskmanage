fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test',
    email: 'test' + Date.now() + '@test.com',
    password: 'pwd',
    role: 'ADMIN'
  })
}).then(r => r.json()).then(console.log).catch(console.error);
