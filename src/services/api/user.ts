import { pb } from "../pocketbase";

export const login = async (password: string, mail: string) => {
  try {
    const authData = await pb
      .collection("users")
      .authWithPassword(mail, password);
    return authData;
  } catch (error) {
    console.error("❌ Error del servidor:", error);
  }
};
export const registerUser = async (
  email: string,
  nombres: string,
  apellidos: string,
  password: string,
  passwordConfirm: string
) => {
  const userData = {
    email,
    nombres,
    apellidos,
    password,
    passwordConfirm,
  };
  try {
    const record = await pb.collection("users").create(userData);
    return record;
  } catch (error) {
    console.log("❌ Error del servidor:", error);
  }
};
