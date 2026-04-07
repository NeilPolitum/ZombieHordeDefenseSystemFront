import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DefenseStrategy } from '@core/models';
import { DefenseService } from '../services/defense.service';

@Component({
    selector: 'app-defense-simulator',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="container">
            <section>
                <h1>Defense Simulator</h1>
                <p>
                    Ingresa tus recursos disponibles (balas y tiempo) para calcular la mejor estrategia contra la horda.
                </p>

                <form (ngSubmit)="onCalculate()" class="form-grid">
                    <label for="bulletsInput">Bullets</label>
                    <input
                        id="bulletsInput"
                        type="number"
                        name="bullets"
                        min="1"
                        [(ngModel)]="bullets"
                        required
                    />

                    <label for="secondsInput">Seconds Available</label>
                    <input
                        id="secondsInput"
                        type="number"
                        name="seconds"
                        min="1"
                        [(ngModel)]="seconds"
                        required
                    />

                    <button type="submit" [disabled]="isLoading() || bullets < 1 || seconds < 1">
                        {{ isLoading() ? 'Calculando...' : 'Calcular estrategia' }}
                    </button>
                </form>

                <p *ngIf="errorMessage()" class="error">{{ errorMessage() }}</p>
            </section>

            <section *ngIf="hasResults()">
                <article class="result-card" *ngIf="simulationResult() as strategy">
                    <h2>Resultado óptimo</h2>
                    <p><strong>Total Score:</strong> {{ strategy.totalScore }}</p>
                    <p><strong>Bullets Used:</strong> {{ strategy.bulletsUsed }}</p>
                    <p><strong>Seconds Used:</strong> {{ strategy.secondsUsed }}</p>

                    <h3>Zombies eliminados</h3>
                    <ul *ngIf="strategy.zombies.length > 0; else emptyState">
                        <li *ngFor="let zombie of strategy.zombies">
                            {{ zombie.name }} (ID: {{ zombie.id }}) - Score: {{ zombie.score }}, Threat: {{ zombie.threatLevel }},
                            Bullets: {{ zombie.bulletsRequired }}, Time: {{ zombie.timeToShoot }}
                        </li>
                    </ul>
                </article>
            </section>

            <section *ngIf="historicalRankings().length > 0">
                <h2>Historial</h2>
                <article *ngFor="let ranking of historicalRankings(); let index = index">
                    <h3>Simulación #{{ index + 1 }}</h3>
                    <p>Score: {{ ranking.totalScore }} | Bullets: {{ ranking.bulletsUsed }} | Seconds: {{ ranking.secondsUsed }}</p>
                </article>
            </section>

            <ng-template #emptyState>
                <p>No se pudieron eliminar zombies con los recursos disponibles.</p>
            </ng-template>
        </div>
    `
})
export class DefenseSimulatorComponent {
    private readonly defenseService = inject(DefenseService);

    bullets = 10;
    seconds = 8;

    simulationResult = signal<DefenseStrategy | null>(null);
    isLoading = signal<boolean>(false);
    errorMessage = signal<string | null>(null);
    historicalRankings = signal<DefenseStrategy[]>([]);

    hasResults = computed(() => this.simulationResult() !== null);

    onCalculate(): void {
        this.errorMessage.set(null);
        this.isLoading.set(true);

        this.defenseService.calculateStrategy(this.bullets, this.seconds).subscribe({
            next: (response) => {
                this.simulationResult.set(response);
                this.loadHistoricalRankings();
            },
            error: (error: HttpErrorResponse) => {
                this.errorMessage.set(this.buildErrorMessage(error));
                this.isLoading.set(false);
            },
            complete: () => {
                this.isLoading.set(false);
            }
        });
    }

    private loadHistoricalRankings(): void {
        this.defenseService.getHistoricalRankings().subscribe((rankings) => {
            this.historicalRankings.set(rankings);
        });
    }

    private buildErrorMessage(error: HttpErrorResponse): string {
        if (error.status === 0) {
            return 'No se pudo conectar con el backend. Verifica que el API esté ejecutándose en http://localhost:5035.';
        }

        if (typeof error.error === 'string' && error.error.trim().length > 0) {
            return `Error ${error.status}: ${error.error}`;
        }

        if (error.error?.title) {
            return `Error ${error.status}: ${error.error.title}`;
        }

        return `Error ${error.status}: no fue posible calcular la estrategia.`;
    }
}