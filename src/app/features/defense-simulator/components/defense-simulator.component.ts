import { Component } from "@angular/core";

@Component({
    selector: 'app-defense-simulator',
    standalone: true,
    template: `
        <div class="container">
            <h1>Defense Simulator</h1>
            <p>Simulador de defensa contra zombies.</p>
            <p>En esta sección podrás ingresar tus recursos disponibles (balas y tiempo) y el sistema te sugerirá la mejor estrategia para maximizar tu puntuación.</p>
            <p>¡Prepárate para sobrevivir al apocalipsis zombie!</p>
        </div>
    `
})
export class DefenseSimulatorComponent {}