import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, tap,of } from 'rxjs';
import { environment } from '@environments/environments';
import { DefenseStrategy } from '@core/models/defense-strategy.model';


interface BackendStrategyResponse {
    totalScore: number;
    bulletsUsed: number;
    secondsUsed: number;
    zombiesEliminated: Array<{
        id: number;
        name: string;
        timeToShoot: number;
        bulletsRequired: number;
        score: number;
        threatLevel: number;
    }>;
}

@Injectable({ providedIn: 'root' })
export class DefenseService {
    private readonly baseUrl = `${environment.apiUrl}/defense`;

    private readonly historicalRankingState = signal<DefenseStrategy[]>([]);
    readonly historicalRankings = this.historicalRankingState.asReadonly();

    constructor(private http: HttpClient) {}

    calculateStrategy(bullets: number, seconds: number): Observable<DefenseStrategy> {
        const params = new HttpParams()
            .set('bullets', bullets)
            .set('secondsAvailable', seconds);

        return this.http.get<BackendStrategyResponse>(`${this.baseUrl}/optimal-strategy`, { params }).pipe(
            map(response => this.mapResponse(response)),
            tap(strategy => {
                this.historicalRankingState.update((current) => [strategy, ...current].slice(0, 10));
            })
        );
    }

    getHistoricalRankings(): Observable<DefenseStrategy[]> {
        return of(this.historicalRankings());
    }

    private mapResponse(response: BackendStrategyResponse): DefenseStrategy {
        return {
            totalScore: response.totalScore,
            bulletsUsed: response.bulletsUsed,
            secondsUsed: response.secondsUsed,
            zombies: response.zombiesEliminated.map((zombie) => ({
                id: zombie.id,
                name: zombie.name,
                timeToShoot: zombie.timeToShoot,
                bulletsRequired: zombie.bulletsRequired,
                score: zombie.score,
                threatLevel: zombie.threatLevel
            }))
        };
    }
}