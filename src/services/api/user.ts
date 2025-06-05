import axios, { AxiosError } from "axios";
import { API_URL } from "./api";

export const login = async (password: string, mail: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/usuario/login`,
      {
        usuario_email: mail,
        usuario_password: password,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      console.error("❌ Error del servidor:", axiosError.response.data);
      throw new Error(
        (axiosError.response.data as { mensaje: string })?.mensaje ||
        "Error al iniciar sesión"
      );
    }
  }
};
export const registerUser = async (userData: {
  usuario_username: string;
  usuario_nombres: string;
  usuario_apellidos: string;
  usuario_email: string;
  usuario_password: string;
}) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/usuario/registro`,
      userData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      console.error("❌ Error del servidor:", axiosError.response.data);
      throw new Error(
        (axiosError.response.data as { mensaje: string })?.mensaje ||
        "Error al registrar usuario"
      );
    }
  }
};
export const obtenerUsuario = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/usuario`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
