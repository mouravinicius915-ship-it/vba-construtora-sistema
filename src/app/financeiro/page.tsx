'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useData } from '@/context/DataContext';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

export default function FinanceiroPage() {
  const { contasPagar, contasReceber } = useData();

  const totalPagar = contasPagar.reduce((sum, c) => sum + c.valor, 0);
  const totalReceber = contasReceber.reduce((sum, c) => sum + c.valor, 0);
  const pagarPendente = contasPagar.filter(c => c.status === 'pendente').reduce((sum, c) => sum + c.valor, 0);
  const receberPendente = contasReceber.filter(c => c.status === 'pendente').reduce((sum, c) => sum + c.valor, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Financeiro</h2>
          <p className="text-slate-600 mt-1">Gerenciamento completo de receitas e despesas</p>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contas a Pagar */}
          <Card className="border-red-200 bg-red-50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Contas a Pagar</p>
                <h3 className="text-3xl font-bold text-red-900 mt-2">
                  {contasPagar.length}
                </h3>
                <p className="text-sm text-red-700 mt-2">Total: R$ {totalPagar.toLocaleString('pt-BR')}</p>
                <p className="text-xs text-red-600 mt-1">Pendente: R$ {pagarPendente.toLocaleString('pt-BR')}</p>
              </div>
              <div className="p-3 bg-red-200 rounded-lg">
                <TrendingDown size={24} className="text-red-600" />
              </div>
            </div>
          </Card>

          {/* Contas a Receber */}
          <Card className="border-green-200 bg-green-50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Contas a Receber</p>
                <h3 className="text-3xl font-bold text-green-900 mt-2">
                  {contasReceber.length}
                </h3>
                <p className="text-sm text-green-700 mt-2">Total: R$ {totalReceber.toLocaleString('pt-BR')}</p>
                <p className="text-xs text-green-600 mt-1">Pendente: R$ {receberPendente.toLocaleString('pt-BR')}</p>
              </div>
              <div className="p-3 bg-green-200 rounded-lg">
                <TrendingUp size={24} className="text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Saldo */}
        <Card className="border-blue-200 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Saldo Previsto</p>
              <h3 className="text-4xl font-bold text-blue-900 mt-2">
                R$ {(totalReceber - totalPagar).toLocaleString('pt-BR')}
              </h3>
              <p className="text-xs text-blue-600 mt-1">Receita menos Despesa</p>
            </div>
            <div className="p-4 bg-blue-200 rounded-lg">
              <DollarSign size={32} className="text-blue-600" />
            </div>
          </div>
        </Card>

        {/* Botões de acesso */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/financeiro/pagar">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900">Contas a Pagar</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    {contasPagar.filter(c => c.status === 'pendente').length} pendentes
                  </p>
                </div>
                <Button variant="primary" size="sm">→</Button>
              </div>
            </Card>
          </Link>

          <Link href="/financeiro/receber">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900">Contas a Receber</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    {contasReceber.filter(c => c.status === 'pendente').length} pendentes
                  </p>
                </div>
                <Button variant="primary" size="sm">→</Button>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
