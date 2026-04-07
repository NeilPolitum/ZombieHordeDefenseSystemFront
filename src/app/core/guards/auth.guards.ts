import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { environment } from "@environments/environments";

export const authGuard: CanActivateFn = () => {
    const hasApiKey = !!environment.apiKey?.trim();
    if (hasApiKey) {
        return true;
    }

    const router = inject(Router);
    return router.createUrlTree(['/missing-api-key']);
}