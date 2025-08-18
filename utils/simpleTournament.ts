import { TMDBMovie } from "@/types";

export interface BattleMatch {
    id: string;
    round: number;
    position: number;
    movie1: TMDBMovie;
    movie2: TMDBMovie;
    winner: TMDBMovie | null;
    completed: boolean;
}

export interface SimpleTournament {
    id: string;
    title: string;
    movies: TMDBMovie[];
    battles: BattleMatch[];
    currentBattleIndex: number;
    currentRound: number;
    champion: TMDBMovie | null;
    completed: boolean;
    createdAt: number;
    completedAt: number | null;
    totalBattles: number;
    battleHistory: { battle: BattleMatch; timestamp: number }[];
}

export interface TournamentSummary {
    champion: TMDBMovie;
    defeatedMovies: TMDBMovie[];
    totalBattles: number;
    duration: number; // in milliseconds
    battlePath: { opponent: TMDBMovie; round: number }[];
}

/**
 * Creates a new tournament with the given movies
 * Requires an even number of movies (minimum 4)
 */
export function createTournament(
    movies: TMDBMovie[],
    title: string = "Movie Tournament"
): SimpleTournament {
    if (movies.length < 4) {
        throw new Error("Tournament requires at least 4 movies");
    }

    if (movies.length % 2 !== 0) {
        throw new Error("Tournament requires an even number of movies");
    }

    // Shuffle movies for random matchups
    const shuffledMovies = [...movies].sort(() => Math.random() - 0.5);

    const tournamentId = generateTournamentId();
    const firstRoundBattles = createFirstRoundBattles(shuffledMovies);
    const totalBattles = calculateTotalBattles(movies.length);

    return {
        id: tournamentId,
        title,
        movies: shuffledMovies,
        battles: firstRoundBattles,
        currentBattleIndex: 0,
        currentRound: 1,
        champion: null,
        completed: false,
        createdAt: Date.now(),
        completedAt: null,
        totalBattles,
        battleHistory: []
    };
}

/**
 * Creates the first round battles by pairing adjacent movies
 */
function createFirstRoundBattles(movies: TMDBMovie[]): BattleMatch[] {
    const battles: BattleMatch[] = [];

    for (let i = 0; i < movies.length; i += 2) {
        battles.push({
            id: `battle-1-${i / 2}`,
            round: 1,
            position: i / 2,
            movie1: movies[i],
            movie2: movies[i + 1],
            winner: null,
            completed: false
        });
    }

    return battles;
}

/**
 * Calculate total number of battles needed for tournament
 * For n movies, we need n-1 battles total
 */
function calculateTotalBattles(numMovies: number): number {
    return numMovies - 1;
}

/**
 * Gets the current battle that needs to be fought
 */
export function getCurrentBattle(tournament: SimpleTournament): BattleMatch | null {
    if (tournament.completed || tournament.currentBattleIndex >= tournament.battles.length) {
        return null;
    }

    return tournament.battles[tournament.currentBattleIndex];
}

/**
 * Records the winner of the current battle and advances the tournament
 */
export function recordBattleWinner(
    tournament: SimpleTournament,
    winner: TMDBMovie
): SimpleTournament {
    const currentBattle = getCurrentBattle(tournament);

    if (!currentBattle) {
        throw new Error("No current battle to record winner for");
    }

    if (currentBattle.movie1.id !== winner.id && currentBattle.movie2.id !== winner.id) {
        throw new Error("Winner must be one of the two battling movies");
    }

    // Update the current battle
    const updatedBattles = [...tournament.battles];
    updatedBattles[tournament.currentBattleIndex] = {
        ...currentBattle,
        winner,
        completed: true
    };

    // Add to battle history
    const battleHistory = [...tournament.battleHistory, {
        battle: updatedBattles[tournament.currentBattleIndex],
        timestamp: Date.now()
    }];

    let updatedTournament: SimpleTournament = {
        ...tournament,
        battles: updatedBattles,
        currentBattleIndex: tournament.currentBattleIndex + 1,
        battleHistory
    };

    // Check if current round is complete
    if (isCurrentRoundComplete(updatedTournament)) {
        updatedTournament = advanceToNextRound(updatedTournament);
    }

    // Check if tournament is complete
    if (isTournamentComplete(updatedTournament)) {
        updatedTournament.completed = true;
        updatedTournament.champion = winner;
        updatedTournament.completedAt = Date.now();
    }

    return updatedTournament;
}

