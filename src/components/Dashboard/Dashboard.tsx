import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Users from '../Users/Users';
import logoSantaPriscila from '../../assets/logo_SantaPriscila.png';
import './Dashboard.css';

type Section = 'users';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>('users');

  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return <Users />;
      default:
        return <Users />;
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logoSantaPriscila} alt="Santa Priscila" className="sidebar-logo" />
          <h2 className="sidebar-title">Santa Priscila</h2>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSection('users')}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-text">Usuarios ChatBot</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
          <button onClick={logout} className="btn-logout-sidebar">
            <span className="logout-icon">🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="content-header">
          <div className="header-left">
            <h1 className="page-title">
              {activeSection === 'users' && 'Usuarios ChatBot'}
            </h1>
          </div>
          <div className="header-right">
            <div className="user-badge">
              <span className="user-badge-icon">👤</span>
              <span>{user?.username}</span>
            </div>
          </div>
        </header>

        <div className="content-body">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
