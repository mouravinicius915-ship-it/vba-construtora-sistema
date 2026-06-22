'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Cliente, Fornecedor, Obra, ContaPagar, ContaReceber, Funcionario } from '@/lib/types';

interface DataContextType {
  clientes: Cliente[];
  fornecedores: Fornecedor[];
  obras: Obra[];
  contasPagar: ContaPagar[];
  contasReceber: ContaReceber[];
  funcionarios: Funcionario[];

  // Clientes
  addCliente: (cliente: Omit<Cliente, 'id' | 'criado_em'>) => void;
  updateCliente: (id: string, cliente: Partial<Cliente>) => void;
  deleteCliente: (id: string) => void;

  // Obras
  addObra: (obra: Omit<Obra, 'id' | 'criado_em'>) => void;
  updateObra: (id: string, obra: Partial<Obra>) => void;
  deleteObra: (id: string) => void;

  // Fornecedores
  addFornecedor: (fornecedor: Omit<Fornecedor, 'id' | 'criado_em'>) => void;
  updateFornecedor: (id: string, fornecedor: Partial<Fornecedor>) => void;
  deleteFornecedor: (id: string) => void;

  // Contas a pagar
  addContaPagar: (conta: Omit<ContaPagar, 'id' | 'criado_em'>) => void;
  updateContaPagar: (id: string, conta: Partial<ContaPagar>) => void;
  deleteContaPagar: (id: string) => void;

  // Contas a receber
  addContaReceber: (conta: Omit<ContaReceber, 'id' | 'criado_em'>) => void;
  updateContaReceber: (id: string, conta: Partial<ContaReceber>) => void;
  deleteContaReceber: (id: string) => void;

