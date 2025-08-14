import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../css/sidebar.css'
import { useState } from 'react';

export function Sidebar({
  canchaSeleccionado,
  escenarios,
  onSeleccionarCancha,
}) {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const [seccionesAbiertas, setSeccionesAbiertas] = useState({});

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSeccion = (nombreEscenario) => {
    setSeccionesAbiertas((prev) => {
      const yaEstaAbierto = prev[nombreEscenario];
      // Si está abierto, lo cerramos dejando todo vacío; si no, abrimos solo esa sección
      return yaEstaAbierto ? {} : { [nombreEscenario]: true };
    });
  };

  const canchasPorEscenarios = escenarios.reduce((acc, escenario) => {
    const nombre = escenario.nombre || 'Sin Nombre';
    if (!acc[nombre]) acc[nombre] = [];
    acc[nombre].push(...escenario.canchas);
    return acc;
  }, {});

  return (
    <div className="content-sidebar">
      <div className="usuario-sesion">
        {usuario && (
          <div className="d-flex flex-column align-items-center gap-1">
            <i className="bi bi-person-circle fs-1"></i>
            <div>
              <strong>{usuario.nombre} {usuario.apellido}</strong>
            </div>
          </div>
        )}
      </div>

      <nav className="menu-sidebar" style={{ flexGrow: 1 }}>
        {Object.entries(canchasPorEscenarios).map(([nombreEscenario, canchas]) => {
          const abierto = seccionesAbiertas[nombreEscenario];
          return (
            <div key={nombreEscenario} className="accordion-section">
              <hr className="divider" />
              <div
                className="menu-section-title d-flex justify-content-between align-items-center"
                style={{ cursor: 'pointer' }}
                onClick={() => toggleSeccion(nombreEscenario)}
              >
                <span>{nombreEscenario}</span>
                <i className={`bi ${abierto ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
              </div>

              {abierto && canchas.map((cancha, index) => (
                <div
                  key={cancha.id || `${nombreEscenario}-${index}`}
                  className={`menu-item ${canchaSeleccionado?.id === cancha.id ? 'active' : ''}`}
                  onClick={() => onSeleccionarCancha(cancha)}
                >
                  🥅 {cancha.nombre}
                </div>
              ))}
            </div>
          );
        })}

        {usuario && usuario.tipo === 'admin' && (
          <>
            <hr className="divider" />
            <div className="menu-section-title">Administración</div>
            <Link to="/listado-reservas" className="menu-item">Reservas</Link>
            <Link to="/listado-canchas" className="menu-item">Canchas</Link>
            <div className="menu-item">Contabilidad</div>
          </>
        )}
      </nav>

      <hr className="divider" />
      <div className="menu-item logout" onClick={handleLogout}>
        Cerrar Sesión
      </div>
    </div>
  );
}
