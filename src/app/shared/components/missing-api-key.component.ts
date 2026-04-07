import { Component } from "@angular/core";

@Component({
    selector: 'app-missing-api-key',
    standalone: true,
    template: `
        <div class="container">
            <h1>API Key Missing</h1>
            <p>No se detectó la clave API en la configuración del entorno.</p>
            <p>Por favor, asegúrate de configurar la clave API en el archivo <code>environments/environment.ts</code>.</p>
        </div>
    `
})
export class MissingApiKeyComponent {}