import type { ReportesAcceso } from "../config/reportes.config";

export type AccesoType = "permitido" | "pendiente" | "bloqueado";
export type RolChatBot = "usuario" | "admin" | "master";

export interface NumeroChatBot {
  _id: string;
  nombre: string;
  correo: string;
  numero: string;
  numero_lid: string;
  acceso: AccesoType;
  rol: RolChatBot;
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
  rol?: RolChatBot;
  reportes?: ReportesAcceso;
}

export interface UpdateNumeroChatBotDTO {
  nombre?: string;
  correo?: string;
  numero?: string;
  numero_lid?: string;
  acceso?: AccesoType;
  rol?: RolChatBot;
  reportes?: ReportesAcceso;
}

export interface ApiResponse<T> {
  ok: boolean;
  message?: string;
  data?: T;
  total?: number;
}
