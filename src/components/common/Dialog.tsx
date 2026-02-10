import { useEffect } from 'react';
import './Dialog.css';

export type DialogType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

interface DialogProps {
  isOpen: boolean;
  type: DialogType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function Dialog({
  isOpen,
  type,
  title,
  message,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}: DialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      case 'confirm':
        return '?';
      default:
        return 'ℹ';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return '#27ae60';
      case 'error':
        return '#e74c3c';
      case 'warning':
        return '#f39c12';
      case 'info':
        return '#4a90e2';
      case 'confirm':
        return '#4a90e2';
      default:
        return '#4a90e2';
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleOverlayClick = () => {
    if (type !== 'confirm') {
      handleConfirm();
    }
  };

  return (
    <div className="dialog-overlay" onClick={handleOverlayClick}>
      <div className="dialog-container" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-icon-wrapper" style={{ background: getIconColor() }}>
          <span className="dialog-icon">{getIcon()}</span>
        </div>

        <div className="dialog-content">
          <h3 className="dialog-title">{title}</h3>
          <p className="dialog-message">{message}</p>
        </div>

        <div className="dialog-actions">
          {type === 'confirm' && onCancel && (
            <button className="dialog-btn dialog-btn-cancel" onClick={handleCancel}>
              {cancelText}
            </button>
          )}
          <button
            className={`dialog-btn dialog-btn-confirm ${type === 'confirm' ? 'confirm' : 'single'}`}
            onClick={handleConfirm}
            style={{
              background: type === 'confirm' ? getIconColor() : getIconColor(),
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
