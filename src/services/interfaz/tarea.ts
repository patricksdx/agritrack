export interface Tarea {
  id?: string;                // ID único de la tarea
  tipo?: string;               // Tipo de tarea (ej. "riego", "poda", etc.)
  descripcion?: string;        // Descripción de la tarea
  fecha_programada?: string;   // Fecha programada en formato ISO (string)
  completada?: boolean;        // Indica si la tarea fue completada
  fecha_completada?: string;   // Fecha en que se completó la tarea
  Planta?: string;             // ID relacionado a una planta
  User?: string;
  foto?: string;               // ID relacionado a un usuario
}
