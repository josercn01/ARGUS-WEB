export type Role = 'super_admin' | 'editor' | 'consulta';

export interface AuthUser {
  email: string;
  name: string;
  role: Role;
}

export interface ConfiguracaoLicenca {
  id: string;
  nome_software: string;
  total_licencas: number;
}

export interface LicencaUsuario {
  id: string;
  email: string;
  nome: string;
  matricula: string;
  departamento_raiz: string;
  sub_departamento: string;
  possui_licenca: boolean;
  tipo_licenca: string; // Ex: "Adobe Acrobat Pro, PDF Gear"
  status: 'Ativo' | 'Pendente' | 'Inativo';
  atualizado_por?: string;
  atualizado_em?: string;
}

export interface DashboardLicenca {
  tipo_licenca: string;
  total_disponivel: number;
  em_uso: number;
  disponiveis: number;
}
