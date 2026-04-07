import { HttpInterceptorFn } from "@angular/common/http";
import { environment } from "@environments/environments";

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
    const apiKey = environment.apiKey?.trim();
    if (!apiKey) {
        return next(req);
    }

    const clonedRequest = req.clone({
        setHeaders: {
            'X-API-KEY': apiKey
        }
    });
    
    return next(clonedRequest);
}