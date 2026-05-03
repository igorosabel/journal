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
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

export default routes;
