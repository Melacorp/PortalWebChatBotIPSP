import { useState, type FormEvent, useEffect } from "react";
import type {
  NumeroChatBot,
  CreateNumeroChatBotDTO,
} from "../../types/chatbot.types";
import { REPORTES_DEFAULT } from "../../config/reportes.config";
import {
  canEditChatbotUser,
  getEditPermissionMessage,
} from "../../utils/permissions";
import { useAuth } from "../../hooks/useAuth";
import Dialog from "../common/Dialog";
import Tooltip from "../common/Tooltip";
import { useDialog } from "../../hooks/useDialog";
import "./UserModal.css";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateNumeroChatBotDTO) => Promise<void>;
  onReload?: () => Promise<void>;
  user?: NumeroChatBot | null;
  title: string;
}

export default function UserModal({
  isOpen,
  onClose,
  onSave,
  user,
  title,
}: UserModalProps) {
  const dialog = useDialog();
  const { user: portalUser } = useAuth();
  const [formData, setFormData] = useState<CreateNumeroChatBotDTO>({
    nombre: "",
    correo: "",
    numero: "",
    numero_lid: "",
    acceso: "permitido",
    reportes: REPORTES_DEFAULT,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateNumeroChatBotDTO, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre,
        correo: user.correo,
        numero: user.numero,
        numero_lid: user.numero_lid,
        acceso: user.acceso,
        reportes: user.reportes,
      });
    } else {
      setFormData({
        nombre: "",
        correo: "",
        numero: "",
        numero_lid: "",
        acceso: "permitido",
        reportes: REPORTES_DEFAULT,
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateNumeroChatBotDTO, string>> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.correo.trim()) {
      newErrors.correo = "El correo es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = "Formato de correo inválido";
    }

    // Validar que al menos uno de los dos esté presente
    const hasNumero = formData.numero.trim().length > 0;
    const hasNumeroLid = formData.numero_lid.trim().length > 0;

    if (!hasNumero && !hasNumeroLid) {
      newErrors.numero =
        "Debe proporcionar al menos el número de teléfono o el número LID";
      newErrors.numero_lid =
        "Debe proporcionar al menos el número de teléfono o el número LID";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Excluir reportes del payload - se gestionan por separado
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { reportes, ...dataToSend } = formData;
      await onSave(dataToSend);
      onClose();
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CreateNumeroChatBotDTO]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (!isOpen) return null;

  // Verificar permisos de edición
  const canEdit = user ? canEditChatbotUser(portalUser, user.rol) : true;
  const permissionMessage =
    user && !canEdit ? getEditPermissionMessage(portalUser, user.rol) : "";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {!canEdit && (
          <div className="permission-warning">
            <span className="warning-icon">⚠️</span>
            <span>{permissionMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={errors.nombre ? "input-error" : ""}
              placeholder="Ej: Juan Pérez"
              disabled={!canEdit}
            />
            {errors.nombre && (
              <span className="error-text">{errors.nombre}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo Electrónico *</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className={errors.correo ? "input-error" : ""}
              placeholder="ejemplo@santapriscila.com"
              disabled={!canEdit}
            />
            {errors.correo && (
              <span className="error-text">{errors.correo}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="numero">Número de Teléfono</label>
              <input
                type="tel"
                id="numero"
                name="numero"
                value={formData.numero || "Sin datos"}
                className="input-readonly"
                readOnly
              />
              <p className="help-text">Este campo no se puede editar</p>
            </div>

            <div className="form-group">
              <label htmlFor="numero_lid">
                Número LID
                <Tooltip content='LID (Link ID): Es la "identidad digital" fija de tu WhatsApp. es un identificador interno introducido en 2025 para aumentar la privacidad y permite que el sistema te reconozca siempre como el mismo usuario, sin importar qué número de teléfono tengas vinculado en ese momento.'>
                  <span className="info-icon">ⓘ</span>
                </Tooltip>
              </label>
              <input
                type="text"
                id="numero_lid"
                name="numero_lid"
                value={formData.numero_lid || "Sin datos"}
                className="input-readonly"
                readOnly
              />
              <p className="help-text">Este campo no se puede editar</p>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={isSubmitting || !canEdit}
            >
              {isSubmitting ? "Guardando..." : user ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
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
