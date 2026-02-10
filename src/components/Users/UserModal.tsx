import { useState, FormEvent, useEffect } from 'react';
import { NumeroChatBot, CreateNumeroChatBotDTO } from '../../types/chatbot.types';
import { REPORTES_DEFAULT } from '../../config/reportes.config';
import ReportesModal from './ReportesModal';
import Dialog from '../common/Dialog';
import { useDialog } from '../../hooks/useDialog';
import './UserModal.css';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateNumeroChatBotDTO) => Promise<void>;
  onReload?: () => Promise<void>;
  user?: NumeroChatBot | null;
  title: string;
}

export default function UserModal({ isOpen, onClose, onSave, onReload, user, title }: UserModalProps) {
  const [isReportesModalOpen, setIsReportesModalOpen] = useState(false);
  const dialog = useDialog();
  const [formData, setFormData] = useState<CreateNumeroChatBotDTO>({
    nombre: '',
    correo: '',
    numero: '',
    numero_lid: '',
    acceso: 'permitido',
    reportes: REPORTES_DEFAULT,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateNumeroChatBotDTO, string>>>({});
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
        nombre: '',
        correo: '',
        numero: '',
        numero_lid: '',
        acceso: 'permitido',
        reportes: REPORTES_DEFAULT,
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateNumeroChatBotDTO, string>> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'Formato de correo inválido';
    }

    if (!formData.numero.trim()) {
      newErrors.numero = 'El número es requerido';
    }

    if (!formData.numero_lid.trim()) {
      newErrors.numero_lid = 'El número LID es requerido';
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
      console.error('Error al guardar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenReportesModal = () => {
    if (!user) {
      dialog.showWarning(
        'Usuario No Creado',
        'Primero debes crear el usuario antes de gestionar sus reportes.'
      );
      return;
    }
    setIsReportesModalOpen(true);
  };

  const handleReportesUpdate = async () => {
    if (onReload) {
      await onReload();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof CreateNumeroChatBotDTO]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={errors.nombre ? 'input-error' : ''}
              placeholder="Ej: Juan Pérez"
            />
            {errors.nombre && <span className="error-text">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo Electrónico *</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className={errors.correo ? 'input-error' : ''}
              placeholder="ejemplo@santapriscila.com"
            />
            {errors.correo && <span className="error-text">{errors.correo}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="numero">Número de Teléfono *</label>
              <input
                type="tel"
                id="numero"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                className={errors.numero ? 'input-error' : ''}
                placeholder="1234567890"
              />
              {errors.numero && <span className="error-text">{errors.numero}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="numero_lid">Número LID *</label>
              <input
                type="text"
                id="numero_lid"
                name="numero_lid"
                value={formData.numero_lid}
                onChange={handleChange}
                className={errors.numero_lid ? 'input-error' : ''}
                placeholder="LID123456"
              />
              {errors.numero_lid && <span className="error-text">{errors.numero_lid}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="acceso">Nivel de Acceso</label>
            <select
              id="acceso"
              name="acceso"
              value={formData.acceso}
              onChange={handleChange}
            >
              <option value="permitido">Permitido</option>
              <option value="pendiente">Pendiente</option>
              <option value="bloqueado">Bloqueado</option>
            </select>
          </div>

          {user && (
            <div className="form-group">
              <label>Accesos a Reportes</label>
              <button
                type="button"
                className="btn-manage-reportes"
                onClick={handleOpenReportesModal}
              >
                <span>📊</span>
                <span>Gestionar Accesos a Reportes</span>
              </button>
              <p className="help-text">
                Administra los accesos a reportes por sector y subsector
              </p>
            </div>
          )}

          {!user && (
            <div className="form-group">
              <label>Accesos a Reportes</label>
              <p className="info-box">
                ℹ️ Los accesos a reportes se podrán configurar después de crear el usuario
              </p>
            </div>
          )}

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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : user ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>

      {user && (
        <ReportesModal
          isOpen={isReportesModalOpen}
          onClose={() => setIsReportesModalOpen(false)}
          user={user}
          onUpdate={handleReportesUpdate}
        />
      )}

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
