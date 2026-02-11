import { apiClient } from './api';

interface NotifyAccessChangeParams {
  userId: string;
  sendEmail?: boolean;
  sendWhatsApp?: boolean;
}

interface NotifyAccessChangeResponse {
  ok: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      nombre: string;
      acceso: string;
    };
    sent: {
      email: boolean;
      whatsapp: boolean;
    };
    results: unknown;
  };
}

export const notificationService = {
  /**
   * Envía notificación de cambio de acceso a un usuario
   */
  async notifyAccessChange({
    userId,
    sendEmail = true,
    sendWhatsApp = true,
  }: NotifyAccessChangeParams): Promise<NotifyAccessChangeResponse> {
    return apiClient.post<NotifyAccessChangeResponse>(
      `/api/notifications/access-change/${userId}`,
      {
        sendEmail,
        sendWhatsApp,
      }
    );
  },
};
