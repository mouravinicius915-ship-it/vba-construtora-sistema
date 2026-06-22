'use client';

import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      router.push('/login');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-50">
      {/* Logo/Title */}
      <div className="flex items-center gap-3">
        <img src="/logo/8.png" alt="VBA Construtora" className="h-12 object-contain" />
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-slate-900">VBA Construtora</h1>
          <p className="text-xs text-slate-500">Vinicius Barreto Arquitetura</p>
        </div>
      </div>

      {/* Right side - Logout */}
      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors text-sm"
      >
        Sair
      </button>
    </header>
  );
}
