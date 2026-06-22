// Tipos de usuário (roles)
export type UserRole = 'admin' | 'financeiro' | 'obras' | 'funcionario' | 'visualizador';

export interface User {
  id: string;
  email: string;
  nome: string;
  role: UserRole;
  ativo: boolean;
  criado_em: string;
}

export interface Obra {
  id: string;
  nome: string;
  endereco: string;
  cliente_id: string;
  responsavel_id: string;
  status: 'planejamento' | 'em_andamento' | 'pausada' | 'finalizada';
  data_inicio: string;
  data_prevista_fim: string;
  data_real_fim?: string;
  orcamento_previsto: number;
  centro_custo_id?: string;
  observacoes?: string;
  criado_em: string;
}

export interface Cliente {
  id: string;
  nome: string;
  tipo: 'pessoa_fisica' | 'pessoa_juridica';
  cpf_cnpj: string;
  telefone?: string;
  whatsapp?: string;
  email?: string;
  endereco?: string;
  observacoes?: string;
  ativo: boolean;
  criado_em: string;
}

export interface Fornecedor {
  id: string;
  nome: string;
  tipo: 'pessoa_fisica' | 'pessoa_juridica';
  cpf_cnpj: string;
  categoria: string;
  telefone?: string;
  whatsapp?: string;
  email?: string;
  endereco?: string;
  observacoes?: string;
  ativo: boolean;
  criado_em: string;
}

export interface Funcionario {
  id: string;
  nome: string;
  cpf: string;
  telefone?: string;
  funcao: string;
  tipo_pagamento: 'salario' | 'diaria' | 'empreitada';
  valor_mensal_ou_diaria: number;
  data_admissao: string;
  data_desligamento?: string;
  status: 'ativo' | 'afastado' | 'desligado';
  obra_vinculada_id?: string;
  observacoes?: string;
  criado_em: string;
}

export interface ContaPagar {
  id: string;
  descricao: string;
  fornecedor_id?: string;
  obra_id?: string;
  categoria_id: string;
  valor: number;
  data_vencimento: string;
  data_pagamento?: string;
  status: 'pendente' | 'pago' | 'vencido' | 'cancelado';
  forma_pagamento?: string;
  observacoes?: string;
  criado_em: string;
}

export interface ContaReceber {
  id: string;
  descricao: string;
  cliente_id: string;
  obra_id: string;
  valor: number;
  data_vencimento: string;
  data_recebimento?: string;
  status: 'pendente' | 'recebido' | 'vencido' | 'cancelado';
  forma_recebimento?: string;
  numero_boleto?: string;
  observacoes?: string;
  criado_em: string;
}
