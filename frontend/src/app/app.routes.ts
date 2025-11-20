// Rutas de la aplicación
import { Routes } from '@angular/router';

// Guards
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { estudianteGuard } from './core/guards/estudiante.guard';
import { profesorGuard } from './core/guards/profesor.guard';

export const routes: Routes = [

  // 🔵 Redirección inicial
  {
    path: '',
    redirectTo: '/proyectos',
    pathMatch: 'full'
  },

  // 🔑 Login
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent)
  },

  // 📝 Registro
  {
    path: 'registro',
    loadComponent: () =>
      import('./features/auth/registro/registro.component')
        .then(m => m.RegistroComponent)
  },

  // 📌 LISTA DE PROYECTOS (cualquier usuario autenticado)
  {
    path: 'proyectos',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/proyectos/proyecto-list/proyecto-list.component')
        .then(m => m.ProyectoListComponent)
  },

  // 📄 DETALLE PROYECTO (Profesor + Estudiante)
  {
    path: 'proyectos/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/proyectos/proyecto-detail/proyecto-detail.component')
        .then(m => m.ProyectoDetailComponent)
  },

  // 🟢 POSTULAR (solo ESTUDIANTE)
  {
    path: 'proyectos/:id/postular',
    canActivate: [estudianteGuard],
    loadComponent: () =>
      import('./features/proyectos/proyecto-detail/proyecto-detail.component')
        .then(m => m.ProyectoDetailComponent)
  },

  // 📝 CREAR PROYECTO (solo usuarios autenticados, estudiantes y profesores)
  {
    path: 'proyectos/nuevo',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/proyectos/proyecto-form/proyecto-form.component')
        .then(m => m.ProyectoFormComponent)
  },

  // ✏️ EDITAR PROYECTO (solo usuarios autenticados)
  {
    path: 'proyectos/:id/editar',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/proyectos/proyecto-form/proyecto-form.component')
        .then(m => m.ProyectoFormComponent)
  },

  // 🙍 PERFIL (solo autenticado)
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/perfil/perfil.component')
        .then(m => m.PerfilComponent)
  },

  // 📚 MIS PROYECTOS (solo autenticado)
  {
    path: 'mis-proyectos',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/proyectos/mis-proyectos/mis-proyectos.component')
        .then(m => m.MisProyectosComponent)
  },

  // 🟣 PANEL DE ADMINISTRADOR (solo ADMINISTRADOR)
  {
    path: 'admin/usuarios',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/usuarios/usuarios.component')
        .then(m => m.UsuariosComponent)
  },

  // ❗ Rutas no encontradas
  {
    path: '**',
    redirectTo: '/proyectos'
  }

];
