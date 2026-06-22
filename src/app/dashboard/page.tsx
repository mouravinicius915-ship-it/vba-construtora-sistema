'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useData } from '@/context/DataContext';
import { BarChart3, TrendingUp, AlertCircle, Calendar, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  const { obras, contasPagar, contasReceber, clientes, fornecedores, funcionarios } = useData();
  const [filterObra, setFilterObra] = useState<string>('');

  // Cálculos
  const obrasAtivas = obras.filter(o => o.status === 'em_andamento').length;
  const obrasFinalizadas = obras.filter(o => o.status === 'finalizada').length;

  // Filtrar contas por obra se selecionada
  const contasPagarFiltradas = filterObra ? contasPagar.filter(c => c.obra_id === filterObra) : contasPagar;
  const contasReceberFiltradas = filterObra ? contasReceber.filter(c => c.obra_id === filterObra) : contasReceber;

  const contasPagarPendentes = contasPagarFiltradas.filter(c => c.status === 'pendente');
  const totalPagarPendente = contasPagarPendentes.reduce((sum, c) => sum + c.valor, 0);

  const contasReceberPendentes = contasReceberFiltradas.filter(c => c.status === 'pendente');
  const totalReceberPendente = contasReceberPendentes.reduce((sum, c) => sum + c.valor, 0);

  const contasVencidas = contasPagarFiltradas.filter(c =>
    c.status === 'pendente' && new Date(c.data_vencimento) < new Date()
  );

  const totalVencido = contasVencidas.reduce((sum, c) => sum + c.valor, 0);

  const proximosVencimentos = contasPagarFiltradas.filter(c => {
    const vencimento = new Date(c.data_vencimento);
    const hoje = new Date();
    const em7Dias = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);
    return c.status === 'pendente' && vencimento > hoje && vencimento <= em7Dias;
  });

  const totalProximosVencimentos = proximosVencimentos.reduce((sum, c) => sum + c.valor, 0);

  const obraComMaiorOrcamento = obras.reduce((maior, obra) =>
    obra.orcamento_previsto > maior.orcamento_previsto ? obra : maior
  , obras[0]);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Título */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
            <p className="text-slate-600 mt-1">Visão geral do seu negócio e operações</p>
          </div>
          <select
            value={filterObra}
            onChange={(e) => setFilterObra(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas as Obras</option>
            {obras.map(o => (
              <option key={o.id} value={o.id}>{o.nome}</option>
            ))}
          </select>
        </div>

        {/* Cards de métricas principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Obras Ativas */}
          <Card className="bg-blue-50 border-blue-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Obras Ativas</p>
                <h3 className="text-3xl font-bold text-blue-900 mt-2">{obrasAtivas}</h3>
                <p className="text-xs text-blue-600 mt-1">{obrasFinalizadas} finalizadas</p>
              </div>
              <div className="p-3 bg-blue-200 rounded-lg">
                <TrendingUp size={20} className="text-blue-600" />
              </div>
            </div>
          </Card>

          {/* Contas a Pagar */}
          <Card className="bg-yellow-50 border-yellow-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Contas a Pagar (Pendentes)</p>
                <h3 className="text-3xl font-bold text-yellow-900 mt-2">
                  {contasPagarPendentes.length}
                </h3>
                <p className="text-xs text-yellow-600 mt-1">R$ {totalPagarPendente.toLocaleString('pt-BR')}</p>
              </div>
              <div className="p-3 bg-yellow-200 rounded-lg">
                <AlertCircle size={20} className="text-yellow-600" />
              </div>
            </div>
          </Card>

          {/* Contas a Receber */}
          <Card className="bg-green-50 border-green-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Contas a Receber (Pendentes)</p>
                <h3 className="text-3xl font-bold text-green-900 mt-2">
                  {contasReceberPendentes.length}
                </h3>
                <p className="text-xs text-green-600 mt-1">R$ {totalReceberPendente.toLocaleString('pt-BR')}</p>
              </div>
              <div className="p-3 bg-green-200 rounded-lg">
                <DollarSign size={20} className="text-green-600" />
              </div>
            </div>
          </Card>

          {/* Saldo */}
          <Card className="bg-purple-50 border-purple-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Saldo Previsto</p>
                <h3 className="text-3xl font-bold text-purple-900 mt-2">
                  R$ {(totalReceberPendente - totalPagarPendente).toLocaleString('pt-BR')}
                </h3>
                <p className="text-xs text-purple-600 mt-1">Receita - Despesa</p>
              </div>
              <div className="p-3 bg-purple-200 rounded-lg">
                <BarChart3 size={20} className="text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Alertas e Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alertas Urgentes */}
          <div className="lg:col-span-2">
            <Card>
              <div className="mb-4 pb-4 border-b border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900">Alertas Urgentes</h3>
              </div>
              <div className="space-y-3">
                {contasVencidas.length > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-red-900">⚠️ Contas Vencidas</p>
                      <p className="text-xs text-red-700 mt-0.5">
                        {contasVencidas.length} conta(s) vencida(s) - Total: R$ {totalVencido.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                )}

                {proximosVencimentos.length > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-yellow-900">📅 Vencimentos Próximos (7 dias)</p>
                      <p className="text-xs text-yellow-700 mt-0.5">
                        {proximosVencimentos.length} conta(s) - Total: R$ {totalProximosVencimentos.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                )}

                {contasVencidas.length === 0 && proximosVencimentos.length === 0 && (
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-green-900">✅ Financeiro em Dia</p>
                      <p className="text-xs text-green-700 mt-0.5">Nenhuma conta vencida ou próxima de vencer</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-900">📊 Resumo Geral</p>
                    <p className="text-xs text-blue-700 mt-0.5">
                      {clientes.length} clientes | {fornecedores.length} fornecedores | {funcionarios.length} funcionários
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Obras em Andamento */}
          <Card>
            <div className="mb-4 pb-4 border-b border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900">Obras em Andamento</h3>
            </div>
            <div className="space-y-3">
              {obras
                .filter(o => o.status === 'em_andamento')
                .slice(0, 3)
                .map((obra) => {
                  const percentual = 50; // Placeholder
                  return (
                    <div key={obra.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700 truncate">{obra.nome}</span>
                        <span className="text-xs text-slate-500">{percentual}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${percentual}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              {obrasAtivas === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">Nenhuma obra em andamento</p>
              )}
            </div>
          </Card>
        </div>

        {/* Tabela de Últimas Transações */}
        <Card>
          <div className="mb-4 pb-4 border-b border-slate-200">
            <h3 className="text-xl font-semibold text-slate-900">Últimas Transações</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Descrição</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Tipo</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Valor</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Data</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {[...contasPagar, ...contasReceber]
                  .sort((a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime())
                  .slice(0, 5)
                  .map((transacao) => {
                    const isPagar = 'fornecedor_id' in transacao;
                    return (
                      <tr key={transacao.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900">{transacao.descricao}</td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-medium ${isPagar ? 'text-red-600' : 'text-green-600'}`}>
                            {isPagar ? 'Saída' : 'Entrada'}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900">
                          R$ {transacao.valor.toLocaleString('pt-BR')}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {new Date(transacao.data_vencimento).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            label={transacao.status.charAt(0).toUpperCase() + transacao.status.slice(1)}
                            variant={
                              transacao.status === 'pendente' ? 'warning' :
                              transacao.status === 'pago' || transacao.status === 'recebido' ? 'success' :
                              transacao.status === 'vencido' ? 'danger' : 'info'
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
