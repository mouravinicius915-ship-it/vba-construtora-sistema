'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validação simples para demonstração
      if (email === 'admin@vba.com' && password === 'senha123') {
        await new Promise(resolve => setTimeout(resolve, 800));
        router.push('/dashboard');
      } else {
        setError('Email ou senha inválidos');
      }
    } catch (err) {
      setError('Erro ao fazer login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '28rem' }}>
        <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '4rem', height: '4rem', background: '#2563eb', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem', color: 'white' }}>🏗️</span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>VBA Construtora</h1>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>Sistema de Gestão</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.25rem' }}>
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', background: 'white', color: '#111827', outline: 'none' }}
                required
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.25rem' }}>
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', background: 'white', color: '#111827', outline: 'none' }}
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div style={{ borderRadius: '0.5rem', border: '1px solid #fca5a5', background: '#fef2f2', padding: '1rem', marginBottom: '1rem', fontSize: '0.875rem', color: '#7f1d1d' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '0.5rem 1rem', borderRadius: '0.5rem', background: '#2563eb', color: 'white', fontWeight: '500', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb', textAlign: 'center', fontSize: '0.875rem', color: '#4b5563' }}>
            <p>Credenciais de demonstração:</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
              <strong>Email:</strong> admin@vba.com<br />
              <strong>Senha:</strong> senha123
            </p>
          </div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'white' }}>
          <p>© 2026 VBA Construtora. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}
