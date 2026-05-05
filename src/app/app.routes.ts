import { Routes } from '@angular/router';
import isLoggedGuardFn from '@guard/auth.guard.fn';
import Login from '@modules/login/login';

const routes: Routes = [
  { path: '', component: Login },
  {
    path: 'register',
    loadComponent: () => import('@modules/register/register'),
  },
  {
    path: 'home',
    loadComponent: () => import('@modules/home/home'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'entry/:id',
    loadComponent: () => import('@modules/entry/entry'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'edit-entry/:id',
    loadComponent: () => import('@modules/edit-entry/edit-entry'),
    canActivate: [isLoggedGuardFn],
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

export default routes;
