"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { TMDBMovie } from "@/types";
import {
  generateWheelSegments,
  calculateWheelSize,
  WheelSegment,
} from "@/utils/roulettePhysics";
import { animateWinnerHighlight } from "@/utils/rouletteAnimations";

interface RouletteWheelProps {
  movies: TMDBMovie[];
  isSpinning: boolean;
  winner: TMDBMovie | null;
  onSpinComplete?: (winner: TMDBMovie) => void;
  className?: string;
}

interface RouletteWheelRef {
  spin: (totalRotation: number, duration: number) => void;
}

// Forward ref to expose spin method
const RouletteWheel = React.forwardRef<RouletteWheelRef, RouletteWheelProps>(
  (props, ref) => {
    const wheelRef = useRef<HTMLDivElement>(null);
    const [segments, setSegments] = useState<WheelSegment[]>([]);
    const [wheelSize, setWheelSize] = useState({
      diameter: 300,
      fontSize: "12px",
      posterSize: 30,
    });
    const [currentRotation, setCurrentRotation] = useState(0);

    // Generate wheel segments when movies change
    useEffect(() => {
      if (props.movies.length > 0) {
        const newSegments = generateWheelSegments(props.movies);
        const newWheelSize = calculateWheelSize(props.movies.length);
        setSegments(newSegments);
        setWheelSize(newWheelSize);
      } else {
        setSegments([]);
      }
    }, [props.movies]);

    // Highlight winner when determined
    useEffect(() => {
      if (props.winner && !props.isSpinning) {
        const winnerSegment = segments.find(
          (segment) => segment.movie.id === props.winner!.id
        );
        if (winnerSegment) {
          const segmentElement = document.querySelector(
            `[data-segment-id="${props.winner.id}"]`
          ) as HTMLElement;
          if (segmentElement) {
            setTimeout(() => {
              animateWinnerHighlight(segmentElement);
            }, 500);
          }
        }
      }
    }, [props.winner, props.isSpinning, segments]);

    // Spin animation handler
    const handleSpin = (totalRotation: number, duration: number) => {
      if (!wheelRef.current) return;

      // Reset any previous animation
      wheelRef.current.style.animation = "";

      // Use CSS transition for smooth animation
      wheelRef.current.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;

      // Update state after animation completes
      setTimeout(() => {
        setCurrentRotation(totalRotation % 360);
        if (wheelRef.current) {
          wheelRef.current.style.transition = "";
        }
      }, duration);
    };

    // Expose spin method to parent
    React.useImperativeHandle(
      ref,
      () => ({
        spin: handleSpin,
      }),
      []
    );

    const getPosterUrl = (movie: TMDBMovie) => {
      return movie.poster_path
        ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
        : null;
    };

    const getSegmentPath = (segment: WheelSegment, radius: number) => {
      const startAngle = (segment.startAngle - 90) * (Math.PI / 180);
      const endAngle = (segment.endAngle - 90) * (Math.PI / 180);

      const x1 = radius + radius * Math.cos(startAngle);
      const y1 = radius + radius * Math.sin(startAngle);
      const x2 = radius + radius * Math.cos(endAngle);
      const y2 = radius + radius * Math.sin(endAngle);

      const largeArcFlag = segment.endAngle - segment.startAngle > 180 ? 1 : 0;

      return `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    };

    const getTextPosition = (segment: WheelSegment, radius: number) => {
      const midAngle =
        ((segment.startAngle + segment.endAngle) / 2 - 90) * (Math.PI / 180);
      const textRadius = radius * 0.8;

      const x = radius + textRadius * Math.cos(midAngle);
      const y = radius + textRadius * Math.sin(midAngle);

      return { x, y, angle: (segment.startAngle + segment.endAngle) / 2 };
    };

    const getPosterPosition = (segment: WheelSegment, radius: number) => {
      const midAngle =
        ((segment.startAngle + segment.endAngle) / 2 - 90) * (Math.PI / 180);
      const posterRadius = radius * 0.6;

      const x = radius + posterRadius * Math.cos(midAngle);
      const y = radius + posterRadius * Math.sin(midAngle);

      return { x, y };
    };

    if (props.movies.length === 0) {
      return (
        <div className={`flex items-center justify-center ${props.className}`}>
          <div
            className="rounded-full border-4 border-dashed border-zinc-700 flex items-center justify-center"
            style={{
              width: wheelSize.diameter,
              height: wheelSize.diameter,
            }}
          >
            <div className="text-center text-zinc-500">
              <div className="text-4xl mb-2">🎪</div>
              <p className="text-sm">Add movies to create wheel</p>
            </div>
          </div>
        </div>
      );
    }

    const radius = wheelSize.diameter / 2;

    return (
      <div
        className={`relative flex items-center justify-center ${props.className}`}
      >
        {/* Wheel Container */}
        <div className="relative">
          {/* Main Wheel */}
          <div
            ref={wheelRef}
            className="relative"
            style={{
              width: wheelSize.diameter,
              height: wheelSize.diameter,
              transform: `rotate(${currentRotation}deg)`,
              transformOrigin: "center center",
            }}
          >
            <svg
              width={wheelSize.diameter}
              height={wheelSize.diameter}
              className="overflow-visible"
              style={{ filter: props.isSpinning ? "blur(0.5px)" : "none" }}
            >
              {/* Wheel Segments */}
              {segments.map((segment) => (
                <g
                  key={segment.movie.id}
                  data-segment-id={segment.movie.id}
                >
                  {/* Segment Background */}
                  <path
                    d={getSegmentPath(segment, radius - 2)}
                    fill={segment.color}
                    stroke="#18181b"
                    strokeWidth="2"
                    className="transition-opacity duration-300"
                    style={{
                      opacity:
                        props.winner && props.winner.id === segment.movie.id
                          ? 1
                          : 0.9,
                    }}
                  />

                  {/* Movie Poster */}
                  {getPosterUrl(segment.movie) && (
                    <g>
                      <defs>
                        <clipPath id={`clip-${segment.movie.id}`}>
                          <rect
                            x={
                              getPosterPosition(segment, radius).x -
                              wheelSize.posterSize / 2
                            }
                            y={
                              getPosterPosition(segment, radius).y -
                              wheelSize.posterSize * 0.75
                            }
                            width={wheelSize.posterSize}
                            height={wheelSize.posterSize * 1.5}
                            rx="4"
                          />
                        </clipPath>
                      </defs>
                      <foreignObject
                        x={
                          getPosterPosition(segment, radius).x -
                          wheelSize.posterSize / 2
                        }
                        y={
                          getPosterPosition(segment, radius).y -
                          wheelSize.posterSize * 0.75
                        }
                        width={wheelSize.posterSize}
                        height={wheelSize.posterSize * 1.5}
                        clipPath={`url(#clip-${segment.movie.id})`}
                      >
                        <Image
                          src={getPosterUrl(segment.movie)!}
                          alt={`${segment.movie.title} poster`}
                          width={wheelSize.posterSize}
                          height={wheelSize.posterSize * 1.5}
                          className="object-cover w-full h-full"
                        />
                      </foreignObject>
                    </g>
                  )}

                  {/* Movie Title */}
                  <text
                    x={getTextPosition(segment, radius).x}
                    y={getTextPosition(segment, radius).y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={wheelSize.fontSize}
                    fontWeight="bold"
                    className="pointer-events-none select-none"
                    style={{
                      textShadow: "2px 2px 4px rgba(0,0,0,0.9)",
                      filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.9))",
                    }}
                  >
                    {segment.movie.title.length > 12
                      ? `${segment.movie.title.slice(0, 12)}...`
                      : segment.movie.title}
                  </text>
                </g>
              ))}
            </svg>

            {/* Center Circle */}
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full border-4 border-white flex items-center justify-center"
              style={{
                width: Math.max(40, wheelSize.diameter * 0.12),
                height: Math.max(40, wheelSize.diameter * 0.12),
              }}
            >
              <span className="text-2xl">🎬</span>
            </div>
          </div>

          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
            <div
              className="w-0 h-0 border-l-[15px] border-r-[15px] border-b-[25px] border-l-transparent border-r-transparent border-b-yellow-500"
              style={{
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
              }}
            />
          </div>

          {/* Wheel Base/Shadow */}
          <div
            className="absolute top-2 left-2 rounded-full bg-black/20 -z-10"
            style={{
              width: wheelSize.diameter,
              height: wheelSize.diameter,
              filter: "blur(10px)",
            }}
          />
        </div>

        {/* Spinning Overlay */}
        {props.isSpinning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 rounded-full p-4">
              <div className="text-white text-lg font-bold animate-pulse">
                Spinning...
              </div>
            </div>
          </div>
        )}

        {/* Winner Announcement Overlay */}
        {props.winner && !props.isSpinning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-gradient-to-br from-yellow-500/90 to-orange-500/90 rounded-lg p-4 text-center text-white shadow-lg">
              <div className="text-2xl mb-1">🏆</div>
              <div className="font-bold text-lg">Winner!</div>
              <div className="text-sm opacity-90">{props.winner.title}</div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

RouletteWheel.displayName = "RouletteWheel";

export default RouletteWheel;
