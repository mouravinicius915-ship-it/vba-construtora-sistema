'use client';

import { useState } from 'react';
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
  arquivo?: File;
}

export default function DocumentosPage() {
  const { obras } = useData();

  const [documentos, setDocumentos] = useState<Documento[]>([
    {
      id: 'emp1',
      nome: 'Alvara_Funcionamento_VBA.pdf',
      tipo: 'Contrato',
      dataUpload: '2026-05-15',
      tamanho: '1.8 MB',
    },
    {
      id: 'emp2',
      nome: 'Certidao_Cnpj.pdf',
      tipo: 'Outro',
      dataUpload: '2026-05-20',
      tamanho: '0.9 MB',
    },
    {
      id: 'emp3',
      nome: 'Seguro_Responsabilidade_Civil.pdf',
      tipo: 'Recibo',
      dataUpload: '2026-06-01',
      tamanho: '2.1 MB',
    },
    {
      id: '1',
      nome: 'Contrato_Central_Plaza.pdf',
      tipo: 'Contrato',
      obra_id: '1',
      dataUpload: '2026-06-10',
      tamanho: '2.5 MB',
    },
    {
      id: '2',
      nome: 'RRT_Residential_Sunset.pdf',
      tipo: 'RRT',
      obra_id: '2',
      dataUpload: '2026-06-12',
      tamanho: '1.2 MB',
    },
    {
      id: '3',
      nome: 'Projeto_Central_Plaza.skp',
      tipo: 'Projeto SketchUp',
      obra_id: '1',
      dataUpload: '2026-06-11',
      tamanho: '15.5 MB',
    },
    {
      id: '4',
      nome: 'Planta_Residential_Sunset.dwg',
      tipo: 'AutoCAD',
      obra_id: '2',
      dataUpload: '2026-06-09',
      tamanho: '3.2 MB',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterObra, setFilterObra] = useState('');
  const [viewMode, setViewMode] = useState<'empresa' | 'obras'>('obras');
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    tipo: 'Contrato',
    obra_id: '',
  });

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

  const getObraName = (id: string) => obras.find(o => o.id === id)?.nome || 'Obra não encontrada';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!arquivo) {
      alert('Por favor, selecione um arquivo');
      return;
    }

    if (viewMode === 'obras' && !formData.obra_id) {
      alert('Por favor, selecione uma obra');
      return;
    }

    const tamanhoKB = (arquivo.size / 1024).toFixed(2);
    const tamanhoMB = arquivo.size / (1024 * 1024);
    const tamanhoFormatado = tamanhoMB > 1 ? `${tamanhoMB.toFixed(2)} MB` : `${tamanhoKB} KB`;

    const novoDoc: Documento = {
      id: Math.random().toString(),
      nome: arquivo.name,
      tipo: formData.tipo,
      obra_id: formData.obra_id,
      dataUpload: new Date().toISOString().split('T')[0],
      tamanho: tamanhoFormatado,
      arquivo: arquivo,
    };

    setDocumentos([...documentos, novoDoc]);
    resetForm();
    setArquivo(null);
    setShowModal(false);
  };

  const resetForm = () => {
    setFormData({
      tipo: 'Contrato',
      obra_id: '',
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArquivo(e.target.files[0]);
    }
  };

  const handleDownload = (doc: Documento) => {
    if (doc.arquivo) {
      const url = URL.createObjectURL(doc.arquivo);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.nome;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      alert('Arquivo não disponível para download');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar este documento?')) {
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
            <p className="text-slate-600 mt-1">Gerenciador centralizado de arquivos e documentos</p>
          </div>
          <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
            <Plus size={20} />
            Novo Documento
          </Button>
        </div>

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

        {/* Card de resumo */}
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">
                {viewMode === 'empresa' ? 'Total - Documentos da Empresa' : 'Total - Documentos das Obras'}
              </p>
              <h3 className="text-4xl font-bold text-blue-900 mt-2">
                {viewMode === 'empresa' ? documentosEmpresa.length : documentosObras.length}
              </h3>
              <p className="text-xs text-blue-600 mt-1">
                {viewMode === 'empresa' ? 'Documentos da empresa armazenados' : 'Documentos de obras armazenados'}
              </p>
            </div>
            <div className="p-4 bg-blue-200 rounded-lg">
              <FileText size={32} className="text-blue-600" />
            </div>
          </div>
        </Card>

        {/* Filtros */}
        {viewMode === 'empresa' ? (
          <input
            type="text"
            placeholder="Buscar documento da empresa..."
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

        {/* Visualização de Documentos */}
        {viewMode === 'empresa' ? (
          // Vista de Documentos da Empresa
          <Card>
            <div className="mb-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FolderOpen size={20} className="text-blue-600" />
                <h3 className="text-xl font-semibold text-slate-900">Documentos da Empresa</h3>
                <Badge label={`${filteredDocumentosEmpresa.length} arquivo(s)`} variant="primary" />
              </div>
            </div>
            {filteredDocumentosEmpresa.length === 0 ? (
              <p className="text-slate-500 text-center py-8">Nenhum documento encontrado</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">Arquivo</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">Tipo</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">Data</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">Tamanho</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocumentosEmpresa.map((doc) => (
                      <tr key={doc.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FileText size={16} className="text-slate-600" />
                            <span className="font-medium text-slate-900">{doc.nome}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge label={doc.tipo} variant={tipoColors[doc.tipo] || 'info'} />
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {new Date(doc.dataUpload).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{doc.tamanho}</td>
                        <td className="px-4 py-3 flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleDownload(doc)}>
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
        ) : filterObra ? (
          // Vista de uma obra específica
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
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Arquivo</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Tipo</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Data</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Tamanho</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocumentos.map((doc) => (
                    <tr key={doc.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-slate-600" />
                          <span className="font-medium text-slate-900">{doc.nome}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge label={doc.tipo} variant={tipoColors[doc.tipo] || 'info'} />
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {new Date(doc.dataUpload).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{doc.tamanho}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleDownload(doc)}>
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
          </Card>
        ) : (
          // Vista geral por obra (viewMode === 'obras')
          <div className="space-y-4">
            {documentosPorObra.map(grupo => (
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
                        <th className="px-4 py-3 text-left font-semibold text-slate-900">Arquivo</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-900">Tipo</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-900">Data</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-900">Tamanho</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-900">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grupo.documentos.map((doc) => (
                        <tr key={doc.id} className="border-b border-slate-200 hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <FileText size={16} className="text-slate-600" />
                              <span className="font-medium text-slate-900">{doc.nome}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge label={doc.tipo} variant={tipoColors[doc.tipo] || 'info'} />
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {new Date(doc.dataUpload).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-4 py-3 text-slate-600">{doc.tamanho}</td>
                          <td className="px-4 py-3 flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleDownload(doc)}>
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
              </Card>
            ))}
          </div>
        )}

        {/* Tipos de documentos aceitos */}
        <Card>
          <div className="mb-4 pb-4 border-b border-slate-200">
            <h4 className="font-semibold text-slate-900">Tipos de Documentos e Formatos Aceitos</h4>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-4">Documentos:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {['Contrato', 'RRT', 'ART', 'NF', 'Recibo', 'Projeto', 'Foto', 'Outro'].map(tipo => (
                <div key={tipo} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                  <FileText size={16} className="text-slate-600" />
                  <span className="text-sm text-slate-700">{tipo}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-600 mb-4">Projetos CAD:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {['Projeto SketchUp', 'AutoCAD'].map(tipo => (
                <div key={tipo} className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                  <FileText size={16} className="text-blue-600" />
                  <span className="text-sm text-blue-700">{tipo}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">Formatos: .skp, .dwg, .dxf, .pdf, .doc, .docx, .xls, .xlsx, .jpg, .png, .zip</p>
          </div>
        </Card>
      </div>

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
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Selecione um Arquivo *</label>
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:bg-blue-50 transition-colors">
                  <input
                    type="file"
                    id="arquivo"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".skp,.dwg,.dxf,.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip"
                  />
                  <label htmlFor="arquivo" className="cursor-pointer">
                    <div className="text-blue-600 font-medium">
                      {arquivo ? arquivo.name : '📁 Clique ou arraste arquivo aqui'}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      SketchUp, AutoCAD, PDF, Office, Imagens, ZIP
                    </p>
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
                      required
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
                <Button variant="primary" type="submit">Adicionar Documento</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </MainLayout>
  );
}
