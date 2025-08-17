/**
 * Animation utilities for the Movie Roulette wheel
 * Handles CSS animations, particle effects, and celebration animations
 */

export interface ConfettiParticle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    rotation: number;
    rotationSpeed: number;
}

export interface AnimationConfig {
    duration: number;
    easing: string;
    rotations: number;
}

/**
 * Generate CSS keyframes for wheel spinning animation
 */
export function generateSpinKeyframes(
    totalRotation: number,
    duration: number
): string {
    const keyframeName = `spin-${Date.now()}`;

    // Create smooth deceleration with multiple keyframes
    const keyframes = `
    @keyframes ${keyframeName} {
      0% {
        transform: rotate(0deg);
      }
      20% {
        transform: rotate(${totalRotation * 0.4}deg);
      }
      40% {
        transform: rotate(${totalRotation * 0.7}deg);
      }
      60% {
        transform: rotate(${totalRotation * 0.85}deg);
      }
      80% {
        transform: rotate(${totalRotation * 0.95}deg);
      }
      100% {
        transform: rotate(${totalRotation}deg);
      }
    }
  `;

    // Inject keyframes into document
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);

    // Clean up after animation
    setTimeout(() => {
        document.head.removeChild(style);
    }, duration + 1000);

    return keyframeName;
}

/**
 * Apply spin animation to wheel element
 */
export function animateWheelSpin(
    element: HTMLElement,
    totalRotation: number,
    duration: number,
    onComplete?: () => void
): void {
    if (!element) return;

    const keyframeName = generateSpinKeyframes(totalRotation, duration);

    // Apply animation
    element.style.animation = `${keyframeName} ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;

    // Handle completion
    const handleAnimationEnd = () => {
        element.removeEventListener('animationend', handleAnimationEnd);
        if (onComplete) onComplete();
    };

    element.addEventListener('animationend', handleAnimationEnd);
}

/**
 * Generate confetti particles for celebration
 */
export function generateConfetti(count: number = 50): ConfettiParticle[] {
    const particles: ConfettiParticle[] = [];
    const colors = [
        '#ef4444', '#3b82f6', '#10b981', '#f59e0b',
        '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
    ];

    for (let i = 0; i < count; i++) {
        particles.push({
            id: i,
            x: Math.random() * window.innerWidth,
            y: -10,
            vx: (Math.random() - 0.5) * 10,
            vy: Math.random() * 5 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
        });
    }

    return particles;
}

/**
 * Animate confetti particles
 */
export function animateConfetti(
    particles: ConfettiParticle[],
    onUpdate: (particles: ConfettiParticle[]) => void,
    duration: number = 3000
): void {
    const startTime = Date.now();
    const gravity = 0.3;
    const friction = 0.99;

    function updateParticles() {
        const elapsed = Date.now() - startTime;

        if (elapsed > duration) {
            onUpdate([]);
            return;
        }

        particles.forEach(particle => {
            // Apply physics
            particle.vy += gravity;
            particle.vx *= friction;
            particle.vy *= friction;

            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Update rotation
            particle.rotation += particle.rotationSpeed;

            // Remove particles that fall off screen
            if (particle.y > window.innerHeight + 50) {
                particle.y = -10;
                particle.x = Math.random() * window.innerWidth;
                particle.vy = Math.random() * 5 + 5;
            }
        });

        onUpdate([...particles]);
        requestAnimationFrame(updateParticles);
    }

    requestAnimationFrame(updateParticles);
}

/**
 * Create winner highlight animation
 */
export function animateWinnerHighlight(element: HTMLElement): void {
    if (!element) return;

    // Add winner highlight class
    element.classList.add('winner-highlight');

    // Create pulsing animation
    const keyframes = `
    @keyframes winnerPulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 0 40px rgba(255, 215, 0, 1);
      }
    }
  `;

    // Inject keyframes
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);

    // Apply animation
    element.style.animation = 'winnerPulse 1s ease-in-out infinite';
    element.style.border = '3px solid #ffd700';
    element.style.borderRadius = '8px';

    // Clean up after 5 seconds
    setTimeout(() => {
        element.classList.remove('winner-highlight');
        element.style.animation = '';
        element.style.border = '';
        element.style.boxShadow = '';
        document.head.removeChild(style);
    }, 5000);
}

/**
 * Create hold-to-charge button animation
 */
export function animateChargeButton(
    element: HTMLElement,
    chargeLevel: number
): void {
    if (!element) return;

    // Scale and color based on charge level
    const scale = 1 + (chargeLevel / 100) * 0.2; // 1.0 to 1.2
    const intensity = chargeLevel / 100;

    // Color progression from purple to pink to yellow
    let color;
    if (intensity < 0.5) {
        // Purple to pink
        const t = intensity * 2;
        color = `rgb(${147 + (236 - 147) * t}, ${92 + (72 - 92) * t}, ${246 + (153 - 246) * t})`;
    } else {
        // Pink to yellow
        const t = (intensity - 0.5) * 2;
        color = `rgb(${236 + (255 - 236) * t}, ${72 + (215 - 72) * t}, ${153 + (0 - 153) * t})`;
    }

    element.style.transform = `scale(${scale})`;
    element.style.backgroundColor = color;
    element.style.boxShadow = `0 0 ${20 + intensity * 30}px ${color}`;
}

/**
 * Reset button animation to default state
 */
export function resetChargeButton(element: HTMLElement): void {
    if (!element) return;

    element.style.transform = '';
    element.style.backgroundColor = '';
    element.style.boxShadow = '';
}

/**
 * Create ripple effect animation
 */
export function createRippleEffect(
    element: HTMLElement,
    x: number,
    y: number,
    color: string = 'rgba(255, 255, 255, 0.6)'
): void {
    const ripple = document.createElement('div');
    const size = Math.max(element.offsetWidth, element.offsetHeight);

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x - size / 2 + 'px';
    ripple.style.top = y - size / 2 + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.backgroundColor = color;
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';

    // Add ripple keyframes if not already present
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
        document.head.appendChild(style);
    }

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

/**
 * Animate movie poster entrance in wheel segment
 */
export function animateMovieEntrance(
    element: HTMLElement,
    delay: number = 0
): void {
    if (!element) return;

    element.style.opacity = '0';
    element.style.transform = 'scale(0.5) rotate(180deg)';
    element.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'scale(1) rotate(0deg)';
    }, delay);
}

/**
 * Create loading spinner for movie search
 */
export function createLoadingSpinner(): HTMLElement {
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.innerHTML = `
    <div class="spinner-ring"></div>
  `;

    // Add spinner styles if not already present
    if (!document.querySelector('#spinner-styles')) {
        const style = document.createElement('style');
        style.id = 'spinner-styles';
        style.textContent = `
      .loading-spinner {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
      }
      .spinner-ring {
        width: 24px;
        height: 24px;
        border: 3px solid rgba(147, 92, 246, 0.3);
        border-top: 3px solid #9333ea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
        document.head.appendChild(style);
    }

    return spinner;
}

