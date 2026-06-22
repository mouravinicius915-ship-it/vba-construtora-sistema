'use client';

import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useData } from '@/context/DataContext';
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Calendar, MapPin } from 'lucide-react';

export default function ObraDetalhesPage() {
  const router = useRouter();
  const params = useParams();
  const obraId = params.id as string;
  const { obras, clientes, contasPagar, contasReceber } = useData();

  const obra = obras.find(o => o.id === obraId);
  const cliente = obra ? clientes.find(c => c.id === obra.cliente_id) : null;

  // Filtrar contas específicas da obra
  const contasPagarObra = contasPagar.filter(c => c.obra_id === obraId);
  const contasReceberObra = contasReceber.filter(c => c.obra_id === obraId);

  if (!obra) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-slate-600">Obra não encontrada</p>
          <Button variant="primary" onClick={() => router.push('/obras')} className="mt-4">
            Voltar para Obras
          </Button>
        </div>
      </MainLayout>
    );
  }

  const statusColors = {
    planejamento: 'warning',
    em_andamento: 'info',
    pausada: 'danger',
    finalizada: 'success',
  } as const;

  const totalPagarObra = contasPagarObra.reduce((sum, c) => sum + c.valor, 0);
  const totalReceberObra = contasReceberObra.reduce((sum, c) => sum + c.valor, 0);
  const pagarPendenteObra = contasPagarObra.filter(c => c.status === 'pendente').reduce((sum, c) => sum + c.valor, 0);
  const receberPendenteObra = contasReceberObra.filter(c => c.status === 'pendente').reduce((sum, c) => sum + c.valor, 0);
  const saldoObra = totalReceberObra - totalPagarObra;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header com botão de voltar */}
        <button
          onClick={() => router.push('/obras')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft size={20} />
          Voltar para Obras
        </button>

        {/* Informações da Obra */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">{obra.nome}</h1>
              <div className="flex items-center gap-4 mt-3">
                <Badge label={obra.status} variant={statusColors[obra.status as keyof typeof statusColors]} />
                <span className="text-slate-600 flex items-center gap-2">
                  <MapPin size={16} />
                  {obra.endereco}
                </span>
              </div>
            </div>
          </div>

          <Card className="bg-slate-50 border-slate-200">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-600 font-medium">Cliente</p>
                <p className="text-slate-900 font-semibold mt-1">{cliente?.nome || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Data Início</p>
                <p className="text-slate-900 font-semibold mt-1">
                  {new Date(obra.data_inicio).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Data Fim Prevista</p>
                <p className="text-slate-900 font-semibold mt-1">
                  {new Date(obra.data_fim_prevista).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-600 font-medium">Orçamento</p>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-3xl font-bold text-blue-900">
                R$ {obra.orcamento.toLocaleString('pt-BR')}
              </h3>
              <span className="text-sm text-blue-600">(Total estimado)</span>
            </div>
          </Card>
        </div>

        {/* Financeiro da Obra */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Financeiro da Obra</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Contas a Pagar */}
            <Card className="border-red-200 bg-red-50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">Contas a Pagar</p>
                  <h3 className="text-3xl font-bold text-red-900 mt-2">
                    {contasPagarObra.length}
                  </h3>
                  <p className="text-sm text-red-700 mt-2">Total: R$ {totalPagarObra.toLocaleString('pt-BR')}</p>
                  <p className="text-xs text-red-600 mt-1">Pendente: R$ {pagarPendenteObra.toLocaleString('pt-BR')}</p>
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
                    {contasReceberObra.length}
                  </h3>
                  <p className="text-sm text-green-700 mt-2">Total: R$ {totalReceberObra.toLocaleString('pt-BR')}</p>
                  <p className="text-xs text-green-600 mt-1">Pendente: R$ {receberPendenteObra.toLocaleString('pt-BR')}</p>
                </div>
                <div className="p-3 bg-green-200 rounded-lg">
                  <TrendingUp size={24} className="text-green-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Saldo da Obra */}
          <Card className={`${saldoObra >= 0 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${saldoObra >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Saldo da Obra
                </p>
                <h3 className={`text-4xl font-bold mt-2 ${saldoObra >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                  R$ {saldoObra.toLocaleString('pt-BR')}
                </h3>
                <p className={`text-xs mt-1 ${saldoObra >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {saldoObra >= 0 ? 'Superávit' : 'Déficit'}
                </p>
              </div>
              <div className={`p-4 rounded-lg ${saldoObra >= 0 ? 'bg-green-200' : 'bg-red-200'}`}>
                <DollarSign size={32} className={saldoObra >= 0 ? 'text-green-600' : 'text-red-600'} />
              </div>
            </div>
          </Card>

          {/* Contas a Pagar da Obra */}
          {contasPagarObra.length > 0 && (
            <Card className="mt-6">
              <div className="mb-4 pb-4 border-b border-slate-200">
                <h4 className="font-semibold text-slate-900">Contas a Pagar</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">Descrição</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">Valor</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">Data Vencimento</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contasPagarObra.map((conta) => (
                      <tr key={conta.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-900">{conta.descricao}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">
                          R$ {conta.valor.toLocaleString('pt-BR')}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {new Date(conta.data_vencimento).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            label={conta.status.charAt(0).toUpperCase() + conta.status.slice(1)}
                            variant={conta.status === 'pendente' ? 'danger' : 'success'}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Contas a Receber da Obra */}
          {contasReceberObra.length > 0 && (
            <Card className="mt-6">
              <div className="mb-4 pb-4 border-b border-slate-200">
                <h4 className="font-semibold text-slate-900">Contas a Receber</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">Descrição</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">Valor</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">Data Vencimento</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contasReceberObra.map((conta) => (
                      <tr key={conta.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-900">{conta.descricao}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">
                          R$ {conta.valor.toLocaleString('pt-BR')}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {new Date(conta.data_vencimento).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            label={conta.status.charAt(0).toUpperCase() + conta.status.slice(1)}
                            variant={conta.status === 'pendente' ? 'danger' : 'success'}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
