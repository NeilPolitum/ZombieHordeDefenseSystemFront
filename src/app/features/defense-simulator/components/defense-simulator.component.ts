import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { DefenseStrategy } from '@core/models';
import { StatBadgeComponent } from '@shared/components/stat-badge/stat-badge.component';
import { ZombieCardComponent } from '@shared/components/zombie-card/zombie-card.component';

import { DefenseService } from '../services/defense.service';

@Component({
    selector: 'app-defense-simulator',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ZombieCardComponent, StatBadgeComponent],
    templateUrl: './defense-simulator.component.html',
    styleUrl: './defense-simulator.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefenseSimulatorComponent {
    private readonly defenseService = inject(DefenseService);
    private readonly fb = inject(FormBuilder);

    readonly form = this.fb.nonNullable.group({
        bullets: [30, [Validators.required, Validators.min(1)]],
        secondsAvailable: [30, [Validators.required, Validators.min(1)]]
    });

    readonly simulationResult = signal<DefenseStrategy | null>(null);
    readonly isLoading = signal(false);
    readonly errorMessage = signal<string | null>(null);
    readonly historicalRankings = signal<DefenseStrategy[]>([]);

    readonly hasResults = computed(() => this.simulationResult() !== null);

    trackById(_: number, item: { id: number }): number {
        return item.id;
    }

    trackByIndex(index: number): number {
        return index;
    }

    onCalculate(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.errorMessage.set(null);
        this.isLoading.set(true);

        const { bullets, secondsAvailable } = this.form.getRawValue();

        this.defenseService.calculateStrategy(bullets, secondsAvailable)
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
                next: (response) => {
                    this.simulationResult.set(response);
                    this.loadHistoricalRankings();
                },
                error: (error: HttpErrorResponse) => {
                    this.errorMessage.set(this.buildErrorMessage(error));
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