/**
 * Animate movie removal from wheel
 */
export function animateMovieRemoval(
    element: HTMLElement,
    onComplete?: () => void
): void {
    if (!element) return;

    element.style.transition = 'all 0.3s ease-out';
    element.style.transform = 'scale(0) rotate(90deg)';
    element.style.opacity = '0';

    setTimeout(() => {
        if (onComplete) onComplete();
    }, 300);
}

/**
 * Create celebration text animation
 */
export function animateCelebrationText(
    element: HTMLElement,
    text: string
): void {
    if (!element) return;

    element.textContent = text;
    element.style.fontSize = '2rem';
    element.style.fontWeight = 'bold';
    element.style.color = '#ffd700';
    element.style.textAlign = 'center';
    element.style.animation = 'celebration 2s ease-out forwards';

    // Add celebration keyframes
    if (!document.querySelector('#celebration-styles')) {
        const style = document.createElement('style');
        style.id = 'celebration-styles';
        style.textContent = `
      @keyframes celebration {
        0% {
          transform: scale(0) rotate(-180deg);
          opacity: 0;
        }
        50% {
          transform: scale(1.2) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: scale(1) rotate(0deg);
          opacity: 1;
        }
      }
    `;
        document.head.appendChild(style);
    }
}

/**
 * Clean up all animation styles
 */
export function cleanupAnimationStyles(): void {
    const stylesToRemove = [
        '#ripple-styles',
        '#spinner-styles',
        '#celebration-styles'
    ];

    stylesToRemove.forEach(selector => {
        const style = document.querySelector(selector);
        if (style) {
            document.head.removeChild(style);
        }
    });
}
