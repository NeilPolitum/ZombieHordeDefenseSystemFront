import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Zombie } from '@core/models';

@Component({
    selector: 'app-zombie-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './zombie-card.component.html',
    styleUrl: './zombie-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZombieCardComponent {
    @Input({ required: true }) zombie!: Zombie;

    readonly threatScale = Array.from({ length: 10 }, (_, index) => index + 1);

    isThreatActive(level: number): boolean {
        return level <= this.clampedThreatLevel;
    }

    get clampedThreatLevel(): number {
        return Math.max(0, Math.min(this.zombie?.threatLevel ?? 0, 10));
    }

    get threatStatus(): string {
        if (this.clampedThreatLevel >= 8) {
            return 'critical';
        }

        if (this.clampedThreatLevel >= 5) {
            return 'elevated';
        }

        return 'contained';
    }
}