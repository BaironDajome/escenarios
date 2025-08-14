import { useAuth } from "./AuthContext";

export default function PagoBancolombia() {
  const { usuario } = useAuth();
  const handlePago = () => {
    const handler = window.ePayco.checkout.configure({
      key: "f102927facb1d03e880f81126e8b69e4",
      test: true, // true para modo prueba
    });

    const data = {
      name: "Pago de reserva",
      description: "Reserva de cancha deportiva",
      invoice: `reserva-${Date.now()}`,
      currency: "cop",
      amount: "100000", // $100.000 COP
      tax_base: "0",
      tax: "0",
      country: "CO",
      lang: "es",
      external: "false",
      response: "http://localhost:5173/gestion-reserva", // o tu URL real
      usuario_id: usuario?.id || '',
    };

    handler.open(data);
  };

  return (
    <button onClick={handlePago} className="btn btn-primary">
      Pagar con PSE
    </button>
  );
}
