// Constantes de la aplicación
export const API_URL = 'http://localhost:8000/api';

export const ENDPOINTS = {
  // Autenticación
  LOGIN: '/token/',
  REFRESH_TOKEN: '/token/refresh/',
  
  // Usuarios
  USUARIOS: '/users/usuarios/',
  PERFIL: '/users/usuarios/profile/',
  CHANGE_PASSWORD: '/users/usuarios/change_password/',
  
  // Habilidades y Disciplinas
  HABILIDADES: '/users/habilidades/',
  DISCIPLINAS: '/users/disciplinas/',
  
  // Proyectos (TEMPORAL - Django backend, migrar a Firebase después)
  PROYECTOS: '/projects/proyectos/',
  MIS_PROYECTOS: '/projects/proyectos/mis_proyectos/',
  PROYECTOS_COLABORANDO: '/projects/proyectos/colaborando/',
  
  // Colaboraciones (TEMPORAL - Django backend)
  COLABORACIONES: '/projects/colaboraciones/',
  MIS_SOLICITUDES: '/projects/colaboraciones/mis_solicitudes/',
  
  // Comentarios (TEMPORAL - Django backend)
  COMENTARIOS: '/projects/comentarios/'
  
  // TODO: Migrar a Firebase/Firestore en el futuro
};

export const ESTADO_PROYECTO = {
  BORRADOR: 'Borrador',
  ACTIVO: 'Activo',
  EN_PROGRESO: 'En Progreso',
  COMPLETADO: 'Completado',
  CANCELADO: 'Cancelado'
};

export const ESTADO_COLABORACION = {
  PENDIENTE: 'Pendiente',
  ACEPTADA: 'Aceptada',
  RECHAZADA: 'Rechazada',
  CANCELADA: 'Cancelada'
};
