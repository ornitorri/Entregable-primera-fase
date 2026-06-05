export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem('auth_token') ||
    localStorage.getItem('token') ||
    localStorage.getItem('readzzi_token')
  );
}

export function dispatchCartUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cart-updated'));
  }
}
