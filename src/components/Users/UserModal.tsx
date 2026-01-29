import { useState, FormEvent, useEffect } from 'react';
import { NumeroChatBot, CreateNumeroChatBotDTO, AccesoType } from '../../types/chatbot.types';
import { REPORTES_DISPONIBLES, REPORTE_LABELS } from '../../config/reportes.config';
import './UserModal.css';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateNumeroChatBotDTO) => Promise<void>;
  user?: NumeroChatBot | null;
  title: string;
}

export default function UserModal({ isOpen, onClose, onSave, user, title }: UserModalProps) {
  const [formData, setFormData] = useState<CreateNumeroChatBotDTO>({
    nombre: '',
    correo: '',
    numero: '',
    numero_lid: '',
    acceso: 'all',
    reportes: ['all'],
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
        acceso: 'all',
        reportes: ['all'],
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
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof CreateNumeroChatBotDTO]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleReporteToggle = (reporte: string) => {
    setFormData(prev => {
      const currentReportes = prev.reportes || [];

      if (reporte === 'all') {
        return { ...prev, reportes: ['all'] };
      }

      const filteredReportes = currentReportes.filter(r => r !== 'all');

      if (filteredReportes.includes(reporte)) {
        const newReportes = filteredReportes.filter(r => r !== reporte);
        return { ...prev, reportes: newReportes.length === 0 ? ['all'] : newReportes };
      } else {
        return { ...prev, reportes: [...filteredReportes, reporte] };
      }
    });
  };

  const isReporteSelected = (reporte: string): boolean => {
    const reportes = formData.reportes || [];
    if (reportes.includes('all')) return reporte === 'all';
    return reportes.includes(reporte);
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
              <option value="all">Acceso Completo</option>
              <option value="limitado">Acceso Limitado</option>
              <option value="pendiente">Pendiente de Aprobación</option>
              <option value="bloqueado">Bloqueado</option>
            </select>
          </div>

          <div className="form-group">
            <label>Reportes Disponibles</label>
            <div className="reportes-selector">
              <div className="reporte-option">
                <input
                  type="checkbox"
                  id="reporte-all"
                  checked={isReporteSelected('all')}
                  onChange={() => handleReporteToggle('all')}
                />
                <label htmlFor="reporte-all" className="reporte-label">
                  {REPORTE_LABELS.all}
                </label>
              </div>
              <div className="reportes-divider"></div>
              {REPORTES_DISPONIBLES.map((reporte) => (
                <div key={reporte} className="reporte-option">
                  <input
                    type="checkbox"
                    id={`reporte-${reporte}`}
                    checked={isReporteSelected(reporte)}
                    onChange={() => handleReporteToggle(reporte)}
                    disabled={isReporteSelected('all')}
                  />
                  <label
                    htmlFor={`reporte-${reporte}`}
                    className={`reporte-label ${isReporteSelected('all') ? 'disabled' : ''}`}
                  >
                    {REPORTE_LABELS[reporte] || reporte}
                  </label>
                </div>
              ))}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : user ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
