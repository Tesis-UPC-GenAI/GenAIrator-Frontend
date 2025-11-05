import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Rutas públicas
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },

  // Rutas protegidas (requieren autenticación)
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'projects',
    loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'import-design-system',
    loadComponent: () => import('./features/import-design-system/import-design-system.component').then(m => m.ImportDesignSystemComponent),
    canActivate: [authGuard]
  },
  {
    path: 'generate',
    loadComponent: () => import('./features/generate/generate.component').then(m => m.GenerateComponent),
    canActivate: [authGuard]
  },
  {
    path: 'processing',
    loadComponent: () => import('./features/processing/processing.component').then(m => m.ProcessingComponent),
    canActivate: [authGuard]
  },
  {
    path: 'results',
    loadComponent: () => import('./features/results/results.component').then(m => m.ResultsComponent),
    canActivate: [authGuard]
  },

  // Ruta 404
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
