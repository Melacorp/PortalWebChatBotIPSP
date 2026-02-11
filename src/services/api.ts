import { ENV } from '../config/env';

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = ENV.API_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // Obtener token del localStorage
    const token = localStorage.getItem('token');

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    };

    try {
      console.log(`[API] ${options.method || 'GET'} ${url}`);

      const response = await fetch(url, config);

      console.log(`[API] Response Status: ${response.status}`);

      // Intentar leer el contenido
      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;

        // Si la respuesta es JSON, intentar extraer el mensaje
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            console.log('[API] Error Response:', errorData);
            errorMessage = errorData.message || errorMessage;
          } catch (parseError) {
            console.error('[API] Failed to parse error response:', parseError);
            // Si falla al parsear, usar el mensaje por defecto
          }
        } else {
          // Si no es JSON, probablemente sea HTML (error del servidor)
          const text = await response.text();
          console.error('[API] Response is not JSON:', text.substring(0, 200));
          errorMessage = `Error del servidor: La ruta "${endpoint}" no devolvió JSON. Verifica que el endpoint sea correcto.`;
        }

        console.error('[API] Throwing error:', errorMessage);
        throw new Error(errorMessage);
      }

      // Verificar que la respuesta sea JSON
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('[API] Expected JSON but got:', text.substring(0, 200));
        throw new Error('La respuesta del servidor no es JSON válido');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        console.error('[API] Error:', error.message);
        throw error;
      }
      throw new Error('Error de conexión con el servidor');
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
