'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useData } from '@/context/DataContext';
import { Plus, FileText, Trash2, X, Download } from 'lucide-react';

export default function DocumentosPage() {
  const { obras } = useData();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [arquivo, setArquivo] = useState<File | null>(null);

  const filteredDocs = documentos.filter(d =>
    d.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setArquivo(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!arquivo) {
      alert('Selecione um arquivo');
      return;
    }
    const newDoc = {
      id: Math.random().toString(),
      nome: arquivo.name,
      tipo: 'Documento',
      tamanho: (arquivo.size / 1024).toFixed(2) + ' KB',
      data: new Date().toLocaleDateString('pt-BR'),
    };
    setDocumentos([...documentos, newDoc]);
    setArquivo(null);
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deletar documento?')) {
      setDocumentos(documentos.filter(d => d.id !== id));
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Documentos</h2>
            <p className="text-slate-600 mt-1">Gerenciador centralizado de arquivos</p>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus size={20} />
            Novo Documento
          </Button>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total de Documentos</p>
              <h3 className="text-4xl font-bold text-blue-900 mt-2">{documentos.length}</h3>
            </div>
            <div className="p-4 bg-blue-200 rounded-lg">
              <FileText size={32} className="text-blue-600" />
            </div>
          </div>
        </Card>

        <input
          type="text"
          placeholder="Buscar documento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <Card>
          {filteredDocs.length === 0 ? (
            <p className="text-slate-600 text-center py-8">Nenhum documento adicionado</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left font-semibold">Arquivo</th>
                    <th className="px-4 py-3 text-left font-semibold">Tamanho</th>
                    <th className="px-4 py-3 text-left font-semibold">Data</th>
                    <th className="px-4 py-3 text-left font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map(doc => (
                    <tr key={doc.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 flex items-center gap-2">
                        <FileText size={16} />
                        {doc.nome}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{doc.tamanho}</td>
                      <td className="px-4 py-3 text-slate-600">{doc.data}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download size={16} />
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(doc.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Novo Documento</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Arquivo *</label>
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:bg-blue-50">
                    <input
                      type="file"
                      id="arquivo"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.skp,.dwg,.dxf,.zip"
                    />
                    <label htmlFor="arquivo" className="cursor-pointer">
                      <div className="text-blue-600 font-medium">
                        {arquivo ? arquivo.name : '📁 Clique ou arraste arquivo'}
                      </div>
                    </label>
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-4 border-t border-slate-200">
                  <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                  <Button variant="primary" type="submit">Adicionar</Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
