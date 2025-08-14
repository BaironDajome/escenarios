import { axiosInstance } from "../utils/axiosInstance";

export const ObtenerEscenarios = async () => {
  try {
    const response = await axiosInstance.get("escenario");
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const ObtnerReservas = async () => {
  try {
    const response = await axiosInstance.get("reservas");
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const ObtnerReservasPorEscenario = async () => {
  try {
    const response = await axiosInstance.get("reservas/escenario");
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const ObtnerReservasPorIdCancha = async (canchaId) => {
  try {
    const response = await axiosInstance.get(`reservas/cancha/${canchaId}`);
    return response.data;
  } catch (error) {
    console.error("Error en ObtnerReservasPorIdCancha:", error);
    return [];
  }
};

export async function crearReserva(reservaPayload) {
  try {
    const response = await axiosInstance.post("reservas", reservaPayload);
    return response.data;
  } catch (error) {
    console.error("Error en crearReserva:", error);
    throw error;
  }
}

export async function crearReservaPagada(reservaPayload) {
  try {
    const response = await axiosInstance.post("pago", reservaPayload);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function actualizarReserva(eventId, reservaPayload) {
  try {
    const response = await axiosInstance.put(
      `reservas/${eventId}`,
      reservaPayload
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function PagoReserva(reservaPayload) {
  try {
    const response = await axiosInstance.post("reservas", reservaPayload);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const ObtnerConteoPendientes = async () => {
  try {
    const response = await axiosInstance.get("reservas/pendientes/contador");
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
