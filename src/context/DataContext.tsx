'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Cliente, Fornecedor, Obra, ContaPagar, ContaReceber, Funcionario } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface DataContextType {
  clientes: Cliente[];
  fornecedores: Fornecedor[];
  obras: Obra[];
  contasPagar: ContaPagar[];
  contasReceber: ContaReceber[];
  funcionarios: Funcionario[];
  loading: boolean;

  addCliente: (cliente: Omit<Cliente, 'id' | 'criado_em'>) => Promise<void>;
  updateCliente: (id: string, cliente: Partial<Cliente>) => Promise<void>;
  deleteCliente: (id: string) => Promise<void>;

  addObra: (obra: Omit<Obra, 'id' | 'criado_em'>) => Promise<void>;
  updateObra: (id: string, obra: Partial<Obra>) => Promise<void>;
  deleteObra: (id: string) => Promise<void>;

  addFornecedor: (fornecedor: Omit<Fornecedor, 'id' | 'criado_em'>) => Promise<void>;
  updateFornecedor: (id: string, fornecedor: Partial<Fornecedor>) => Promise<void>;
  deleteFornecedor: (id: string) => Promise<void>;

  addContaPagar: (conta: Omit<ContaPagar, 'id' | 'criado_em'>) => Promise<void>;
  updateContaPagar: (id: string, conta: Partial<ContaPagar>) => Promise<void>;
  deleteContaPagar: (id: string) => Promise<void>;

  addContaReceber: (conta: Omit<ContaReceber, 'id' | 'criado_em'>) => Promise<void>;
  updateContaReceber: (id: string, conta: Partial<ContaReceber>) => Promise<void>;
  deleteContaReceber: (id: string) => Promise<void>;

  addFuncionario: (funcionario: Omit<Funcionario, 'id' | 'criado_em'>) => Promise<void>;
  updateFuncionario: (id: string, funcionario: Partial<Funcionario>) => Promise<void>;
  deleteFuncionario: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [obras, setObras] = useState<Obra[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [contasPagar, setContasPagar] = useState<ContaPagar[]>([]);
  const [contasReceber, setContasReceber] = useState<ContaReceber[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [clientesRes, obrasRes, fornecedoresRes, contaspagarRes, contasreceberRes, funcionariosRes] = await Promise.all([
        supabase.from('clientes').select('*'),
        supabase.from('obras').select('*'),
        supabase.from('fornecedores').select('*'),
        supabase.from('contas_pagar').select('*'),
        supabase.from('contas_receber').select('*'),
        supabase.from('funcionarios').select('*'),
      ]);

      if (clientesRes.data) setClientes(clientesRes.data as Cliente[]);
      if (obrasRes.data) setObras(obrasRes.data as Obra[]);
      if (fornecedoresRes.data) setFornecedores(fornecedoresRes.data as Fornecedor[]);
      if (contaspagarRes.data) setContasPagar(contaspagarRes.data as ContaPagar[]);
      if (contasreceberRes.data) setContasReceber(contasreceberRes.data as ContaReceber[]);
      if (funcionariosRes.data) setFuncionarios(funcionariosRes.data as Funcionario[]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const value: DataContextType = {
    clientes,
    fornecedores,
    obras,
    contasPagar,
    contasReceber,
    funcionarios,
    loading,

    addCliente: async (cliente) => {
      const { data, error } = await supabase.from('clientes').insert([cliente]).select().single();
      if (error) throw error;
      if (data) setClientes([...clientes, data as Cliente]);
    },
    updateCliente: async (id, updates) => {
      const { error } = await supabase.from('clientes').update(updates).eq('id', id);
      if (error) throw error;
      setClientes(clientes.map(c => c.id === id ? { ...c, ...updates } : c));
    },
    deleteCliente: async (id) => {
      const { error } = await supabase.from('clientes').delete().eq('id', id);
      if (error) throw error;
      setClientes(clientes.filter(c => c.id !== id));
    },

    addObra: async (obra) => {
      const { data, error } = await supabase.from('obras').insert([obra]).select().single();
      if (error) throw error;
      if (data) setObras([...obras, data as Obra]);
    },
    updateObra: async (id, updates) => {
      const { error } = await supabase.from('obras').update(updates).eq('id', id);
      if (error) throw error;
      setObras(obras.map(o => o.id === id ? { ...o, ...updates } : o));
    },
    deleteObra: async (id) => {
      const { error } = await supabase.from('obras').delete().eq('id', id);
      if (error) throw error;
      setObras(obras.filter(o => o.id !== id));
    },

    addFornecedor: async (fornecedor) => {
      const { data, error } = await supabase.from('fornecedores').insert([fornecedor]).select().single();
      if (error) throw error;
      if (data) setFornecedores([...fornecedores, data as Fornecedor]);
    },
    updateFornecedor: async (id, updates) => {
      const { error } = await supabase.from('fornecedores').update(updates).eq('id', id);
      if (error) throw error;
      setFornecedores(fornecedores.map(f => f.id === id ? { ...f, ...updates } : f));
    },
    deleteFornecedor: async (id) => {
      const { error } = await supabase.from('fornecedores').delete().eq('id', id);
      if (error) throw error;
      setFornecedores(fornecedores.filter(f => f.id !== id));
    },

    addContaPagar: async (conta) => {
      const { data, error } = await supabase.from('contas_pagar').insert([conta]).select().single();
      if (error) throw error;
      if (data) setContasPagar([...contasPagar, data as ContaPagar]);
    },
    updateContaPagar: async (id, updates) => {
      const { error } = await supabase.from('contas_pagar').update(updates).eq('id', id);
      if (error) throw error;
      setContasPagar(contasPagar.map(c => c.id === id ? { ...c, ...updates } : c));
    },
    deleteContaPagar: async (id) => {
      const { error } = await supabase.from('contas_pagar').delete().eq('id', id);
      if (error) throw error;
      setContasPagar(contasPagar.filter(c => c.id !== id));
    },

    addContaReceber: async (conta) => {
      const { data, error } = await supabase.from('contas_receber').insert([conta]).select().single();
      if (error) throw error;
      if (data) setContasReceber([...contasReceber, data as ContaReceber]);
    },
    updateContaReceber: async (id, updates) => {
      const { error } = await supabase.from('contas_receber').update(updates).eq('id', id);
      if (error) throw error;
      setContasReceber(contasReceber.map(c => c.id === id ? { ...c, ...updates } : c));
    },
    deleteContaReceber: async (id) => {
      const { error } = await supabase.from('contas_receber').delete().eq('id', id);
      if (error) throw error;
      setContasReceber(contasReceber.filter(c => c.id !== id));
    },

    addFuncionario: async (funcionario) => {
      const { data, error } = await supabase.from('funcionarios').insert([funcionario]).select().single();
      if (error) throw error;
      if (data) setFuncionarios([...funcionarios, data as Funcionario]);
    },
    updateFuncionario: async (id, updates) => {
      const { error } = await supabase.from('funcionarios').update(updates).eq('id', id);
      if (error) throw error;
      setFuncionarios(funcionarios.map(f => f.id === id ? { ...f, ...updates } : f));
    },
    deleteFuncionario: async (id) => {
      const { error } = await supabase.from('funcionarios').delete().eq('id', id);
      if (error) throw error;
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
