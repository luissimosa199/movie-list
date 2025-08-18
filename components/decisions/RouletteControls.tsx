"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { TMDBMovie } from "@/types";
import {
  calculateSpinForce,
  calculateSpinPhysics,
  getDefaultSpinConfig,
  validateWheelMovies,
} from "@/utils/roulettePhysics";
import {
  animateChargeButton,
  resetChargeButton,
  createRippleEffect,
} from "@/utils/rouletteAnimations";

interface RouletteControlsProps {
  movies: TMDBMovie[];
  isSpinning: boolean;
  onSpin?: (totalRotation: number, duration: number) => void;
  onSpinStart?: () => void;
  disabled?: boolean;
  className?: string;
}

interface SpinSettings {
  speed: "slow" | "normal" | "fast";
  sound: boolean;
}

const RouletteControls: React.FC<RouletteControlsProps> = ({
  movies,
  isSpinning,
  onSpin,
  onSpinStart,
  disabled = false,
  className = "",
}) => {
  const [isCharging, setIsCharging] = useState(false);
  const [chargeLevel, setChargeLevel] = useState(0);
  const [holdStartTime, setHoldStartTime] = useState<number | null>(null);
  const [settings, setSettings] = useState<SpinSettings>({
    speed: "normal",
    sound: true,
  });
  const [showSettings, setShowSettings] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const chargeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Validation
  const validation = validateWheelMovies(movies);
  const canSpin = validation.isValid && !isSpinning && !disabled;

  // Speed multipliers - memoized to prevent recreation on every render
  const speedMultipliers = useMemo(
    () => ({
      slow: 0.7,
      normal: 1.0,
      fast: 1.4,
    }),
    []
  );

  // Clean up intervals on unmount
  useEffect(() => {
    const chargeInterval = chargeIntervalRef.current;
    const touchTimeout = touchTimeoutRef.current;

    return () => {
      if (chargeInterval) {
        clearInterval(chargeInterval);
      }
      if (touchTimeout) {
        clearTimeout(touchTimeout);
      }
    };
  }, []);

  // Update charge level during hold
  const updateChargeLevel = useCallback(() => {
    if (!holdStartTime) return;

    const elapsed = Date.now() - holdStartTime;
    const maxHoldTime = 5000; // 5 seconds max
    const newChargeLevel = Math.min((elapsed / maxHoldTime) * 100, 100);

    setChargeLevel(newChargeLevel);

    if (buttonRef.current) {
      animateChargeButton(buttonRef.current, newChargeLevel);
    }
  }, [holdStartTime]);

  // Start charging
  const startCharging = useCallback(() => {
    if (!canSpin) return;

    setIsCharging(true);
    setHoldStartTime(Date.now());
    setChargeLevel(0);

    // Start charge level updates
    chargeIntervalRef.current = setInterval(updateChargeLevel, 50); // 20fps

    // Add haptic feedback on mobile
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }
  }, [canSpin, updateChargeLevel]);

  // Trigger the actual spin
  const triggerSpin = useCallback(
    (holdDuration: number) => {
      if (!onSpin || !onSpinStart) return;

      // Calculate spin parameters
      const force = calculateSpinForce(holdDuration);
      const baseConfig = getDefaultSpinConfig();
      const config = {
        ...baseConfig,
        force,
        friction: baseConfig.friction / speedMultipliers[settings.speed],
      };

      const spinResult = calculateSpinPhysics(config);
      const adjustedDuration =
        spinResult.duration * speedMultipliers[settings.speed];

      // Start spin
      onSpinStart();
      setChargeLevel(0);

      // Trigger spin animation
      onSpin(
        spinResult.finalAngle + spinResult.rotations * 360,
        adjustedDuration
      );

      // Play sound if enabled
      if (settings.sound) {
        // You could implement actual sound here
        console.log("🔊 Spin sound effect");
      }
    },
    [onSpin, onSpinStart, settings, speedMultipliers]
  );

  // Stop charging and trigger spin
  const stopCharging = useCallback(() => {
    if (!isCharging || !holdStartTime) return;

    const holdDuration = Date.now() - holdStartTime;

    // Clear intervals
    if (chargeIntervalRef.current) {
      clearInterval(chargeIntervalRef.current);
      chargeIntervalRef.current = null;
    }

    // Reset states
    setIsCharging(false);
    setHoldStartTime(null);

    // Reset button animation
    if (buttonRef.current) {
      resetChargeButton(buttonRef.current);
    }

    // Only spin if held for at least 500ms
    if (holdDuration >= 500) {
      triggerSpin(holdDuration);
    } else {
      setChargeLevel(0);
    }

    // Haptic feedback
    if ("vibrate" in navigator) {
      navigator.vibrate(100);
    }
  }, [isCharging, holdStartTime, triggerSpin]);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();

    // Create ripple effect
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createRippleEffect(buttonRef.current, x, y);
    }

    startCharging();
  };

  const handleMouseUp = () => {
    stopCharging();
  };

  const handleMouseLeave = () => {
    stopCharging();
  };

  // Touch event handlers (for mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();

    // Create ripple effect
    if (buttonRef.current && e.touches[0]) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      createRippleEffect(buttonRef.current, x, y);
    }

    startCharging();
  };

  const handleTouchEnd = () => {
    stopCharging();
  };

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle spacebar if no input is focused
      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.getAttribute("contenteditable") === "true");

      if (e.code === "Space" && !isCharging && canSpin && !isInputFocused) {
        e.preventDefault();
        startCharging();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Only handle spacebar if no input is focused
      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.getAttribute("contenteditable") === "true");

      if (e.code === "Space" && isCharging && !isInputFocused) {
        e.preventDefault();
        stopCharging();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isCharging, canSpin, startCharging, stopCharging]);

  const getChargeColor = () => {
    if (chargeLevel < 25) return "from-purple-600 to-purple-700";
    if (chargeLevel < 50) return "from-purple-500 to-pink-600";
    if (chargeLevel < 75) return "from-pink-500 to-red-500";
    return "from-red-500 to-yellow-500";
  };

  const getChargeText = () => {
    if (!isCharging) return "🎪 HOLD TO SPIN!";
    if (chargeLevel < 25) return "⚡ Charging...";
    if (chargeLevel < 50) return "💫 Building Power...";
    if (chargeLevel < 75) return "🔥 Getting Strong...";
    return "🌟 MAXIMUM POWER!";
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Spin Button */}
      <div className="text-center">
        <button
          ref={buttonRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          disabled={!canSpin}
          className={`
            relative overflow-hidden select-none
            w-full max-w-xs px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200
            ${
              canSpin
                ? `bg-gradient-to-r ${getChargeColor()} hover:shadow-lg transform active:scale-95 cursor-pointer`
                : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
            }
            ${isCharging ? "scale-105" : ""}
          `}
          style={{
            touchAction: "none",
            userSelect: "none",
            WebkitUserSelect: "none",
          }}
        >
          <span className="relative z-10 text-white">{getChargeText()}</span>

          {/* Charge Level Indicator */}
          {isCharging && (
            <div className="absolute bottom-0 left-0 h-1 bg-white/40 transition-all duration-100">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{ width: `${chargeLevel}%` }}
              />
            </div>
          )}
        </button>

        {/* Instructions */}
        <div className="mt-2 text-xs text-zinc-400 text-center">
          {canSpin ? (
            <div>
              Hold button longer for stronger spin • Press{" "}
              <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-xs">
                Space
              </kbd>{" "}
              to spin
            </div>
          ) : (
            <div className="text-red-400">
              {validation.message || "Cannot spin"}
            </div>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-purple-200">
            Spin Settings
          </h4>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform ${
                showSettings ? "rotate-180" : ""
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {showSettings && (
          <div className="space-y-3">
            {/* Speed Setting */}
            <div>
              <label className="block text-xs text-zinc-400 mb-1">
                Spin Speed
              </label>
              <div className="flex gap-1">
                {(["slow", "normal", "fast"] as const).map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setSettings((prev) => ({ ...prev, speed }))}
                    className={`
                      flex-1 px-3 py-2 text-xs rounded transition-colors
                      ${
                        settings.speed === speed
                          ? "bg-purple-600 text-white"
                          : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                      }
                    `}
                  >
                    {speed.charAt(0).toUpperCase() + speed.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound Setting */}
            <div className="flex items-center justify-between">
              <label className="text-xs text-zinc-400">Sound Effects</label>
              <button
                onClick={() =>
                  setSettings((prev) => ({ ...prev, sound: !prev.sound }))
                }
                className={`
                  relative w-10 h-5 rounded-full transition-colors
                  ${settings.sound ? "bg-purple-600" : "bg-zinc-700"}
                `}
              >
                <div
                  className={`
                  absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform
                  ${settings.sound ? "translate-x-5" : "translate-x-0.5"}
                `}
                />
              </button>
            </div>
          </div>
        )}

        {/* Current Stats */}
        <div className="mt-3 pt-3 border-t border-zinc-700 text-xs text-zinc-400">
          <div className="flex justify-between">
            <span>Movies on wheel:</span>
            <span className="text-white">{movies.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Spin speed:</span>
            <span className="text-white capitalize">{settings.speed}</span>
          </div>
          <div className="flex justify-between">
            <span>Sound:</span>
            <span className="text-white">{settings.sound ? "On" : "Off"}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => window.location.reload()}
          disabled={isSpinning}
          className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 py-2 px-3 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🔄 Reset Game
        </button>
        <button
          onClick={() => setShowSettings(!showSettings)}
          disabled={isSpinning}
          className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 py-2 px-3 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ⚙️ Settings
        </button>
      </div>
    </div>
  );
};

export default RouletteControls;
