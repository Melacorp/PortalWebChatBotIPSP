import { useState, useEffect } from 'react';
import { chatbotService } from '../../services/chatbot.service';
import { NumeroChatBot, CreateNumeroChatBotDTO, AccesoType } from '../../types/chatbot.types';
import { ReportesAcceso } from '../../config/reportes.config';
import UserModal from './UserModal';
import ReportesModal from './ReportesModal';
import Dialog from '../common/Dialog';
import { useDialog } from '../../hooks/useDialog';
import './Users.css';

export default function Users() {
  const [users, setUsers] = useState<NumeroChatBot[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAcceso, setFilterAcceso] = useState<'all' | AccesoType>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<NumeroChatBot | null>(null);
  const [isReportesModalOpen, setIsReportesModalOpen] = useState(false);
  const [userForReportes, setUserForReportes] = useState<NumeroChatBot | null>(null);

  const dialog = useDialog();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await chatbotService.getAll();
      if (response.ok && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      dialog.showError(
        'Error al Cargar',
        'No se pudieron cargar los usuarios del chatbot. Por favor, intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.numero.includes(searchTerm);

    const matchesAcceso = filterAcceso === 'all' || user.acceso === filterAcceso;

    return matchesSearch && matchesAcceso;
  });

  const handleCreateUser = async (data: CreateNumeroChatBotDTO) => {
    try {
      const response = await chatbotService.create(data);
      if (response.ok) {
        await loadUsers();
        dialog.showSuccess(
          '¡Usuario Creado!',
          'El usuario ha sido creado exitosamente en el sistema.'
        );
      }
    } catch (error) {
      console.error('Error al crear usuario:', error);
      dialog.showError(
        'Error al Crear Usuario',
        error instanceof Error ? error.message : 'Ocurrió un error al crear el usuario. Por favor, intenta de nuevo.'
      );
      throw error;
    }
  };

  const handleUpdateUser = async (data: CreateNumeroChatBotDTO) => {
    if (!selectedUser) return;

    try {
      const response = await chatbotService.update(selectedUser._id, data);
      if (response.ok) {
        await loadUsers();
        dialog.showSuccess(
          '¡Usuario Actualizado!',
          'Los datos del usuario han sido actualizados correctamente.'
        );
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      dialog.showError(
        'Error al Actualizar',
        error instanceof Error ? error.message : 'Ocurrió un error al actualizar el usuario. Por favor, intenta de nuevo.'
      );
      throw error;
    }
  };

  const handleDeleteUser = async (id: string, nombre: string) => {
    const confirmed = await dialog.showConfirm(
      '¿Eliminar Usuario?',
      `¿Estás seguro de que deseas eliminar al usuario "${nombre}"? Esta acción no se puede deshacer.`,
      'Eliminar',
      'Cancelar'
    );

    if (!confirmed) return;

    try {
      const response = await chatbotService.delete(id);
      if (response.ok) {
        await loadUsers();
        dialog.showSuccess(
          'Usuario Eliminado',
          'El usuario ha sido eliminado correctamente del sistema.'
        );
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      dialog.showError(
        'Error al Eliminar',
        error instanceof Error ? error.message : 'Ocurrió un error al eliminar el usuario. Por favor, intenta de nuevo.'
      );
    }
  };

  const handleChangeAcceso = async (id: string, newAcceso: AccesoType) => {
    try {
      const response = await chatbotService.updateAcceso(id, newAcceso);
      if (response.ok) {
        await loadUsers();
      }
    } catch (error) {
      console.error('Error al cambiar acceso:', error);
      dialog.showError(
        'Error al Cambiar Acceso',
        error instanceof Error ? error.message : 'Ocurrió un error al cambiar el nivel de acceso. Por favor, intenta de nuevo.'
      );
    }
  };

  const openCreateModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: NumeroChatBot) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const getAccesoColor = (acceso: AccesoType) => {
    switch (acceso) {
      case 'permitido':
        return '#27ae60';
      case 'pendiente':
        return '#f39c12';
      case 'bloqueado':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const getReportesSummary = (reportes: ReportesAcceso): { count: number; hasAccess: boolean } => {
    if (!reportes) {
      return { count: 0, hasAccess: false };
    }

    let count = 0;
    Object.values(reportes).forEach((subsectores) => {
      if (subsectores.length > 0) {
        count++;
      }
    });

    return { count, hasAccess: count > 0 };
  };

  const handleOpenReportes = (user: NumeroChatBot) => {
    setUserForReportes(user);
    setIsReportesModalOpen(true);
  };

  const handleCloseReportes = () => {
    setIsReportesModalOpen(false);
    setUserForReportes(null);
  };

  if (loading) {
    return (
      <div className="users-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="users-container">
      {/* Controls */}
      <div className="users-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre, correo o número..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters">
          <select
            value={filterAcceso}
            onChange={(e) => setFilterAcceso(e.target.value as typeof filterAcceso)}
            className="filter-select"
          >
            <option value="all">Todos los accesos</option>
            <option value="permitido">Permitido</option>
            <option value="pendiente">Pendiente</option>
            <option value="bloqueado">Bloqueado</option>
          </select>

          <button className="btn-primary" onClick={openCreateModal}>
            <span>➕</span>
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#4a90e2' }}>👥</div>
          <div className="stat-content">
            <div className="stat-value">{users.length}</div>
            <div className="stat-label">Total Usuarios</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#27ae60' }}>✓</div>
          <div className="stat-content">
            <div className="stat-value">{users.filter(u => u.acceso === 'permitido').length}</div>
            <div className="stat-label">Permitidos</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f39c12' }}>⏳</div>
          <div className="stat-content">
            <div className="stat-value">{users.filter(u => u.acceso === 'pendiente').length}</div>
            <div className="stat-label">Pendientes</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e74c3c' }}>🔒</div>
          <div className="stat-content">
            <div className="stat-value">{users.filter(u => u.acceso === 'bloqueado').length}</div>
            <div className="stat-label">Bloqueados</div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Número</th>
              <th>Número LID</th>
              <th>Acceso</th>
              <th>Reportes</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-state">
                  {searchTerm || filterAcceso !== 'all'
                    ? 'No se encontraron usuarios con los filtros aplicados'
                    : 'No hay usuarios registrados'}
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar-small">
                        {user.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="user-name-cell">{user.nombre}</div>
                        <div className="user-username-cell">{user.correo}</div>
                      </div>
                    </div>
                  </td>
                  <td>{user.numero}</td>
                  <td>
                    <code className="numero-lid-badge">{user.numero_lid}</code>
                  </td>
                  <td>
                    <select
                      value={user.acceso}
                      onChange={(e) => handleChangeAcceso(user._id, e.target.value as AccesoType)}
                      className="acceso-select"
                      style={{ borderColor: getAccesoColor(user.acceso) }}
                    >
                      <option value="permitido">Permitido</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="bloqueado">Bloqueado</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn-reportes"
                      onClick={() => handleOpenReportes(user)}
                      title="Ver y gestionar reportes"
                    >
                      {(() => {
                        const { count, hasAccess } = getReportesSummary(user.reportes);
                        return (
                          <>
                            <span className="reportes-icon">📊</span>
                            <span className="reportes-text">
                              {hasAccess ? `${count} sector${count > 1 ? 'es' : ''}` : 'Sin acceso'}
                            </span>
                          </>
                        );
                      })()}
                    </button>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString('es-ES')}</td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="btn-action btn-edit"
                        title="Editar"
                        onClick={() => openEditModal(user)}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-action btn-delete"
                        title="Eliminar"
                        onClick={() => handleDeleteUser(user._id, user.nombre)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={selectedUser ? handleUpdateUser : handleCreateUser}
        onReload={loadUsers}
        user={selectedUser}
        title={selectedUser ? 'Editar Usuario ChatBot' : 'Nuevo Usuario ChatBot'}
      />

      {userForReportes && (
        <ReportesModal
          isOpen={isReportesModalOpen}
          onClose={handleCloseReportes}
          user={userForReportes}
          onUpdate={loadUsers}
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
