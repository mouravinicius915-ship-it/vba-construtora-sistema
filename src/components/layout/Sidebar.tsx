'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  Truck,
  DollarSign,
  Users2,
  FileText,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { useState } from 'react';

const MENU_ITEMS = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    label: 'Obras',
    href: '/obras',
    icon: 'Building2',
  },
  {
    label: 'Clientes',
    href: '/clientes',
    icon: 'Users',
  },
  {
    label: 'Fornecedores',
    href: '/fornecedores',
    icon: 'Truck',
  },
  {
    label: 'Financeiro',
    href: '/financeiro',
    icon: 'DollarSign',
    submenu: [
      { label: 'Contas a Pagar', href: '/financeiro/pagar' },
      { label: 'Contas a Receber', href: '/financeiro/receber' },
    ],
  },
  {
    label: 'Funcionários',
    href: '/funcionarios',
    icon: 'Users2',
  },
  {
    label: 'Documentos',
    href: '/documentos',
    icon: 'FileText',
  },
];

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={20} />,
  Building2: <Building2 size={20} />,
  Users: <Users size={20} />,
  Truck: <Truck size={20} />,
  DollarSign: <DollarSign size={20} />,
  Users2: <Users2 size={20} />,
  FileText: <FileText size={20} />,
};

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      router.push('/login');
    }
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 border-r border-slate-200 bg-white p-4 overflow-y-auto">
      <nav className="space-y-2">
        {MENU_ITEMS.map((item) => (
          <div key={item.href}>
            <div
              className={`flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Link
                href={item.href}
                className="flex items-center gap-3 flex-1"
              >
                {ICON_MAP[item.icon]}
                <span className="text-sm">{item.label}</span>
              </Link>
              {item.submenu && (
                <button
                  onClick={() =>
                    setExpandedMenu(
                      expandedMenu === item.href ? null : item.href
                    )
                  }
                  className="p-1"
                >
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      expandedMenu === item.href ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              )}
            </div>

            {item.submenu && expandedMenu === item.href && (
              <div className="ml-4 mt-2 space-y-1 border-l border-slate-200 pl-4">
                {item.submenu.map((subitem) => (
                  <Link
                    key={subitem.href}
                    href={subitem.href}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive(subitem.href)
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {subitem.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Logout button */}
      <div className="absolute bottom-4 left-4 right-4 pt-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors text-sm"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
