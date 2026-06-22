'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useData } from '@/context/DataContext';
import { Plus, FileText, Trash2, X, Download } from 'lucide-react';

export default function DocumentosPage() {
  const { obras } = useData();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Documentos</h2>
            <p className="text-slate-600 mt-1">Gerenciador centralizado de arquivos e documentos</p>
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
              <h3 className="text-4xl font-bold text-blue-900 mt-2">0</h3>
              <p className="text-xs text-blue-600 mt-1">Documentos armazenados</p>
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
          <p className="text-slate-600 text-center py-8">Nenhum documento adicionado ainda. Clique em "Novo Documento" para começar.</p>
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
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Selecione um Arquivo *</label>
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:bg-blue-50 transition-colors">
                    <input type="file" id="arquivo" className="hidden" />
                    <label htmlFor="arquivo" className="cursor-pointer">
                      <div className="text-blue-600 font-medium">📁 Clique ou arraste arquivo aqui</div>
                      <p className="text-xs text-slate-500 mt-1">Formatos suportados: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, SKP, DWG, DXF, ZIP</p>
                    </label>
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-4 border-t border-slate-200">
                  <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                  <Button variant="primary">Adicionar Documento</Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
