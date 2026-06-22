'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useData } from '@/context/DataContext';
import { Plus, FileText, Trash2, X, Download, FolderOpen } from 'lucide-react';

interface Documento {
  id: string;
  nome: string;
  tipo: string;
  obra_id?: string;
  dataUpload: string;
  tamanho: string;
}

export default function DocumentosPage() {
  const { obras } = useData();
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterObra, setFilterObra] = useState('');
  const [viewMode, setViewMode] = useState<'empresa' | 'obras'>('obras');
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [formData, setFormData] = useState({ tipo: 'Contrato', obra_id: '' });

  // Carregar documentos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('documentos');
    if (saved) {
      try {
        setDocumentos(JSON.parse(saved));
      } catch (e) {
        console.error('Erro ao carregar documentos');
      }
    }
  }, []);

  // Salvar documentos no localStorage quando mudam
  useEffect(() => {
    localStorage.setItem('documentos', JSON.stringify(documentos));
  }, [documentos]);

  const documentosEmpresa = documentos.filter(d => !d.obra_id);
  const documentosObras = documentos.filter(d => d.obra_id);

  const filteredDocumentosEmpresa = documentosEmpresa.filter(d =>
    d.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDocumentos = documentosObras.filter(d => {
    const matchSearch = d.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchObra = !filterObra || d.obra_id === filterObra;
    return matchSearch && matchObra;
  });

  const documentosPorObra = obras.map(obra => ({
    obra,
    documentos: documentosObras.filter(d => d.obra_id === obra.id),
  })).filter(g => g.documentos.length > 0);

  const getObraName = (id?: string) => obras.find(o => o.id === id)?.nome || 'Obra não encontrada';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!arquivo) {
      alert('Selecione um arquivo');
      return;
    }
    if (viewMode === 'obras' && !formData.obra_id) {
      alert('Selecione uma obra');
      return;
    }

    const tamanhoMB = (arquivo.size / (1024 * 1024)).toFixed(2);
    const novoDoc: Documento = {
      id: Math.random().toString(),
      nome: arquivo.name,
      tipo: formData.tipo,
      obra_id: viewMode === 'obras' ? formData.obra_id : undefined,
      dataUpload: new Date().toISOString().split('T')[0],
      tamanho: `${tamanhoMB} MB`,
    };

    setDocumentos([...documentos, novoDoc]);
    setArquivo(null);
    setFormData({ tipo: 'Contrato', obra_id: '' });
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deletar documento?')) {
      setDocumentos(documentos.filter(d => d.id !== id));
    }
  };

  const tipoColors: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
    'Contrato': 'primary',
    'RRT': 'info',
    'ART': 'info',
    'NF': 'warning',
    'Recibo': 'success',
    'Projeto': 'primary',
    'Projeto SketchUp': 'primary',
    'AutoCAD': 'primary',
    'Foto': 'info',
    'Outro': 'info',
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Documentos</h2>
            <p className="text-slate-600 mt-1">Gerenciador centralizado de arquivos</p>
          </div>
          <Button variant="primary" onClick={() => { setFormData({ tipo: 'Contrato', obra_id: '' }); setShowModal(true); }}>
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

        {/* Abas */}
        <div className="flex gap-2 border-b border-slate-200">
          <button
            onClick={() => { setViewMode('empresa'); setSearchTerm(''); setFilterObra(''); }}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              viewMode === 'empresa'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Documentos da Empresa
          </button>
          <button
            onClick={() => { setViewMode('obras'); setSearchTerm(''); setFilterObra(''); }}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              viewMode === 'obras'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Documentos das Obras
          </button>
        </div>

        {/* Filtros */}
        {viewMode === 'empresa' ? (
          <input
            type="text"
            placeholder="Buscar documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Buscar documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
        )}

        {/* Conteúdo */}
        {viewMode === 'empresa' ? (
          <Card>
            <div className="mb-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FolderOpen size={20} className="text-blue-600" />
                <h3 className="text-xl font-semibold text-slate-900">Documentos da Empresa</h3>
                <Badge label={`${filteredDocumentosEmpresa.length} arquivo(s)`} variant="primary" />
              </div>
            </div>
            {filteredDocumentosEmpresa.length === 0 ? (
              <p className="text-slate-600 text-center py-8">Nenhum documento adicionado</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-left font-semibold">Arquivo</th>
                      <th className="px-4 py-3 text-left font-semibold">Tipo</th>
                      <th className="px-4 py-3 text-left font-semibold">Data</th>
                      <th className="px-4 py-3 text-left font-semibold">Tamanho</th>
                      <th className="px-4 py-3 text-left font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocumentosEmpresa.map(doc => (
                      <tr key={doc.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-4 py-3 flex items-center gap-2">
                          <FileText size={16} className="text-slate-600" />
                          {doc.nome}
                        </td>
                        <td className="px-4 py-3">
                          <Badge label={doc.tipo} variant={tipoColors[doc.tipo] || 'info'} />
                        </td>
                        <td className="px-4 py-3 text-slate-600">{new Date(doc.dataUpload).toLocaleDateString('pt-BR')}</td>
                        <td className="px-4 py-3 text-slate-600">{doc.tamanho}</td>
                        <td className="px-4 py-3 flex gap-2">
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
        ) : (
          <div className="space-y-4">
            {filterObra ? (
              <Card>
                <div className="mb-4 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <FolderOpen size={20} className="text-blue-600" />
                    <h3 className="text-xl font-semibold text-slate-900">{getObraName(filterObra)}</h3>
                    <Badge label={`${filteredDocumentos.length} arquivo(s)`} variant="primary" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-4 py-3 text-left font-semibold">Arquivo</th>
                        <th className="px-4 py-3 text-left font-semibold">Tipo</th>
                        <th className="px-4 py-3 text-left font-semibold">Data</th>
                        <th className="px-4 py-3 text-left font-semibold">Tamanho</th>
                        <th className="px-4 py-3 text-left font-semibold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocumentos.map(doc => (
                        <tr key={doc.id} className="border-b border-slate-200 hover:bg-slate-50">
                          <td className="px-4 py-3 flex items-center gap-2">
                            <FileText size={16} className="text-slate-600" />
                            {doc.nome}
                          </td>
                          <td className="px-4 py-3">
                            <Badge label={doc.tipo} variant={tipoColors[doc.tipo] || 'info'} />
                          </td>
                          <td className="px-4 py-3 text-slate-600">{new Date(doc.dataUpload).toLocaleDateString('pt-BR')}</td>
                          <td className="px-4 py-3 text-slate-600">{doc.tamanho}</td>
                          <td className="px-4 py-3 flex gap-2">
                            <Button size="sm" variant="danger" onClick={() => handleDelete(doc.id)}>
                              <Trash2 size={16} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              documentosPorObra.map(grupo => (
                <Card key={grupo.obra.id}>
                  <div className="mb-4 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <FolderOpen size={20} className="text-blue-600" />
                      <h3 className="text-lg font-semibold text-slate-900">{grupo.obra.nome}</h3>
                      <Badge label={`${grupo.documentos.length} arquivo(s)`} variant="primary" />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <th className="px-4 py-3 text-left font-semibold">Arquivo</th>
                          <th className="px-4 py-3 text-left font-semibold">Tipo</th>
                          <th className="px-4 py-3 text-left font-semibold">Data</th>
                          <th className="px-4 py-3 text-left font-semibold">Tamanho</th>
                          <th className="px-4 py-3 text-left font-semibold">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grupo.documentos.map(doc => (
                          <tr key={doc.id} className="border-b border-slate-200 hover:bg-slate-50">
                            <td className="px-4 py-3 flex items-center gap-2">
                              <FileText size={16} className="text-slate-600" />
                              {doc.nome}
                            </td>
                            <td className="px-4 py-3">
                              <Badge label={doc.tipo} variant={tipoColors[doc.tipo] || 'info'} />
                            </td>
                            <td className="px-4 py-3 text-slate-600">{new Date(doc.dataUpload).toLocaleDateString('pt-BR')}</td>
                            <td className="px-4 py-3 text-slate-600">{doc.tamanho}</td>
                            <td className="px-4 py-3 flex gap-2">
                              <Button size="sm" variant="danger" onClick={() => handleDelete(doc.id)}>
                                <Trash2 size={16} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Modal */}
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
                      onChange={(e) => setArquivo(e.target.files?.[0] || null)}
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

                <div className={viewMode === 'empresa' ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-2 gap-4'}>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Tipo *</label>
                    <select
                      value={formData.tipo}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Contrato">Contrato</option>
                      <option value="RRT">RRT</option>
                      <option value="ART">ART</option>
                      <option value="NF">Nota Fiscal</option>
                      <option value="Recibo">Recibo</option>
                      <option value="Projeto">Projeto</option>
                      <option value="Projeto SketchUp">Projeto SketchUp</option>
                      <option value="AutoCAD">AutoCAD</option>
                      <option value="Foto">Foto</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>

                  {viewMode === 'obras' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-1">Obra *</label>
                      <select
                        value={formData.obra_id}
                        onChange={(e) => setFormData({ ...formData, obra_id: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selecione uma obra</option>
                        {obras.map(o => (
                          <option key={o.id} value={o.id}>{o.nome}</option>
                        ))}
                      </select>
                    </div>
                  )}
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
