import { type Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/tokens-smoke').then((m) => m.TokensSmoke),
  },
];
