import { apiClient } from './api';
import type { ReportesAcceso } from '../config/reportes.config';
import {
  NumeroChatBot,
  CreateNumeroChatBotDTO,
  UpdateNumeroChatBotDTO,
  ApiResponse,
  AccesoType,
} from '../types/chatbot.types';

const BASE_PATH = '/api/numeros-chatbot';

export const chatbotService = {
  // Obtener todos los números
  async getAll(): Promise<ApiResponse<NumeroChatBot[]>> {
    return apiClient.get<ApiResponse<NumeroChatBot[]>>(BASE_PATH);
  },

  // Obtener números con acceso pendiente
  async getPendientes(): Promise<ApiResponse<NumeroChatBot[]>> {
    return apiClient.get<ApiResponse<NumeroChatBot[]>>(`${BASE_PATH}/pendientes`);
  },

  // Obtener por ID
  async getById(id: string): Promise<ApiResponse<NumeroChatBot>> {
    return apiClient.get<ApiResponse<NumeroChatBot>>(`${BASE_PATH}/${id}`);
  },

  // Buscar por número de teléfono
  async getByNumero(numero: string): Promise<ApiResponse<NumeroChatBot>> {
    return apiClient.get<ApiResponse<NumeroChatBot>>(`${BASE_PATH}/numero/${numero}`);
  },

  // Crear nuevo número
  async create(data: CreateNumeroChatBotDTO): Promise<ApiResponse<NumeroChatBot>> {
    return apiClient.post<ApiResponse<NumeroChatBot>>(BASE_PATH, data);
  },

  // Actualizar completo
  async update(id: string, data: UpdateNumeroChatBotDTO): Promise<ApiResponse<NumeroChatBot>> {
    return apiClient.put<ApiResponse<NumeroChatBot>>(`${BASE_PATH}/${id}`, data);
  },

  // Actualizar solo acceso
  async updateAcceso(id: string, acceso: AccesoType): Promise<ApiResponse<NumeroChatBot>> {
    return apiClient.patch<ApiResponse<NumeroChatBot>>(`${BASE_PATH}/${id}/acceso`, { acceso });
  },

  // Actualizar reportes por sector
  async updateReportes(
    id: string,
    sector: string,
    accion: 'agregar' | 'quitar' | 'set',
    subsector: string
  ): Promise<ApiResponse<NumeroChatBot>> {
    return apiClient.patch<ApiResponse<NumeroChatBot>>(`${BASE_PATH}/${id}/reportes`, {
      sector,
      accion,
      subsector,
    });
  },

  // Actualizar todos los reportes de una vez
  async updateAllReportes(
    id: string,
    reportes: ReportesAcceso
  ): Promise<ApiResponse<NumeroChatBot>> {
    return apiClient.put<ApiResponse<NumeroChatBot>>(`${BASE_PATH}/${id}/reportes`, {
      reportes,
    });
  },

  // Eliminar
  async delete(id: string): Promise<ApiResponse<NumeroChatBot>> {
    return apiClient.delete<ApiResponse<NumeroChatBot>>(`${BASE_PATH}/${id}`);
  },
};
