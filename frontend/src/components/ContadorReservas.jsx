import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { ObtnerConteoPendientes } from "../services/reservaService";

export default function ContadorReservas({refreshKey}) {
  const { isAuthenticated, usuario } = useAuth();
  const [contador, setContador] = useState(0);

  useEffect(() => {
    const cargarPendientes = async () => {
      if (isAuthenticated && usuario?.tipo === 'admin') {
        try {
          const pendientes = await ObtnerConteoPendientes();
          setContador(pendientes);
        } catch (error) {
          console.error("Error al cargar contador:", error);
        }
      }
    };

    cargarPendientes();
  }, [isAuthenticated, usuario, refreshKey]);

  if (!isAuthenticated || usuario?.tipo !== 'admin' || contador === 0) return null;

  return (
    <div
      className="position-fixed top-0 end-0 p-3"
      style={{ zIndex: 1060 }}
    >
      <div className="position-relative">
        <i className="bi bi-bell-fill fs-6 text-dark"></i>
        <span
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          style={{ fontSize: "0.60rem" }}
        >
          {contador}
          <span className="visually-hidden">notificaciones</span>
        </span>
      </div>
    </div>

  );
}
