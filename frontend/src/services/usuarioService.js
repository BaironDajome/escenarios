import { axiosInstance } from "../utils/axiosInstance";

export const InicioSesion = async (data) => {
  try {
    const response = await axiosInstance.post("auth/login", data);
    return response.data;
  } catch (error) {
    console.error("Error en inicio de sesión:", error);
    return null;
  }
};

export async function crearUsuario(reservaPayload) {
  try {
    const response = await axiosInstance.post("usuario/registro", reservaPayload);
    return response.data;
  } catch (error) {
    console.error("Error al guardar el usuario:", error);
    throw error;
  }
}

export async function UsuarioActualizado() {
  try {
    const response = await axiosInstance.get("usuario/me");
    return response.data;
  } catch (error) {
    console.error("Error obteniendo usuario actualizado:", error);
    return null;
  }
}
