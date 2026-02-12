import { useState, useEffect, useRef } from "react";
import { type NumeroChatBot } from "../../types/chatbot.types";
import type { ReportesAcceso } from "../../config/reportes.config";
import {
  SECTORES,
  SUBSECTORES_TAURA,
  SECTOR_LABELS,
  SUBSECTOR_LABELS,
  type Sector,
} from "../../config/reportes.config";
import { chatbotService } from "../../services/chatbot.service";
import { canEditChatbotUser } from "../../utils/permissions";
import { useAuth } from "../../hooks/useAuth";
import Dialog from "../common/Dialog";
import { useDialog } from "../../hooks/useDialog";
import "./ReportesModal.css";

interface ReportesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: NumeroChatBot;
  onUpdate: () => void;
}

export default function ReportesModal({
  isOpen,
  onClose,
  user,
  onUpdate,
}: ReportesModalProps) {
  const [loading, setLoading] = useState(false);
  const [expandedSector, setExpandedSector] = useState<Sector | null>(null);
  const [localReportes, setLocalReportes] = useState<ReportesAcceso>(user.reportes);
  const [hasChanges, setHasChanges] = useState(false);
  const dialog = useDialog();
  const { user: portalUser } = useAuth();
  const sectorRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Verificar permisos
  const canEdit = canEditChatbotUser(portalUser, user.rol);

  // Hacer scroll al sector cuando se expande
  useEffect(() => {
    if (expandedSector && sectorRefs.current[expandedSector]) {
      setTimeout(() => {
        sectorRefs.current[expandedSector]?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }, 100);
    }
  }, [expandedSector]);

  // Sincronizar estado local cuando cambia el usuario
  useEffect(() => {
    setLocalReportes(user.reportes);
    setHasChanges(false);
  }, [user.reportes, isOpen]);

  const handleToggleSubsector = (sector: Sector, subsector: string) => {
    if (!canEdit) return;

    setLocalReportes((prev) => {
      const currentSector = prev[sector] || [];
      let newSector: string[];

      if (subsector === "all") {
        // Toggle acceso total
        newSector = currentSector.includes("all") ? [] : ["all"];
      } else {
        // Toggle subsector específico
        if (currentSector.includes(subsector)) {
          newSector = currentSector.filter((s) => s !== subsector);
        } else {
          newSector = [...currentSector.filter((s) => s !== "all"), subsector];
        }
      }

      setHasChanges(true);
      return { ...prev, [sector]: newSector };
    });
  };

  const handleSave = async () => {
    if (!canEdit || !hasChanges) {
      onClose();
      return;
    }

    try {
      setLoading(true);

      // Guardar todos los cambios en una sola llamada
      await chatbotService.updateAllReportes(user._id, localReportes);

      await onUpdate();
      dialog.showSuccess(
        "¡Reportes Actualizados!",
        "Los accesos a reportes han sido actualizados correctamente.",
      );
      onClose();
    } catch (error) {
      console.error("Error al actualizar reportes:", error);
      dialog.showError(
        "Error al Actualizar",
        error instanceof Error
          ? error.message
          : "Ocurrió un error al actualizar los reportes. Por favor, intenta de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isSubsectorActive = (sector: Sector, subsector: string): boolean => {
    const sectorReportes = localReportes[sector] || [];
    if (sectorReportes.includes("all")) return subsector === "all";
    return sectorReportes.includes(subsector);
  };

  const hasAccessToSector = (sector: Sector): boolean => {
    const sectorReportes = localReportes[sector] || [];
    return sectorReportes.length > 0;
  };

  const getSectorSummary = (sector: Sector): string => {
    const sectorReportes = localReportes[sector] || [];
    if (sectorReportes.length === 0) return "Sin acceso";
    if (sectorReportes.includes("all")) return "Acceso Total";
    return `${sectorReportes.length} subsector${sectorReportes.length > 1 ? "es" : ""}`;
  };

  if (!isOpen) return null;

  return (
    <div className="reportes-modal-overlay" onClick={onClose}>
      <div
        className="reportes-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="reportes-modal-header">
          <div>
            <h2>Gestión de Accesos a Reportes</h2>
            <p className="user-info">
              {user.nombre} - {user.correo}
            </p>
            {!canEdit && (
              <p className="permission-warning-small">
                ⚠️ Solo puedes visualizar, no tienes permisos para editar
              </p>
            )}
          </div>
          <button className="reportes-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="reportes-modal-body">
          {SECTORES.map((sector) => {
            const isExpanded = expandedSector === sector;
            const hasAccess = hasAccessToSector(sector);

            return (
              <div
                key={sector}
                ref={(el) => {
                  sectorRefs.current[sector] = el;
                }}
                className={`sector-card ${hasAccess ? "has-access" : ""}`}
              >
                <div
                  className="sector-card-header"
                  onClick={() => setExpandedSector(isExpanded ? null : sector)}
                >
                  <div className="sector-info">
                    <h3>{SECTOR_LABELS[sector]}</h3>
                    <span
                      className={`sector-status ${hasAccess ? "active" : ""}`}
                    >
                      {getSectorSummary(sector)}
                    </span>
                  </div>
                  <span
                    className={`expand-icon ${isExpanded ? "expanded" : ""}`}
                  >
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
                          checked={isSubsectorActive(sector, "all")}
                          onChange={() => handleToggleSubsector(sector, "all")}
                          disabled={loading || !canEdit}
                        />
                        <span className="subsector-name all">
                          {SUBSECTOR_LABELS.all}
                        </span>
                      </label>
                    </div>

                    {/* Subsectores específicos solo para Taura */}
                    {sector === "Taura" && (
                      <>
                        <div className="subsector-divider"></div>
                        <p className="subsector-section-title">
                          Subsectores Específicos
                        </p>
                        {SUBSECTORES_TAURA.map((subsector) => (
                          <div key={subsector} className="subsector-item">
                            <label className="subsector-checkbox">
                              <input
                                type="checkbox"
                                checked={isSubsectorActive(sector, subsector)}
                                onChange={() =>
                                  handleToggleSubsector(sector, subsector)
                                }
                                disabled={
                                  loading || !canEdit || isSubsectorActive(sector, "all")
                                }
                              />
                              <span
                                className={`subsector-name ${
                                  isSubsectorActive(sector, "all")
                                    ? "disabled"
                                    : ""
                                }`}
                              >
                                {SUBSECTOR_LABELS[subsector]}
                              </span>
                            </label>
                          </div>
                        ))}
                        {isSubsectorActive(sector, "all") && (
                          <p className="subsector-hint">
                            💡 Desmarca "Acceso Total" para seleccionar
                            subsectores específicos
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
          {hasChanges && canEdit && (
            <p className="changes-indicator">
              ⚠️ Tienes cambios sin guardar
            </p>
          )}
          <div className="footer-buttons">
            <button
              className="btn-cancel-reportes"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              className="btn-done"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Guardando..." : hasChanges && canEdit ? "Guardar Cambios" : "Cerrar"}
            </button>
          </div>
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
