'use client';

import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [cookieData, setCookieData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkCookies = async () => {
      try {
        console.log('[DEBUG-PAGE] Verificando cookies...');
        const response = await fetch('/api/auth/debug-cookies', {
          credentials: 'include'
        });
        const data = await response.json();
        console.log('[DEBUG-PAGE] Respuesta:', data);
        setCookieData(data);
      } catch (err) {
        console.error('[DEBUG-PAGE] Error:', err);
        setError((err as any).message);
      } finally {
        setLoading(false);
      }
    };

    checkCookies();
  }, []);

  if (loading) return <div className="p-4">Cargando...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 font-mono text-sm">
      <h1 className="text-2xl mb-4">🔍 Debug de Cookies</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">Estado de Cookies:</h2>
        <p>✅ auth_token presente: <span className="font-bold">{cookieData.auth_token_present ? 'SÍ' : 'NO'}</span></p>
        <p>✅ readzzi_token presente: <span className="font-bold">{cookieData.readzzi_token_present ? 'SÍ' : 'NO'}</span></p>
        <p>✅ auth_token válido: <span className="font-bold">{cookieData.auth_token_valid ? 'SÍ' : 'NO'}</span></p>
      </div>

      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">Datos del Token:</h2>
        <pre className="overflow-auto">{JSON.stringify(cookieData.token_data, null, 2)}</pre>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">Todas las Cookies:</h2>
        <pre className="overflow-auto">{JSON.stringify(cookieData.all_cookies, null, 2)}</pre>
      </div>

      <div className="mt-4">
        <button
          onClick={() => window.location.href = '/'}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Volver a Inicio
        </button>
      </div>
    </div>
  );
}
