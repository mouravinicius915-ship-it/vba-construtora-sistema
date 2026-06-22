'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useData } from '@/context/DataContext';
import { ContaReceber } from '@/lib/types';
import { Plus, Edit2, Trash2, X, TrendingUp } from 'lucide-react';

export default function ContasReceberPage() {
  const { contasReceber, clientes, obras, addContaReceber, updateContaReceber, deleteContaReceber } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [formData, setFormData] = useState({
    descricao: '',
    cliente_id: '',
    obra_id: '',
    valor: 0,
    data_vencimento: '',
    data_recebimento: '',
    status: 'pendente' as 'pendente' | 'recebido' | 'vencido' | 'cancelado',
    forma_recebimento: 'transferencia',
    numero_boleto: '',
    observacoes: '',
  });

  const filteredContas = contasReceber.filter(c =>
    !filterStatus || c.status === filterStatus
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateContaReceber(editingId, formData);
        setEditingId(null);
      } else {
        await addContaReceber(formData as any);
      }
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao salvar conta a receber:', error);
      alert('Erro ao salvar conta a receber');
    }
  };

  const resetForm = () => {
    setFormData({
      descricao: '',
      cliente_id: '',
      obra_id: '',
      valor: 0,
      data_vencimento: '',
      data_recebimento: '',
      status: 'pendente',
      forma_recebimento: 'transferencia',
      numero_boleto: '',
      observacoes: '',
    });
  };

  const handleEdit = (conta: ContaReceber) => {
    setFormData({
      descricao: conta.descricao,
      cliente_id: conta.cliente_id,
      obra_id: conta.obra_id,
      valor: conta.valor,
      data_vencimento: conta.data_vencimento,
      data_recebimento: conta.data_recebimento || '',
      status: conta.status,
      forma_recebimento: conta.forma_recebimento || 'transferencia',
      numero_boleto: conta.numero_boleto || '',
      observacoes: conta.observacoes || '',
    });
    setEditingId(conta.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta conta?')) {
      try {
        await deleteContaReceber(id);
      } catch (error) {
        console.error('Erro ao deletar conta a receber:', error);
        alert('Erro ao deletar conta a receber');
      }
    }
  };

  const totalPendente = filteredContas
    .filter(c => c.status === 'pendente')
    .reduce((sum, c) => sum + c.valor, 0);

  const totalRecebido = filteredContas
    .filter(c => c.status === 'recebido')
    .reduce((sum, c) => sum + c.valor, 0);

  const getClienteName = (id: string) => clientes.find(c => c.id === id)?.nome || 'N/A';
  const getObraName = (id: string) => obras.find(o => o.id === id)?.nome || 'N/A';

  const statusColors = {
    pendente: 'warning',
    recebido: 'success',
    vencido: 'danger',
    cancelado: 'info',
  } as const;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Contas a Receber</h2>
            <p className="text-slate-600 mt-1">Gerenciador de receitas e recebimentos</p>
          </div>
          <Button variant="primary" onClick={() => { setEditingId(null); resetForm(); setShowModal(true); }}>
            <Plus size={20} />
            Nova Conta
          </Button>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total de Contas</p>
              <h3 className="text-2xl font-bold text-blue-900 mt-2">
                {filteredContas.length}
              </h3>
              <p className="text-xs text-blue-600 mt-1">R$ {filteredContas.reduce((sum, c) => sum + c.valor, 0).toLocaleString('pt-BR')}</p>
            </div>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pendentes</p>
              <h3 className="text-2xl font-bold text-yellow-900 mt-2">
                {filteredContas.filter(c => c.status === 'pendente').length}
              </h3>
              <p className="text-xs text-yellow-600 mt-1">R$ {totalPendente.toLocaleString('pt-BR')}</p>
            </div>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Recebidas</p>
                <h3 className="text-2xl font-bold text-green-900 mt-2">
                  {filteredContas.filter(c => c.status === 'recebido').length}
                </h3>
                <p className="text-xs text-green-600 mt-1">R$ {totalRecebido.toLocaleString('pt-BR')}</p>
              </div>
              <TrendingUp size={32} className="text-green-600 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os Status</option>
            <option value="pendente">Pendente</option>
            <option value="recebido">Recebido</option>
            <option value="vencido">Vencido</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        {/* Tabela */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Descrição</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Cliente</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Obra</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Valor</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Vencimento</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredContas.map((conta) => (
                  <tr key={conta.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{conta.descricao}</td>
                    <td className="px-4 py-3 text-slate-600">{getClienteName(conta.cliente_id)}</td>
                    <td className="px-4 py-3 text-slate-600">{getObraName(conta.obra_id)}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      R$ {conta.valor.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(conta.data_vencimento).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3">
                      <Badge label={conta.status.charAt(0).toUpperCase() + conta.status.slice(1)} variant={statusColors[conta.status]} />
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(conta)}>
                        <Edit2 size={16} />
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(conta.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">
                {editingId ? 'Editar Conta a Receber' : 'Nova Conta a Receber'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Descrição *</label>
                <input
                  type="text"
                  required
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Cliente *</label>
                  <select
                    required
                    value={formData.cliente_id}
                    onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione</option>
                    {clientes.map(c => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Obra *</label>
                  <select
                    required
                    value={formData.obra_id}
                    onChange={(e) => setFormData({ ...formData, obra_id: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione</option>
                    {obras.map(o => (
                      <option key={o.id} value={o.id}>{o.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Valor (R$) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="recebido">Recebido</option>
                    <option value="vencido">Vencido</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Data de Vencimento *</label>
                  <input
                    type="date"
                    required
                    value={formData.data_vencimento}
                    onChange={(e) => setFormData({ ...formData, data_vencimento: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Data de Recebimento</label>
                  <input
                    type="date"
                    value={formData.data_recebimento}
                    onChange={(e) => setFormData({ ...formData, data_recebimento: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Forma de Recebimento</label>
                  <select
                    value={formData.forma_recebimento}
                    onChange={(e) => setFormData({ ...formData, forma_recebimento: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="dinheiro">Dinheiro</option>
                    <option value="cheque">Cheque</option>
                    <option value="transferencia">Transferência</option>
                    <option value="pix">PIX</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Número do Boleto</label>
                  <input
                    type="text"
                    value={formData.numero_boleto}
                    onChange={(e) => setFormData({ ...formData, numero_boleto: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Observações</label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-200">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button variant="primary" type="submit">{editingId ? 'Atualizar' : 'Criar'} Conta</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </MainLayout>
  );
}
