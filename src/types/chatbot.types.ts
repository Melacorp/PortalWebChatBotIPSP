export type AccesoType = 'all' | 'pendiente' | 'bloqueado' | 'limitado';

export interface NumeroChatBot {
  _id: string;
  nombre: string;
  correo: string;
  numero: string;
  numero_lid: string;
  acceso: AccesoType;
  reportes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateNumeroChatBotDTO {
  nombre: string;
  correo: string;
  numero: string;
  numero_lid: string;
  acceso?: AccesoType;
  reportes?: string[];
}

export interface UpdateNumeroChatBotDTO {
  nombre?: string;
  correo?: string;
  numero?: string;
  numero_lid?: string;
  acceso?: AccesoType;
  reportes?: string[];
}

export interface ApiResponse<T> {
  ok: boolean;
  message?: string;
  data?: T;
  total?: number;
}
