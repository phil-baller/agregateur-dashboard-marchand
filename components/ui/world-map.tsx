"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import DottedMap from "dotted-map";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const MAP_WIDTH = 800;
const MAP_HEIGHT = 400;

export interface WorldMapDot {
  start: { lat: number; lng: number; label?: string };
  end: { lat: number; lng: number; label?: string };
}

interface MapProps {
  dots?: WorldMapDot[];
  lineColor?: string;
  className?: string;
  /** Focus point (e.g. Cameroon center). When set with zoom, centers the map on this lat/lng */
  focus?: { lat: number; lng: number };
  /** Zoom level; use with focus to show a region. ~2–3 for country-level. */
  zoom?: number;
}

function projectPoint(lat: number, lng: number) {
  const x = (lng + 180) * (MAP_WIDTH / 360);
  const y = (90 - lat) * (MAP_HEIGHT / 180);
  return { x, y };
}

export default function WorldMap({
  dots = [],
  lineColor = "#0ea5e9",
  className,
  focus,
  zoom = 1,
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const map = new DottedMap({ height: 100, grid: "diagonal" });

  const { theme } = useTheme();

  const svgMap = map.getSVG({
    radius: 0.22,
    color: theme === "dark" ? "#FFFFFF40" : "#00000040",
    shape: "circle",
    backgroundColor: "transparent",
  });

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  const focusPoint =
    focus && zoom > 1
      ? projectPoint(focus.lat, focus.lng)
      : { x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 };

  const mapContent = (
    <>
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none"
        alt="world map"
        height="495"
        width="1056"
        draggable={false}
      />
      <svg
        ref={svgRef}
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="w-full h-full absolute inset-0 pointer-events-none select-none"
      >
        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 1,
                  delay: 0.5 * i,
                  ease: "easeOut",
                }}
                key={`start-upper-${i}`}
              />
            </g>
          );
        })}
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        {dots.map((dot, i) => (
          <g key={`points-group-${i}`}>
            <g key={`start-${i}`}>
              <circle
                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                r="2"
                fill={lineColor}
              />
              <circle
                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                r="2"
                fill={lineColor}
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from="2"
                  to="8"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
            <g key={`end-${i}`}>
              <circle
                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                r="2"
                fill={lineColor}
              />
              <circle
                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                r="2"
                fill={lineColor}
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from="2"
                  to="8"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </g>
        ))}
      </svg>
    </>
  );

  const useZoomFocus = focus && zoom > 1;

  return (
    <div
      className={cn(
        "relative font-sans bg-transparent",
        useZoomFocus ? "h-full w-full min-h-0 overflow-hidden" : "w-full aspect-[2/1]",
        className
      )}
    >
      {useZoomFocus ? (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div
            className="absolute"
            style={{
              width: MAP_WIDTH,
              height: MAP_HEIGHT,
              left: `calc(50% - ${focusPoint.x}px)`,
              top: `calc(50% - ${focusPoint.y}px)`,
              transform: `scale(${zoom})`,
              transformOrigin: `${focusPoint.x}px ${focusPoint.y}px`,
            }}
          >
            {mapContent}
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full">{mapContent}</div>
      )}
    </div>
  );
}
