/**
 * Oculta parcialmente un LID mostrando solo algunos caracteres al inicio y al final
 * @param lid - El LID completo a ocultar
 * @returns El LID con caracteres ocultos (ej: 215680******782)
 */
export function maskLID(lid: string | null | undefined): string {
  if (!lid || lid.trim() === "") {
    return "Sin datos";
  }

  const cleanLid = lid.trim();

  // Siempre ocultar al menos 1 carácter por privacidad
  if (cleanLid.length <= 3) {
    // Para LIDs muy cortos (1-3 caracteres): mostrar solo el primero
    return cleanLid.charAt(0) + "*".repeat(cleanLid.length - 1);
  }

  // Para LIDs cortos (4-9 caracteres): mostrar 2 al inicio y 2 al final
  if (cleanLid.length < 10) {
    const start = cleanLid.substring(0, 2);
    const end = cleanLid.substring(cleanLid.length - 2);
    const hiddenCount = cleanLid.length - 4;
    return `${start}${"*".repeat(hiddenCount)}${end}`;
  }

  // Para LIDs normales (10+ caracteres): mostrar 6 al inicio y 3 al final
  const visibleStart = 6;
  const visibleEnd = 3;
  const hiddenCount = cleanLid.length - visibleStart - visibleEnd;

  const start = cleanLid.substring(0, visibleStart);
  const end = cleanLid.substring(cleanLid.length - visibleEnd);
  const masked = "*".repeat(hiddenCount);

  return `${start}${masked}${end}`;
}
