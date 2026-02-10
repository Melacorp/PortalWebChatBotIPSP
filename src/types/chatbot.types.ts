import { ReportesAcceso } from '../config/reportes.config';

export type AccesoType = 'permitido' | 'pendiente' | 'bloqueado';

export interface NumeroChatBot {
  _id: string;
  nombre: string;
  correo: string;
  numero: string;
  numero_lid: string;
  acceso: AccesoType;
  reportes: ReportesAcceso;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNumeroChatBotDTO {
  nombre: string;
  correo: string;
  numero: string;
  numero_lid: string;
  acceso?: AccesoType;
  reportes?: ReportesAcceso;
}

export interface UpdateNumeroChatBotDTO {
  nombre?: string;
  correo?: string;
  numero?: string;
  numero_lid?: string;
  acceso?: AccesoType;
  reportes?: ReportesAcceso;
}

export interface ApiResponse<T> {
  ok: boolean;
  message?: string;
  data?: T;
  total?: number;
}
