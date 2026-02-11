import type { User } from "../types/auth.types";
import type { RolChatBot } from "../types/chatbot.types";

/**
 * Valida si un usuario del portal puede editar un usuario del chatbot
 * basado en su rol.
 *
 * Reglas:
 * - Usuarios con rol "usuario": editables por "admin" o "master"
 * - Usuarios con rol "admin": solo editables por "master"
 * - Usuarios con rol "master": solo editables por otros "master"
 */
export function canEditChatbotUser(
  portalUser: User | null,
  chatbotUserRole: RolChatBot
): boolean {
  if (!portalUser) return false;

  const portalRole = portalUser.role;

  // Master puede editar a todos
  if (portalRole === "master") return true;

  // Admin puede editar solo a usuarios
  if (portalRole === "admin" && chatbotUserRole === "usuario") return true;

  // User no puede editar a nadie
  return false;
}

/**
 * Obtiene un mensaje explicativo de por qué no se puede editar
 */
export function getEditPermissionMessage(
  portalUser: User | null,
  chatbotUserRole: RolChatBot
): string {
  if (!portalUser) return "Debes iniciar sesión para editar usuarios";

  const portalRole = portalUser.role;

  if (chatbotUserRole === "master") {
    return "Solo usuarios con rol Master pueden editar usuarios Master";
  }

  if (chatbotUserRole === "admin") {
    return "Solo usuarios con rol Master pueden editar usuarios Admin";
  }

  if (chatbotUserRole === "usuario" && portalRole === "user") {
    return "No tienes permisos suficientes para editar usuarios";
  }

  return "No tienes permisos para realizar esta acción";
}
