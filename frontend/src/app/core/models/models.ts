// Modelos de datos
export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  avatar?: string;
  bio?: string;
  carrera: string;
  disciplina?: Disciplina;
  semestre: number;
  habilidades: Habilidad[];
  date_joined: string;
  is_active: boolean;
}

export interface Disciplina {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Habilidad {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Proyecto {
  id: number;
  titulo: string;
  descripcion: string;
  objetivo: string;
  imagen?: string;
  creador: Usuario;
  disciplinas_requeridas: Disciplina[];
  habilidades_requeridas: Habilidad[];
  estado: 'BORRADOR' | 'ACTIVO' | 'EN_PROGRESO' | 'COMPLETADO' | 'CANCELADO';
  colaboradores_necesarios: number;
  colaboradores_actuales: number;
  tiene_vacantes: boolean;
  fecha_inicio?: string;
  fecha_fin?: string;
  total_comentarios: number;
  created_at: string;
  updated_at: string;
}

export interface Colaboracion {
  id: number;
  proyecto: Proyecto;
  usuario: Usuario;
  estado: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'CANCELADA';
  rol: 'COLABORADOR' | 'LÍDER';
  mensaje: string;
  respuesta?: string;
  created_at: string;
  updated_at: string;
}

export interface Comentario {
  id: number;
  proyecto: number;
  usuario: Usuario;
  contenido: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegistroRequest {
  email: string;
  password: string;
  password2: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  carrera: string;
  disciplina?: number;
  semestre: number;
  bio?: string;
}
