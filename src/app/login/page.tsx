'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
    <div style={{ minHeight: '100vh', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '32rem' }}>
        <div style={{ background: '#1a1a1a', borderRadius: '0.75rem', border: '1px solid #333333', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)', padding: '2.5rem' }}>
          {/* Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
            <img
              src="/logo/8.png"
              alt="VBA Construtora"
              style={{ height: '80px', marginBottom: '1rem', objectFit: 'contain' }}
            />
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
              VBA CONSTRUTORA
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', letterSpacing: '0.1em' }}>
              VINICIUS BARRETO ARQUITETURA
            </p>
            <div style={{ width: '60px', height: '1px', background: 'linear-gradient(90deg, transparent, #c9a961, transparent)', margin: '1rem 0' }}></div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#e5e7eb', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                EMAIL
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #404040',
                  background: '#252525',
                  color: '#ffffff',
                  outline: 'none',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#c9a961'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#404040'}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#e5e7eb', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                SENHA
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #404040',
                  background: '#252525',
                  color: '#ffffff',
                  outline: 'none',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#c9a961'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#404040'}
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div style={{ borderRadius: '0.5rem', border: '1px solid #7f1d1d', background: '#7f1d1d33', padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#fca5a5' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: 'linear-gradient(135deg, #c9a961 0%, #b8956a 100%)',
                color: '#000000',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s',
                letterSpacing: '0.05em'
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {loading ? 'ENTRANDO...' : 'ENTRAR'}
            </button>
          </form>

          <p style={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'center', marginTop: '1.5rem', letterSpacing: '0.05em' }}>
            © 2026 VBA CONSTRUTORA - TODOS OS DIREITOS RESERVADOS
          </p>
        </div>
      </div>
    </div>
  );
}
