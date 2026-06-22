'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useData } from '@/context/DataContext';
import { Obra } from '@/lib/types';
import { Plus, Edit2, Trash2, X, Eye } from 'lucide-react';

export default function ObrasPage() {
  const router = useRouter();
  const { obras, clientes, addObra, updateObra, deleteObra } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    cliente_id: '',
    responsavel_id: 'admin',
    status: 'planejamento' as 'planejamento' | 'em_andamento' | 'pausada' | 'finalizada',
    data_inicio: '',
    data_prevista_fim: '',
    orcamento_previsto: 0,
    observacoes: '',
  });

  const filteredObras = obras.filter(o =>
    o.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateObra(editingId, formData);
      setEditingId(null);
    } else {
      addObra(formData as any);
    }
    setFormData({
      nome: '',
      endereco: '',
      cliente_id: '',
      responsavel_id: 'admin',
      status: 'planejamento',
      data_inicio: '',
      data_prevista_fim: '',
      orcamento_previsto: 0,
      observacoes: '',
    });
    setShowModal(false);
  };

  const handleEdit = (obra: Obra) => {
    setFormData({
      nome: obra.nome,
      endereco: obra.endereco,
      cliente_id: obra.cliente_id,
      responsavel_id: obra.responsavel_id,
      status: obra.status,
      data_inicio: obra.data_inicio,
      data_prevista_fim: obra.data_prevista_fim,
      orcamento_previsto: obra.orcamento_previsto,
      observacoes: obra.observacoes || '',
    });
    setEditingId(obra.id);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta obra?')) {
      deleteObra(id);
    }
  };

  const getClienteName = (id: string) => {
    return clientes.find(c => c.id === id)?.nome || 'N/A';
  };

  const statusColors = {
    planejamento: 'info',
    em_andamento: 'warning',
    pausada: 'danger',
    finalizada: 'success',
  } as const;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Obras</h2>
            <p className="text-slate-600 mt-1">Gerenciador de projetos e obras</p>
          </div>
          <Button variant="primary" onClick={() => { setEditingId(null); setShowModal(true); }}>
            <Plus size={20} />
            Nova Obra
          </Button>
        </div>

        {/* Barra de busca */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Buscar obra..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tabela */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Nome</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Cliente</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Início</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Término</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Orçamento</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredObras.map((obra) => (
                  <tr key={obra.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{obra.nome}</td>
                    <td className="px-4 py-3 text-slate-600">{getClienteName(obra.cliente_id)}</td>
                    <td className="px-4 py-3">
                      <Badge
                        label={obra.status.charAt(0).toUpperCase() + obra.status.slice(1)}
                        variant={statusColors[obra.status]}
                      />
                    </td>
                    <td className="px-4 py-3 text-slate-600">{new Date(obra.data_inicio).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3 text-slate-600">{new Date(obra.data_prevista_fim).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      R$ {obra.orcamento_previsto.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => router.push(`/obras/${obra.id}`)}
                        title="Ver detalhes e financeiro"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(obra)}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(obra.id)}
                      >
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">
                {editingId ? 'Editar Obra' : 'Nova Obra'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Nome da Obra *</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Cliente */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Cliente (Opcional)</label>
                <select
                  value={formData.cliente_id}
                  onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sem cliente</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>

              {/* Endereço */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Endereço *</label>
                <input
                  type="text"
                  required
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="planejamento">Planejamento</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="pausada">Pausada</option>
                  <option value="finalizada">Finalizada</option>
                </select>
              </div>

              {/* Datas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Data de Início *</label>
                  <input
                    type="date"
                    required
                    value={formData.data_inicio}
                    onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Data Prevista de Término *</label>
                  <input
                    type="date"
                    required
                    value={formData.data_prevista_fim}
                    onChange={(e) => setFormData({ ...formData, data_prevista_fim: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Orçamento */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Orçamento Previsto (R$) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.orcamento_previsto}
                  onChange={(e) => setFormData({ ...formData, orcamento_previsto: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Observações */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Observações</label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              {/* Botões */}
              <div className="flex gap-2 justify-end pt-4 border-t border-slate-200">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" type="submit">
                  {editingId ? 'Atualizar' : 'Criar'} Obra
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </MainLayout>
  );
}
