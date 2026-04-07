import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'app-stat-badge',
    standalone: true,
    templateUrl: './stat-badge.component.html',
    styleUrl: './stat-badge.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatBadgeComponent {
    @Input({ required: true }) label!: string;
    @Input({ required: true }) value!: string | number;
}
