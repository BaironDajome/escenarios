// src/pages/PagoRespuesta.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { crearReservaPagada } from "../services/calendarioService";

export default function PagoRespuesta() {
  const navigate = useNavigate();

  useEffect(() => {
    const procesarPago = async (reservaPayload) => {

      if (!reservaPayload) {
        alert("No hay datos de reserva para registrar.");
        return navigate("/gestion-reserva");
      }


      try {
        await crearReservaPagada(reservaPayload);
        alert("Reserva y pago registrados exitosamente");
      } catch (error) {
        console.error(error);
        alert("Error al guardar la reserva");
      } finally {
        localStorage.removeItem("reservaPayload");
        navigate("/gestion-reserva");
      }
    };

    procesarPago();
  }, []);

  return <div>Procesando pago, por favor espera...</div>;
}
