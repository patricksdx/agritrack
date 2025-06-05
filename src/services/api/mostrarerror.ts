import { AxiosError } from "axios";

export const mostrarErrorAxios = (
  error: unknown,
  mensajePorDefecto: string = "Ha ocurrido un error"
): string => {
  const axiosError = error as AxiosError;

  if (axiosError.response?.data) {
    const errorData = axiosError.response.data;
    console.error("Datos del error:", errorData);

    if (typeof errorData === "object" && errorData !== null) {
      if ("message" in errorData && typeof errorData.message === "string")
        return errorData.message;
      if ("mensaje" in errorData && typeof errorData.mensaje === "string")
        return errorData.mensaje;
    }
  }

  return mensajePorDefecto;
};
