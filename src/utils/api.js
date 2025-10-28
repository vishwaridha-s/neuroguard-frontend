export const BASE_URL = 'https://neuroguard-z81r.onrender.com';
export async function apiFetch(path, options = {}) {
  const res = await fetch(BASE_URL + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    credentials: 'include'
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
