'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useData } from '@/context/DataContext';
import { Funcionario } from '@/lib/types';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function FuncionariosPage() {
  const { funcionarios, obras, addFuncionario, updateFuncionario, deleteFuncionario } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    funcao: '',
    tipo_pagamento: 'salario' as 'salario' | 'diaria' | 'empreitada',
    valor_mensal_ou_diaria: 0,
    data_admissao: '',
    status: 'ativo' as 'ativo' | 'afastado' | 'desligado',
    obra_vinculada_id: '',
    observacoes: '',
  });

  const filteredFuncionarios = funcionarios.filter(f =>
    f.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateFuncionario(editingId, formData);
      setEditingId(null);
    } else {
      addFuncionario(formData as any);
    }
    resetForm();
    setShowModal(false);
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      cpf: '',
      telefone: '',
      funcao: '',
      tipo_pagamento: 'salario',
      valor_mensal_ou_diaria: 0,
      data_admissao: '',
      status: 'ativo',
      obra_vinculada_id: '',
      observacoes: '',
    });
  };

  const handleEdit = (func: Funcionario) => {
    setFormData({
      nome: func.nome,
      cpf: func.cpf,
      telefone: func.telefone || '',
      funcao: func.funcao,
      tipo_pagamento: func.tipo_pagamento,
      valor_mensal_ou_diaria: func.valor_mensal_ou_diaria,
      data_admissao: func.data_admissao,
      status: func.status,
      obra_vinculada_id: func.obra_vinculada_id || '',
      observacoes: func.observacoes || '',
    });
    setEditingId(func.id);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar este funcionário?')) {
      deleteFuncionario(id);
    }
  };

  const getObraName = (id?: string) => obras.find(o => o.id === id)?.nome || 'N/A';

  const statusColors = {
    ativo: 'success',
    afastado: 'warning',
    desligado: 'danger',
  } as const;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Funcionários</h2>
            <p className="text-slate-600 mt-1">Gerenciador de equipe e folha de pagamento</p>
          </div>
          <Button variant="primary" onClick={() => { setEditingId(null); resetForm(); setShowModal(true); }}>
            <Plus size={20} />
            Novo Funcionário
          </Button>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total</p>
              <h3 className="text-3xl font-bold text-blue-900 mt-2">{funcionarios.length}</h3>
            </div>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <div>
              <p className="text-sm text-green-600 font-medium">Ativos</p>
              <h3 className="text-3xl font-bold text-green-900 mt-2">
                {funcionarios.filter(f => f.status === 'ativo').length}
              </h3>
            </div>
          </Card>
          <Card className="bg-yellow-50 border-yellow-200">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Folha Mensal</p>
              <h3 className="text-xl font-bold text-yellow-900 mt-2">
                R$ {funcionarios
                  .filter(f => f.tipo_pagamento === 'salario')
                  .reduce((sum, f) => sum + f.valor_mensal_ou_diaria, 0)
                  .toLocaleString('pt-BR')}
              </h3>
            </div>
          </Card>
        </div>

        <input
          type="text"
          placeholder="Buscar funcionário..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Nome</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Função</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Tipo</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Valor</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Obra</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredFuncionarios.map((func) => (
                  <tr key={func.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{func.nome}</td>
                    <td className="px-4 py-3 text-slate-600">{func.funcao}</td>
                    <td className="px-4 py-3 text-slate-600 capitalize">{func.tipo_pagamento}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      R$ {func.valor_mensal_ou_diaria.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{getObraName(func.obra_vinculada_id)}</td>
                    <td className="px-4 py-3">
                      <Badge label={func.status.charAt(0).toUpperCase() + func.status.slice(1)} variant={statusColors[func.status]} />
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(func)}>
                        <Edit2 size={16} />
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(func.id)}>
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
                {editingId ? 'Editar Funcionário' : 'Novo Funcionário'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Nome *</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">CPF *</label>
                  <input
                    type="text"
                    required
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Telefone</label>
                  <input
                    type="text"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Função *</label>
                  <input
                    type="text"
                    required
                    value={formData.funcao}
                    onChange={(e) => setFormData({ ...formData, funcao: e.target.value })}
                    placeholder="Ex: Pedreiro, Encanador"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Tipo de Pagamento *</label>
                  <select
                    value={formData.tipo_pagamento}
                    onChange={(e) => setFormData({ ...formData, tipo_pagamento: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="salario">Salário</option>
                    <option value="diaria">Diária</option>
                    <option value="empreitada">Empreitada</option>
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
                    value={formData.valor_mensal_ou_diaria}
                    onChange={(e) => setFormData({ ...formData, valor_mensal_ou_diaria: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Data de Admissão *</label>
                  <input
                    type="date"
                    required
                    value={formData.data_admissao}
                    onChange={(e) => setFormData({ ...formData, data_admissao: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="afastado">Afastado</option>
                    <option value="desligado">Desligado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Obra</label>
                  <select
                    value={formData.obra_vinculada_id}
                    onChange={(e) => setFormData({ ...formData, obra_vinculada_id: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione</option>
                    {obras.map(o => (
                      <option key={o.id} value={o.id}>{o.nome}</option>
                    ))}
                  </select>
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
                <Button variant="primary" type="submit">{editingId ? 'Atualizar' : 'Criar'} Funcionário</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </MainLayout>
  );
}