/**
 * Checks if the current round has all battles completed
 */
function isCurrentRoundComplete(tournament: SimpleTournament): boolean {
    const currentRoundBattles = tournament.battles.filter(
        battle => battle.round === tournament.currentRound
    );

    return currentRoundBattles.every(battle => battle.completed);
}

/**
 * Checks if the tournament is complete (only one movie left)
 */
function isTournamentComplete(tournament: SimpleTournament): boolean {
    if (tournament.currentBattleIndex >= tournament.battles.length) {
        return true;
    }

    // If we have exactly one winner from all battles, tournament is complete
    const completedBattles = tournament.battles.filter(battle => battle.completed);
    const allWinners = completedBattles.map(battle => battle.winner!);

    // If this was the final battle and we have a winner
    if (completedBattles.length === tournament.totalBattles && allWinners.length > 0) {
        return true;
    }

    return false;
}

/**
 * Creates the next round battles from current round winners
 */
function advanceToNextRound(tournament: SimpleTournament): SimpleTournament {
    const currentRoundBattles = tournament.battles.filter(
        battle => battle.round === tournament.currentRound && battle.completed
    );

    const winners = currentRoundBattles.map(battle => battle.winner!);

    if (winners.length === 1) {
        // Tournament is complete
        return tournament;
    }

    const nextRound = tournament.currentRound + 1;
    const nextRoundBattles: BattleMatch[] = [];

    // Handle odd number of winners (one gets a bye)
    let processedWinners = [...winners];
    if (winners.length % 2 !== 0) {
        // Last winner gets a bye to the next round
        const byeWinner = processedWinners.pop()!;

        // Create a "bye" battle that's already completed
        nextRoundBattles.push({
            id: `battle-${nextRound}-bye`,
            round: nextRound,
            position: Math.floor(processedWinners.length / 2),
            movie1: byeWinner,
            movie2: byeWinner, // Same movie (bye)
            winner: byeWinner,
            completed: true
        });
    }

    // Create battles for remaining winners
    for (let i = 0; i < processedWinners.length; i += 2) {
        nextRoundBattles.push({
            id: `battle-${nextRound}-${i / 2}`,
            round: nextRound,
            position: i / 2,
            movie1: processedWinners[i],
            movie2: processedWinners[i + 1],
            winner: null,
            completed: false
        });
    }

    return {
        ...tournament,
        battles: [...tournament.battles, ...nextRoundBattles],
        currentRound: nextRound
    };
}

/**
 * Gets tournament progress information
 */
export function getTournamentProgress(tournament: SimpleTournament) {
    const completedBattles = tournament.battles.filter(battle => battle.completed);
    const totalBattlesInTournament = tournament.totalBattles;

    return {
        completedBattles: completedBattles.length,
        totalBattles: totalBattlesInTournament,
        currentRound: tournament.currentRound,
        totalRounds: calculateTotalRounds(tournament.movies.length),
        progressPercentage: Math.round((completedBattles.length / totalBattlesInTournament) * 100)
    };
}

/**
 * Calculate total number of rounds for given number of movies
 */
function calculateTotalRounds(numMovies: number): number {
    return Math.ceil(Math.log2(numMovies));
}

/**
 * Gets the battles for a specific round
 */
export function getRoundBattles(tournament: SimpleTournament, round: number): BattleMatch[] {
    return tournament.battles.filter(battle => battle.round === round);
}

/**
 * Gets all battles up to and including the current round
 */
export function getCurrentAndPreviousRoundBattles(tournament: SimpleTournament): BattleMatch[] {
    return tournament.battles.filter(battle => battle.round <= tournament.currentRound);
}

/**
 * Creates a tournament summary for the champion display
 */
