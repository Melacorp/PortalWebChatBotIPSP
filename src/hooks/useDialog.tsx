import { useState, useCallback } from 'react';
import { DialogType } from '../components/common/Dialog';

interface DialogConfig {
  type: DialogType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export function useDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<DialogConfig>({
    type: 'info',
    title: '',
    message: '',
  });
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const showDialog = useCallback((dialogConfig: DialogConfig): Promise<boolean> => {
    setConfig(dialogConfig);
    setIsOpen(true);

    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    if (resolver) {
      resolver(true);
      setResolver(null);
    }
  }, [resolver]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    if (resolver) {
      resolver(false);
      setResolver(null);
    }
  }, [resolver]);

  // Métodos de conveniencia
  const showSuccess = useCallback((title: string, message: string) => {
    return showDialog({
      type: 'success',
      title,
      message,
      confirmText: 'Aceptar',
    });
  }, [showDialog]);

  const showError = useCallback((title: string, message: string) => {
    return showDialog({
      type: 'error',
      title,
      message,
      confirmText: 'Aceptar',
    });
  }, [showDialog]);

  const showWarning = useCallback((title: string, message: string) => {
    return showDialog({
      type: 'warning',
      title,
      message,
      confirmText: 'Aceptar',
    });
  }, [showDialog]);

  const showInfo = useCallback((title: string, message: string) => {
    return showDialog({
      type: 'info',
      title,
      message,
      confirmText: 'Aceptar',
    });
  }, [showDialog]);

  const showConfirm = useCallback((title: string, message: string, confirmText = 'Confirmar', cancelText = 'Cancelar') => {
    return showDialog({
      type: 'confirm',
      title,
      message,
      confirmText,
      cancelText,
    });
  }, [showDialog]);

  return {
    isOpen,
    config,
    handleConfirm,
    handleCancel,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
  };
}
