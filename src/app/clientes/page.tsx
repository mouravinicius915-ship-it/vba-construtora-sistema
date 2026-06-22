'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useData } from '@/context/DataContext';
import { Cliente } from '@/lib/types';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function ClientesPage() {
  const { clientes, addCliente, updateCliente, deleteCliente } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'pessoa_fisica' as 'pessoa_fisica' | 'pessoa_juridica',
    cpf_cnpj: '',
    telefone: '',
    whatsapp: '',
    email: '',
    endereco: '',
    observacoes: '',
    ativo: true,
  });

  const filteredClientes = clientes.filter(c =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCliente(editingId, formData);
      setEditingId(null);
    } else {
      addCliente(formData as any);
    }
    setFormData({
      nome: '',
      tipo: 'pessoa_fisica',
      cpf_cnpj: '',
      telefone: '',
      whatsapp: '',
      email: '',
      endereco: '',
      observacoes: '',
      ativo: true,
    });
    setShowModal(false);
  };

  const handleEdit = (cliente: Cliente) => {
    setFormData({
      nome: cliente.nome,
      tipo: cliente.tipo,
      cpf_cnpj: cliente.cpf_cnpj,
      telefone: cliente.telefone || '',
      whatsapp: cliente.whatsapp || '',
      email: cliente.email || '',
      endereco: cliente.endereco || '',
      observacoes: cliente.observacoes || '',
      ativo: cliente.ativo,
    });
    setEditingId(cliente.id);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar este cliente?')) {
      deleteCliente(id);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Clientes</h2>
            <p className="text-slate-600 mt-1">Gerenciador de clientes e contratantes</p>
          </div>
          <Button variant="primary" onClick={() => { setEditingId(null); setShowModal(true); }}>
            <Plus size={20} />
            Novo Cliente
          </Button>
        </div>

        {/* Barra de busca */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Buscar cliente..."
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
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Tipo</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Telefone</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">E-mail</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.map((cliente) => (
                  <tr key={cliente.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{cliente.nome}</td>
                    <td className="px-4 py-3">
                      <Badge
                        label={cliente.tipo === 'pessoa_juridica' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                        variant="info"
                      />
                    </td>
                    <td className="px-4 py-3 text-slate-600">{cliente.telefone || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{cliente.email || '-'}</td>
                    <td className="px-4 py-3">
                      <Badge
                        label={cliente.ativo ? 'Ativo' : 'Inativo'}
                        variant={cliente.ativo ? 'success' : 'danger'}
                      />
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(cliente)}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(cliente.id)}
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
                {editingId ? 'Editar Cliente' : 'Novo Cliente'}
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
                <label className="block text-sm font-medium text-slate-900 mb-1">Nome *</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Tipo *</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pessoa_fisica">Pessoa Física</option>
                  <option value="pessoa_juridica">Pessoa Jurídica</option>
                </select>
              </div>

              {/* CPF/CNPJ */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  {formData.tipo === 'pessoa_juridica' ? 'CNPJ' : 'CPF'} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.cpf_cnpj}
                  onChange={(e) => setFormData({ ...formData, cpf_cnpj: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Telefone e WhatsApp */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Telefone</label>
                  <input
                    type="text"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* E-mail */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">E-mail</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Endereço */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Endereço</label>
                <textarea
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              {/* Observações */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Observações</label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              {/* Ativo */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="ativo" className="ml-2 text-sm font-medium text-slate-900">
                  Ativo
                </label>
              </div>

              {/* Botões */}
              <div className="flex gap-2 justify-end pt-4 border-t border-slate-200">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" type="submit">
                  {editingId ? 'Atualizar' : 'Criar'} Cliente
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </MainLayout>
  );
}