export function createTournamentSummary(tournament: SimpleTournament): TournamentSummary | null {
    if (!tournament.completed || !tournament.champion) {
        return null;
    }

    const champion = tournament.champion;
    const defeatedMovies: TMDBMovie[] = [];
    const battlePath: { opponent: TMDBMovie; round: number }[] = [];

    // Find all battles the champion participated in
    const championBattles = tournament.battles.filter(
        battle =>
            battle.completed &&
            battle.winner?.id === champion.id &&
            battle.movie1.id !== battle.movie2.id // Exclude bye battles
    );

    championBattles.forEach(battle => {
        const opponent = battle.movie1.id === champion.id ? battle.movie2 : battle.movie1;
        defeatedMovies.push(opponent);
        battlePath.push({
            opponent,
            round: battle.round
        });
    });

    const duration = tournament.completedAt! - tournament.createdAt;

    return {
        champion,
        defeatedMovies,
        totalBattles: championBattles.length,
        duration,
        battlePath
    };
}

/**
 * Saves tournament to localStorage
 */
export function saveTournament(tournament: SimpleTournament): void {
    try {
        localStorage.setItem(`tournament-${tournament.id}`, JSON.stringify(tournament));
        localStorage.setItem('current-tournament-id', tournament.id);
    } catch (error) {
        console.error('Failed to save tournament:', error);
    }
}

/**
 * Loads tournament from localStorage
 */
export function loadTournament(tournamentId?: string): SimpleTournament | null {
    try {
        const id = tournamentId || localStorage.getItem('current-tournament-id');
        if (!id) return null;

        const tournamentData = localStorage.getItem(`tournament-${id}`);
        if (!tournamentData) return null;

        return JSON.parse(tournamentData);
    } catch (error) {
        console.error('Failed to load tournament:', error);
        return null;
    }
}

/**
 * Deletes tournament from localStorage
 */
export function deleteTournament(tournamentId: string): void {
    try {
        localStorage.removeItem(`tournament-${tournamentId}`);

        // If this was the current tournament, clear that too
        const currentId = localStorage.getItem('current-tournament-id');
        if (currentId === tournamentId) {
            localStorage.removeItem('current-tournament-id');
        }
    } catch (error) {
        console.error('Failed to delete tournament:', error);
    }
}

/**
 * Generates a unique tournament ID
 */
function generateTournamentId(): string {
    return `tournament-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get tournament statistics
 */
export function getTournamentStats(tournament: SimpleTournament) {
    const completedBattles = tournament.battles.filter(battle => battle.completed);
    const timeElapsed = tournament.completedAt ?
        tournament.completedAt - tournament.createdAt :
        Date.now() - tournament.createdAt;

    return {
        battlesCompleted: completedBattles.length,
        totalBattles: tournament.totalBattles,
        timeElapsed,
        averageTimePerBattle: completedBattles.length > 0 ? timeElapsed / completedBattles.length : 0,
        currentRound: tournament.currentRound,
        totalRounds: calculateTotalRounds(tournament.movies.length)
    };
}

/**
 * Formats duration in a human-readable format
 */
export function formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
}

/**
 * Get round name for display
 */
export function getRoundName(round: number, totalRounds: number): string {
    if (round === totalRounds) {
        return "Final";
    } else if (round === totalRounds - 1) {
        return "Semifinal";
    } else if (round === totalRounds - 2) {
        return "Quarterfinal";
    } else {
        return `Round ${round}`;
    }
}

/**
 * Validates if movies can form a valid tournament
 */
export function validateTournamentMovies(movies: TMDBMovie[]): { valid: boolean; error?: string } {
    if (movies.length < 4) {
        return { valid: false, error: "Tournament requires at least 4 movies" };
    }

    if (movies.length % 2 !== 0) {
        return { valid: false, error: "Tournament requires an even number of movies" };
    }

    // Check for duplicate movies
    const uniqueIds = new Set(movies.map(movie => movie.id));
    if (uniqueIds.size !== movies.length) {
        return { valid: false, error: "All movies must be unique" };
    }

    return { valid: true };
}
