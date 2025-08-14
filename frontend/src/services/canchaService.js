import { axiosInstance } from "../utils/axiosInstance";

export const obtenerCanchaInicial = async (escenario) => {
  try {
    const response = await axiosInstance.get(`cancha/una/${escenario || ""}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener cancha inicial", error);
    return null;
  }
};

export const obtenerCanchaPorEscenario = async () => {
  try {
    const response = await axiosInstance.get("cancha/escenario");
    return response.data;
  } catch (error) {
    console.error("Error al obtener cancha por escenario", error);
    return null;
  }
};

export const obtenerCanchas = async () => {
  try {
    const response = await axiosInstance.get("cancha");
    
    return response.data;
  } catch (error) {
    console.error("Error al obtener canchas", error);
    return null;
  }
};

export async function actualizarCancha(canchaId, canchaPayload) {
  try {
    const response = await axiosInstance.put(
      `cancha/${canchaId}`,
      canchaPayload
    );
    return response.data;
  } catch (error) {
    console.error("actualizarCancha error:", error);
    if (error.response) {
      const { status, data } = error.response;
      throw new Error(
        `Error al actualizar la cancha: ${status} - ${JSON.stringify(data)}`
      );
    }
    throw error;
  }
}

export async function eliminarCancha(canchaId) {
  try {
    const response = await axiosInstance.put(`cancha/eliminar/${canchaId}`, {});
    return response.data;
  } catch (error) {
    console.error("eliminarCancha error:", error);
    if (error.response) {
      const { status, data } = error.response;
      throw new Error(
        `Error al eliminar la cancha: ${status} - ${JSON.stringify(data)}`
      );
    }
    throw error;
  }
}
