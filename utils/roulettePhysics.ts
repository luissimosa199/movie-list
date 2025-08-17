import { TMDBMovie } from "@/types";

export interface SpinConfig {
    force: number; // 0-100 based on hold duration
    friction: number; // deceleration rate
    minSpins: number; // minimum rotations
}

export interface WheelSegment {
    movie: TMDBMovie;
    startAngle: number;
    endAngle: number;
    color: string;
}

export interface SpinResult {
    duration: number; // in milliseconds
    finalAngle: number; // in degrees
    rotations: number; // number of full rotations
}

// Color palette for wheel segments
const SEGMENT_COLORS = [
    "#ef4444", // red-500
    "#3b82f6", // blue-500
    "#10b981", // emerald-500
    "#f59e0b", // amber-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#06b6d4", // cyan-500
    "#84cc16", // lime-500
    "#f97316", // orange-500
    "#6366f1", // indigo-500
    "#14b8a6", // teal-500
    "#eab308", // yellow-500
];

/**
 * Calculate spin force based on button hold duration
 * Uses exponential curve for satisfying charge feeling
 */
export function calculateSpinForce(holdDuration: number): number {
    // Convert milliseconds to seconds
    const seconds = holdDuration / 1000;

    // Clamp between 0.5 and 5 seconds
    const clampedSeconds = Math.max(0.5, Math.min(5, seconds));

    // Exponential curve: force = 20 + 80 * (t/5)^1.5
    // This gives satisfying acceleration as user holds longer
    const normalizedTime = clampedSeconds / 5; // 0 to 1
    const force = 20 + 80 * Math.pow(normalizedTime, 1.5);

    return Math.round(force);
}

/**
 * Calculate spin duration based on force applied
 * Higher force = longer spin time
 */
export function calculateSpinDuration(force: number): number {
    // Base duration between 2-8 seconds based on force
    const minDuration = 2000; // 2 seconds
    const maxDuration = 8000; // 8 seconds

    // Linear interpolation with slight curve
    const normalizedForce = force / 100; // 0 to 1
    const duration = minDuration + (maxDuration - minDuration) * normalizedForce;

    return Math.round(duration);
}

/**
 * Generate wheel segments with equal spacing and colors
 */
export function generateWheelSegments(movies: TMDBMovie[]): WheelSegment[] {
    if (movies.length === 0) return [];

    const segmentAngle = 360 / movies.length;

    return movies.map((movie, index) => {
        const startAngle = index * segmentAngle;
        const endAngle = (index + 1) * segmentAngle;
        const color = SEGMENT_COLORS[index % SEGMENT_COLORS.length];

        return {
            movie,
            startAngle,
            endAngle,
            color,
        };
    });
}

/**
 * Calculate physics-based spin with realistic deceleration
 */
export function calculateSpinPhysics(config: SpinConfig): SpinResult {
    const { force, friction, minSpins } = config;

    // Initial velocity based on force (radians per second)
    const initialVelocity = (force / 100) * 20 + 5; // 5-25 rad/s

    // Calculate how long it takes to decelerate to zero
    const decelerationTime = initialVelocity / friction;

    // Calculate total angle traveled during deceleration
    const angleRadians = (initialVelocity * decelerationTime) / 2;

    // Convert to degrees and add minimum spins
    let totalAngle = (angleRadians * 180) / Math.PI;
    const minAngle = minSpins * 360;

    if (totalAngle < minAngle) {
        totalAngle = minAngle + (totalAngle % 360);
    }

    // Final angle is the remainder after full rotations
    const finalAngle = totalAngle % 360;
    const rotations = Math.floor(totalAngle / 360);

    // Duration in milliseconds
    const duration = decelerationTime * 1000;

    return {
        duration: Math.round(duration),
        finalAngle: Math.round(finalAngle),
        rotations,
    };
}

/**
 * Determine winning movie based on final wheel position
 * Wheel rotates clockwise, pointer is at top (0 degrees)
 */
export function determineWinner(
    finalAngle: number,
    segments: WheelSegment[]
): TMDBMovie | null {
    if (segments.length === 0) return null;

    // Normalize angle to 0-360 range
    const normalizedAngle = ((finalAngle % 360) + 360) % 360;

    // Find which segment the pointer (at 0 degrees) lands on
    // Since wheel rotates clockwise, we need to check which segment
    // contains the adjusted angle
    const pointerAngle = (360 - normalizedAngle) % 360;

    for (const segment of segments) {
        if (pointerAngle >= segment.startAngle && pointerAngle < segment.endAngle) {
            return segment.movie;
        }
    }

    // Fallback to first movie if no match found
    return segments[0]?.movie || null;
}

/**
 * Generate easing function for CSS animation
 * Creates realistic deceleration curve
 */
export function generateEasingCurve(duration: number): string {
    // Custom cubic-bezier for realistic physics
    // Starts fast, gradually slows down with slight bounce at end
    return "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
}

/**
 * Create default spin configuration
 */
export function getDefaultSpinConfig(): SpinConfig {
    return {
        force: 50,
        friction: 2, // rad/s²
        minSpins: 3, // minimum 3 full rotations
    };
}

/**
 * Validate that wheel has enough movies for fair spinning
 */
export function validateWheelMovies(movies: TMDBMovie[]): {
    isValid: boolean;
    message?: string;
} {
    if (movies.length < 2) {
        return {
            isValid: false,
            message: "Add at least 2 movies to spin the wheel",
        };
    }

    if (movies.length > 12) {
        return {
            isValid: false,
            message: "Maximum 12 movies allowed for optimal wheel visibility",
        };
    }

    return { isValid: true };
}

/**
 * Calculate optimal wheel size based on number of movies
 */
export function calculateWheelSize(movieCount: number): {
    diameter: number;
    fontSize: string;
    posterSize: number;
} {
    // Base sizes that scale with movie count
    const baseDiameter = 300;
    const maxDiameter = 400;

    // More movies = larger wheel for better readability
    const scaleFactor = Math.min(1 + (movieCount - 2) * 0.1, 1.33);
    const diameter = Math.min(baseDiameter * scaleFactor, maxDiameter);

    // Font size scales inversely with movie count
    const baseFontSize = movieCount <= 4 ? 14 : movieCount <= 8 ? 12 : 10;
    const fontSize = `${baseFontSize}px`;

    // Poster size based on segment size
    const segmentAngle = 360 / movieCount;
    const posterSize = segmentAngle > 60 ? 40 : segmentAngle > 30 ? 30 : 20;

    return {
        diameter: Math.round(diameter),
        fontSize,
        posterSize,
    };
}