  // Funcionários
  addFuncionario: (funcionario: Omit<Funcionario, 'id' | 'criado_em'>) => void;
  updateFuncionario: (id: string, funcionario: Partial<Funcionario>) => void;
  deleteFuncionario: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substr(2, 9);

// Dados mock iniciais
const INITIAL_CLIENTES: Cliente[] = [
  {
    id: '1',
    nome: 'João Silva Construção',
    tipo: 'pessoa_juridica',
    cpf_cnpj: '12.345.678/0001-90',
    telefone: '(11) 3333-4444',
    whatsapp: '(11) 99999-8888',
    email: 'joao@construcao.com.br',
    endereco: 'Rua das Flores, 100 - São Paulo, SP',
    observacoes: 'Cliente prioritário',
    ativo: true,
    criado_em: new Date().toISOString(),
  },
  {
    id: '2',
    nome: 'Maria Oliveira',
    tipo: 'pessoa_fisica',
    cpf_cnpj: '123.456.789-00',
    telefone: '(11) 2222-3333',
    whatsapp: '(11) 98888-7777',
    email: 'maria@email.com',
    endereco: 'Avenida Paulista, 1000 - São Paulo, SP',
    observacoes: '',
    ativo: true,
    criado_em: new Date().toISOString(),
  },
];

const INITIAL_OBRAS: Obra[] = [
  {
    id: '1',
    nome: 'Central Plaza',
    endereco: 'Rua das Flores, 100 - São Paulo, SP',
    cliente_id: '1',
    responsavel_id: 'admin',
    status: 'em_andamento',
    data_inicio: '2026-01-15',
    data_prevista_fim: '2026-08-30',
    orcamento_previsto: 500000,
    observacoes: 'Projeto comercial',
    criado_em: new Date().toISOString(),
  },
  {
    id: '2',
    nome: 'Residential Sunset',
    endereco: 'Avenida Paulista, 1000 - São Paulo, SP',
    cliente_id: '2',
    responsavel_id: 'admin',
    status: 'em_andamento',
    data_inicio: '2026-03-01',
    data_prevista_fim: '2026-10-15',
    orcamento_previsto: 750000,
    observacoes: 'Condomínio residencial',
    criado_em: new Date().toISOString(),
  },
];

const INITIAL_FORNECEDORES: Fornecedor[] = [
  {
    id: '1',
    nome: 'Construtora ABC Materiais',
    tipo: 'pessoa_juridica',
    cpf_cnpj: '98.765.432/0001-10',
    categoria: 'Materiais de Construção',
    telefone: '(11) 4444-5555',
    whatsapp: '(11) 97777-6666',
    email: 'contato@abcmateriais.com.br',
    endereco: 'Rua Industrial, 500 - São Paulo, SP',
    ativo: true,
    criado_em: new Date().toISOString(),
  },
];

const INITIAL_CONTAS_PAGAR: ContaPagar[] = [
  {
    id: '1',
    descricao: 'Pagamento - Fornecedor ABC',
    fornecedor_id: '1',
    obra_id: '1',
    categoria_id: 'materiais',
    valor: 5000,
    data_vencimento: '2026-06-20',
    status: 'pendente',
    criado_em: new Date().toISOString(),
  },
];

const INITIAL_CONTAS_RECEBER: ContaReceber[] = [
  {
    id: '1',
    descricao: 'Fatura nº 001 - Central Plaza',
    cliente_id: '1',
    obra_id: '1',
    valor: 50000,
    data_vencimento: '2026-06-20',
    status: 'pendente',
    criado_em: new Date().toISOString(),
  },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [clientes, setClientes] = useState<Cliente[]>(INITIAL_CLIENTES);
  const [obras, setObras] = useState<Obra[]>(INITIAL_OBRAS);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(INITIAL_FORNECEDORES);
  const [contasPagar, setContasPagar] = useState<ContaPagar[]>(INITIAL_CONTAS_PAGAR);
  const [contasReceber, setContasReceber] = useState<ContaReceber[]>(INITIAL_CONTAS_RECEBER);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  const value: DataContextType = {
    clientes,
    fornecedores,
    obras,
    contasPagar,
    contasReceber,
    funcionarios,

    addCliente: (cliente) => {
      setClientes([...clientes, { ...cliente, id: generateId(), criado_em: new Date().toISOString() } as Cliente]);
    },
    updateCliente: (id, updates) => {
      setClientes(clientes.map(c => c.id === id ? { ...c, ...updates } : c));
    },
    deleteCliente: (id) => {
      setClientes(clientes.filter(c => c.id !== id));
    },

    addObra: (obra) => {
      setObras([...obras, { ...obra, id: generateId(), criado_em: new Date().toISOString() } as Obra]);
    },
    updateObra: (id, updates) => {
      setObras(obras.map(o => o.id === id ? { ...o, ...updates } : o));
    },
    deleteObra: (id) => {
      setObras(obras.filter(o => o.id !== id));
    },

    addFornecedor: (fornecedor) => {
      setFornecedores([...fornecedores, { ...fornecedor, id: generateId(), criado_em: new Date().toISOString() } as Fornecedor]);
    },
    updateFornecedor: (id, updates) => {
      setFornecedores(fornecedores.map(f => f.id === id ? { ...f, ...updates } : f));
    },
    deleteFornecedor: (id) => {
      setFornecedores(fornecedores.filter(f => f.id !== id));
    },

    addContaPagar: (conta) => {
      setContasPagar([...contasPagar, { ...conta, id: generateId(), criado_em: new Date().toISOString() } as ContaPagar]);
    },
    updateContaPagar: (id, updates) => {
      setContasPagar(contasPagar.map(c => c.id === id ? { ...c, ...updates } : c));
    },
    deleteContaPagar: (id) => {
      setContasPagar(contasPagar.filter(c => c.id !== id));
    },

    addContaReceber: (conta) => {
      setContasReceber([...contasReceber, { ...conta, id: generateId(), criado_em: new Date().toISOString() } as ContaReceber]);
    },
    updateContaReceber: (id, updates) => {
      setContasReceber(contasReceber.map(c => c.id === id ? { ...c, ...updates } : c));
    },
    deleteContaReceber: (id) => {
      setContasReceber(contasReceber.filter(c => c.id !== id));
    },

    addFuncionario: (funcionario) => {
      setFuncionarios([...funcionarios, { ...funcionario, id: generateId(), criado_em: new Date().toISOString() } as Funcionario]);
    },
    updateFuncionario: (id, updates) => {
      setFuncionarios(funcionarios.map(f => f.id === id ? { ...f, ...updates } : f));
    },
    deleteFuncionario: (id) => {
      setFuncionarios(funcionarios.filter(f => f.id !== id));
    },
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser usado dentro de DataProvider');
  }
  return context;
}
