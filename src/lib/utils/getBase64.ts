export const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1]; // 👈 Solo la parte base64
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};
