export interface Planta {
  id: string;
  nombre: string;
  descripcion?: string;
  ubicacion?: string;
  latitud?: number;
  longitud?: number;
  adquisicion?: string;
  foto?: string;
  humedad?: number;
  humedad_clima?: number;
  fecha_riego?: string;
  luz?: number;
  temparatura?: number;
  Users: string;
  created?: string;
  updated?: string;
  tipo?: string;
}
