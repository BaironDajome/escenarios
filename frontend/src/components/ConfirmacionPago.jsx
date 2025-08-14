// ConfirmacionPago.jsx
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { crearReservaPagada } from '../services/reservaService';

export default function ConfirmacionPago() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const datos = {
      escenario_id: searchParams.get("extra1"),
      usuario_id: searchParams.get("extra2"),
      pago: {
        x_response: searchParams.get("x_response"),
        x_payment_method: searchParams.get("x_type_payment") || searchParams.get("x_payment_method"),
        x_amount: searchParams.get("x_amount"),
        x_ref_payco: searchParams.get("x_ref_payco"),
        x_id_invoice: searchParams.get("x_id_invoice"),
      },
      datos: JSON.parse(searchParams.get("extra3")),
    };

    const enviarAlBackend = async () => {
      try {
        await crearReservaPagada(datos);
        alert("Reserva confirmada y guardada correctamente.");
        navigate("/gestion-reserva");
      } catch (error) {
        alert("Error al guardar la reserva.");
        console.error(error);
      }
    };

    if (datos.pago.x_response === "Aceptada") {
      enviarAlBackend();
    } else {
      alert("Pago no aceptado");
      navigate("/");
    }
  }, [searchParams]);

  return <p>Procesando pago, por favor espera...</p>;
}
