import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guards';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'simulator',
        pathMatch: 'full'
    },
    {
        path: 'simulator',
        canActivate: [authGuard],
        loadComponent: () => import('./features/defense-simulator/components/defense-simulator.component').then(m => m.DefenseSimulatorComponent)
    },
    {
        path: 'missing-api-key',
        loadComponent: () => import('./shared/components/missing-api-key.component').then(m => m.MissingApiKeyComponent)
    },
    {
        path: '**',
        redirectTo: 'simulator'
    }
];
