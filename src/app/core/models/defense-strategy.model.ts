import { Zombie } from './zombie.model';

export interface DefenseStrategy {
    totalScore: number;
    bulletsUsed: number;
    secondsUsed: number;
    zombies: Zombie[];
}
