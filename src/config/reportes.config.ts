// Sectores disponibles
export const SECTORES = ['California', 'Chanduy', 'Taura', 'Cabala 1 y 2'] as const;
export type Sector = typeof SECTORES[number];

// Subsectores de Taura
export const SUBSECTORES_TAURA = [
  'La Luz',
  'Garita',
  'Camaron',
  'Taura 4',
  'Taura 5',
  'Taura 6',
] as const;

export type SubsectorTaura = typeof SUBSECTORES_TAURA[number];
export type Subsector = SubsectorTaura | 'all';

// Estructura de reportes por sector
export interface ReportesAcceso {
  California: string[];
  Chanduy: string[];
  Taura: string[];
  'Cabala 1 y 2': string[];
}

// Valores por defecto
export const REPORTES_DEFAULT: ReportesAcceso = {
  California: [],
  Chanduy: [],
  Taura: [],
  'Cabala 1 y 2': [],
};

// Labels para UI
export const SECTOR_LABELS: Record<Sector, string> = {
  California: 'California',
  Chanduy: 'Chanduy',
  Taura: 'Taura',
  'Cabala 1 y 2': 'Cabala 1 y 2',
};

export const SUBSECTOR_LABELS: Record<string, string> = {
  all: 'Acceso Total',
  'La Luz': 'La Luz',
  Garita: 'Garita',
  Camaron: 'Camarón',
  'Taura 4': 'Taura 4',
  'Taura 5': 'Taura 5',
  'Taura 6': 'Taura 6',
};
