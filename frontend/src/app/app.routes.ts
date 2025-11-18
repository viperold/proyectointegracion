// Rutas de la aplicación
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/proyectos',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () => import('./features/auth/registro/registro.component').then(m => m.RegistroComponent)
  },
  {
    path: 'proyectos',
    loadComponent: () => import('./features/proyectos/proyecto-list/proyecto-list.component').then(m => m.ProyectoListComponent)
  },
  {
    path: 'proyectos/nuevo',
    loadComponent: () => import('./features/proyectos/proyecto-form/proyecto-form.component').then(m => m.ProyectoFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'proyectos/:id',
    loadComponent: () => import('./features/proyectos/proyecto-detail/proyecto-detail.component').then(m => m.ProyectoDetailComponent)
  },
  {
    path: 'proyectos/:id/editar',
    loadComponent: () => import('./features/proyectos/proyecto-form/proyecto-form.component').then(m => m.ProyectoFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'perfil',
    loadComponent: () => import('./features/perfil/perfil.component').then(m => m.PerfilComponent),
    canActivate: [authGuard]
  },
  {
    path: 'mis-proyectos',
    loadComponent: () => import('./features/proyectos/mis-proyectos/mis-proyectos.component').then(m => m.MisProyectosComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/proyectos'
  }
];
