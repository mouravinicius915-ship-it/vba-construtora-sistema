export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',

  // Módulos
  OBRAS: '/obras',
  OBRAS_CREATE: '/obras/criar',
  OBRAS_EDIT: (id: string) => `/obras/${id}/editar`,
  OBRAS_VIEW: (id: string) => `/obras/${id}`,

  CLIENTES: '/clientes',
  CLIENTES_CREATE: '/clientes/criar',
  CLIENTES_EDIT: (id: string) => `/clientes/${id}/editar`,

  FORNECEDORES: '/fornecedores',
  FORNECEDORES_CREATE: '/fornecedores/criar',
  FORNECEDORES_EDIT: (id: string) => `/fornecedores/${id}/editar`,

  FINANCEIRO: '/financeiro',
  FINANCEIRO_PAGAR: '/financeiro/pagar',
  FINANCEIRO_RECEBER: '/financeiro/receber',

  FUNCIONARIOS: '/funcionarios',
  FUNCIONARIOS_CREATE: '/funcionarios/criar',
  FUNCIONARIOS_EDIT: (id: string) => `/funcionarios/${id}/editar`,

  DOCUMENTOS: '/documentos',
} as const;

export const MENU_ITEMS = [
  {
    label: 'Dashboard',
    href: ROUTES.DASHBOARD,
    icon: 'LayoutDashboard',
    roles: ['admin', 'financeiro', 'obras'],
  },
  {
    label: 'Obras',
    href: ROUTES.OBRAS,
    icon: 'Building2',
    roles: ['admin', 'obras', 'financeiro'],
  },
  {
    label: 'Clientes',
    href: ROUTES.CLIENTES,
    icon: 'Users',
    roles: ['admin', 'financeiro'],
  },
  {
    label: 'Fornecedores',
    href: ROUTES.FORNECEDORES,
    icon: 'Truck',
    roles: ['admin', 'financeiro'],
  },
  {
    label: 'Financeiro',
    href: ROUTES.FINANCEIRO,
    icon: 'DollarSign',
    roles: ['admin', 'financeiro'],
    submenu: [
      {
        label: 'Contas a Pagar',
        href: ROUTES.FINANCEIRO_PAGAR,
        roles: ['admin', 'financeiro'],
      },
      {
        label: 'Contas a Receber',
        href: ROUTES.FINANCEIRO_RECEBER,
        roles: ['admin', 'financeiro'],
      },
    ],
  },
  {
    label: 'Funcionários',
    href: ROUTES.FUNCIONARIOS,
    icon: 'Users2',
    roles: ['admin', 'obras'],
  },
  {
    label: 'Documentos',
    href: ROUTES.DOCUMENTOS,
    icon: 'FileText',
    roles: ['admin', 'financeiro', 'obras'],
  },
];
