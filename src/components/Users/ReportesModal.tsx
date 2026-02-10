import { useState } from 'react';
import { NumeroChatBot } from '../../types/chatbot.types';
import {
  SECTORES,
  SUBSECTORES_TAURA,
  SECTOR_LABELS,
  SUBSECTOR_LABELS,
  Sector,
} from '../../config/reportes.config';
import { chatbotService } from '../../services/chatbot.service';
import Dialog from '../common/Dialog';
import { useDialog } from '../../hooks/useDialog';
import './ReportesModal.css';

interface ReportesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: NumeroChatBot;
  onUpdate: () => void;
}

export default function ReportesModal({ isOpen, onClose, user, onUpdate }: ReportesModalProps) {
  const [loading, setLoading] = useState(false);
  const [expandedSector, setExpandedSector] = useState<Sector | null>(null);
  const dialog = useDialog();

  const handleToggleSubsector = async (sector: Sector, subsector: string) => {
    try {
      setLoading(true);
      const currentSector = user.reportes[sector] || [];

      let accion: 'agregar' | 'quitar' | 'set';

      if (subsector === 'all') {
        // Toggle acceso total
        accion = currentSector.includes('all') ? 'quitar' : 'set';
      } else {
        // Toggle subsector específico
        accion = currentSector.includes(subsector) ? 'quitar' : 'agregar';
      }

      await chatbotService.updateReportes(user._id, sector, accion, subsector);
      await onUpdate();
    } catch (error) {
      console.error('Error al actualizar reportes:', error);
      dialog.showError(
        'Error al Actualizar',
        error instanceof Error ? error.message : 'Ocurrió un error al actualizar los reportes. Por favor, intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  const isSubsectorActive = (sector: Sector, subsector: string): boolean => {
    const sectorReportes = user.reportes[sector] || [];
    if (sectorReportes.includes('all')) return subsector === 'all';
    return sectorReportes.includes(subsector);
  };

  const hasAccessToSector = (sector: Sector): boolean => {
    const sectorReportes = user.reportes[sector] || [];
    return sectorReportes.length > 0;
  };

  const getSectorSummary = (sector: Sector): string => {
    const sectorReportes = user.reportes[sector] || [];
    if (sectorReportes.length === 0) return 'Sin acceso';
    if (sectorReportes.includes('all')) return 'Acceso Total';
    return `${sectorReportes.length} subsector${sectorReportes.length > 1 ? 'es' : ''}`;
  };

  if (!isOpen) return null;

  return (
    <div className="reportes-modal-overlay" onClick={onClose}>
      <div className="reportes-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="reportes-modal-header">
          <div>
            <h2>Gestión de Accesos a Reportes</h2>
            <p className="user-info">{user.nombre} - {user.correo}</p>
          </div>
          <button className="reportes-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="reportes-modal-body">
          {SECTORES.map((sector) => {
            const isExpanded = expandedSector === sector;
            const hasAccess = hasAccessToSector(sector);

            return (
              <div key={sector} className={`sector-card ${hasAccess ? 'has-access' : ''}`}>
                <div
                  className="sector-card-header"
                  onClick={() => setExpandedSector(isExpanded ? null : sector)}
                >
                  <div className="sector-info">
                    <h3>{SECTOR_LABELS[sector]}</h3>
                    <span className={`sector-status ${hasAccess ? 'active' : ''}`}>
                      {getSectorSummary(sector)}
                    </span>
                  </div>
                  <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                    ▼
                  </span>
                </div>

                {isExpanded && (
                  <div className="sector-card-body">
                    {/* Acceso Total */}
                    <div className="subsector-item">
                      <label className="subsector-checkbox">
                        <input
                          type="checkbox"
                          checked={isSubsectorActive(sector, 'all')}
                          onChange={() => handleToggleSubsector(sector, 'all')}
                          disabled={loading}
                        />
                        <span className="subsector-name all">
                          {SUBSECTOR_LABELS.all}
                        </span>
                      </label>
                    </div>

                    {/* Subsectores específicos solo para Taura */}
                    {sector === 'Taura' && (
                      <>
                        <div className="subsector-divider"></div>
                        <p className="subsector-section-title">Subsectores Específicos</p>
                        {SUBSECTORES_TAURA.map((subsector) => (
                          <div key={subsector} className="subsector-item">
                            <label className="subsector-checkbox">
                              <input
                                type="checkbox"
                                checked={isSubsectorActive(sector, subsector)}
                                onChange={() => handleToggleSubsector(sector, subsector)}
                                disabled={loading || isSubsectorActive(sector, 'all')}
                              />
                              <span
                                className={`subsector-name ${
                                  isSubsectorActive(sector, 'all') ? 'disabled' : ''
                                }`}
                              >
                                {SUBSECTOR_LABELS[subsector]}
                              </span>
                            </label>
                          </div>
                        ))}
                        {isSubsectorActive(sector, 'all') && (
                          <p className="subsector-hint">
                            💡 Desmarca "Acceso Total" para seleccionar subsectores específicos
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="reportes-modal-footer">
          <button className="btn-done" onClick={onClose} disabled={loading}>
            {loading ? 'Guardando...' : 'Listo'}
          </button>
        </div>
      </div>

      <Dialog
        isOpen={dialog.isOpen}
        type={dialog.config.type}
        title={dialog.config.title}
        message={dialog.config.message}
        confirmText={dialog.config.confirmText}
        cancelText={dialog.config.cancelText}
        onConfirm={dialog.handleConfirm}
        onCancel={dialog.handleCancel}
      />
    </div>
  );
}
