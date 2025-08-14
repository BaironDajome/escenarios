import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Registro from '../pages/Registro';
import CanchaListado from '../pages/CanchaListado';
import ReservaListado from '../pages/ReservaListado';
import PrivateRoute from '../components/PrivateRoute';
import { useAuth } from '../components/AuthContext';
import Reservas from './Reservas';
import CardSlider from './CardSlider';
import { useEffect, useState } from 'react';
import { dataCanchas } from '../services/data-cancha';

export default function SystemRoutes() {
  const { isAuthenticated, cargando } = useAuth();
const [canchas, setCanchas] = useState([]);
  
  useEffect(() => {
    const cargarCanchas = async () => {
      // const data = await obtenerCanchas();
      setCanchas(dataCanchas || []);
    };

    cargarCanchas();
  }, []);


if (cargando) return null;

  

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated() ? (
            <Navigate to="/gestion-reserva" replace />
          ) : (
            <Navigate to="/inicio" replace />
          )
        }
      />
      <Route path="/inicio" element={<CardSlider canchas={canchas} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/listado-canchas" element={<PrivateRoute><CanchaListado /></PrivateRoute>} />
      <Route path="/listado-reservas" element={<PrivateRoute><ReservaListado /></PrivateRoute>} />
      <Route path="/gestion-reserva" element={<PrivateRoute><Reservas /></PrivateRoute>} />
    </Routes>
  );
}
