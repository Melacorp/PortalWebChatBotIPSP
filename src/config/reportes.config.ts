export const REPORTES_DISPONIBLES = [
  'California',
  'Chanduy',
  'La Luz',
  'Camaron',
  'Cabala1',
  'Cabala2',
] as const;

export type ReporteType = typeof REPORTES_DISPONIBLES[number] | 'all';

export const REPORTE_LABELS: Record<string, string> = {
  all: 'Todos los reportes',
  California: 'California',
  Chanduy: 'Chanduy',
  'La Luz': 'La Luz',
  Camaron: 'Camarón',
  Cabala1: 'Cabala 1',
  Cabala2: 'Cabala 2',
};
