import { useAuth } from './hooks/useAuth';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  const { isAuthenticated, isInitializing } = useAuth();

  // Mostrar loading solo mientras se verifica la sesión inicial
  if (isInitializing) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #4a90e2',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#666', fontSize: '14px' }}>Cargando...</p>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <Login />;
}

export default App;
