import { useState, useEffect } from 'react';
import { chatbotService } from '../../services/chatbot.service';
import { NumeroChatBot, CreateNumeroChatBotDTO, AccesoType } from '../../types/chatbot.types';
import { REPORTE_LABELS } from '../../config/reportes.config';
import UserModal from './UserModal';
import './Users.css';

export default function Users() {
  const [users, setUsers] = useState<NumeroChatBot[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAcceso, setFilterAcceso] = useState<'all' | AccesoType>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<NumeroChatBot | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await chatbotService.getAll();
      if (response.ok && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      alert('Error al cargar los usuarios del chatbot');
    } finally {
      setLoading(false);
    }
  };

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
        alert('Usuario creado correctamente');
      }
    } catch (error) {
      console.error('Error al crear usuario:', error);
      alert(error instanceof Error ? error.message : 'Error al crear usuario');
      throw error;
    }
  };

  const handleUpdateUser = async (data: CreateNumeroChatBotDTO) => {
    if (!selectedUser) return;

    try {
      const response = await chatbotService.update(selectedUser._id, data);
      if (response.ok) {
        await loadUsers();
        alert('Usuario actualizado correctamente');
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      alert(error instanceof Error ? error.message : 'Error al actualizar usuario');
      throw error;
    }
  };

  const handleDeleteUser = async (id: string, nombre: string) => {
    if (!window.confirm(`¿Está seguro de eliminar al usuario "${nombre}"?`)) {
      return;
    }

    try {
      const response = await chatbotService.delete(id);
      if (response.ok) {
        await loadUsers();
        alert('Usuario eliminado correctamente');
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert(error instanceof Error ? error.message : 'Error al eliminar usuario');
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
      alert(error instanceof Error ? error.message : 'Error al cambiar acceso');
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
      case 'all':
        return '#27ae60';
      case 'limitado':
        return '#f39c12';
      case 'pendiente':
        return '#3498db';
      case 'bloqueado':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const getAccesoLabel = (acceso: AccesoType) => {
    switch (acceso) {
      case 'all':
        return 'Completo';
      case 'limitado':
        return 'Limitado';
      case 'pendiente':
        return 'Pendiente';
      case 'bloqueado':
        return 'Bloqueado';
      default:
        return acceso;
    }
  };

  const formatReportes = (reportes: string[]): string => {
    if (!reportes || reportes.length === 0) {
      return 'Ninguno';
    }
    if (reportes.includes('all')) {
      return REPORTE_LABELS.all;
    }
    return reportes.map(r => REPORTE_LABELS[r] || r).join(', ');
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
            <option value="all">Acceso Completo</option>
            <option value="limitado">Acceso Limitado</option>
            <option value="pendiente">Pendientes</option>
            <option value="bloqueado">Bloqueados</option>
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
            <div className="stat-value">{users.filter(u => u.acceso === 'all').length}</div>
            <div className="stat-label">Acceso Completo</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3498db' }}>⏳</div>
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
                      <option value="all">Completo</option>
                      <option value="limitado">Limitado</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="bloqueado">Bloqueado</option>
                    </select>
                  </td>
                  <td>
                    <div className="reportes-badge-container">
                      <span className="reportes-badge" title={formatReportes(user.reportes)}>
                        {formatReportes(user.reportes)}
                      </span>
                    </div>
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
        user={selectedUser}
        title={selectedUser ? 'Editar Usuario ChatBot' : 'Nuevo Usuario ChatBot'}
      />
    </div>
  );
}
