const base = 'http://localhost:5000/api/auth';

async function register(fetchFn, name, email, password) {
  try {
    const res = await fetchFn(`${base}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    console.log(`${email} ->`, res.status, data);
  } catch (err) {
    console.error('Register error for', email, err.message || err);
  }
}

(async () => {
  let fetchFn;
  if (typeof fetch !== 'undefined') {
    fetchFn = fetch;
  } else {
    // dynamic import for node-fetch v3 in CommonJS
    fetchFn = (await import('node-fetch')).default;
  }

  await register(fetchFn, 'John', 'user@example.com', 'password123');
  await register(fetchFn, 'Admin', 'admin@example.com', 'admin123');
})();
