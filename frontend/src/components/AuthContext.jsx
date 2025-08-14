import { createContext, useContext, useState, useEffect } from 'react';
import { API } from '../utils/constants';
import { UsuarioActualizado } from '../services/usuarioService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const userData = await UsuarioActualizado(); // Usa cookie enviada por el backend
        setUsuario(userData.usuario);
      } catch (error) {
        setUsuario(null);
        console.error('No autenticado:', error);
      } finally {
        setCargando(false);
      }
    };
    verificarSesion();
  }, []);

  const login = async (data) => {
    try {
      console.log(API);
      
      const response = await fetch(`${API}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Permite el uso de cookies
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Error al iniciar sesión");

      const userData = await response.json();
      setUsuario(userData.usuario);
      return userData.usuario;
    } catch (error) {
      console.error("Error en inicio de sesión:", error);
      return null;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API}auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setUsuario(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const isAuthenticated = () => !!usuario;

  return (
    <AuthContext.Provider value={{ usuario,login, logout, isAuthenticated, cargando }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
