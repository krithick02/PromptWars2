"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import styles from "./SpatialJourney.module.css";

const STATIONS = [
  { id: "checkin", x: 80, y: 60, label: "Check-In" },
  { id: "booth", x: 200, y: 130, label: "Voting Booth" },
  { id: "scanner", x: 320, y: 60, label: "Scanner" },
  { id: "exit", x: 400, y: 130, label: "Exit" },
];

// Polyline path the dot follows
const PATH_POINTS = STATIONS.map(s => `${s.x},${s.y}`).join(" ");

export default function SpatialJourney() {
  const controls = useAnimation();

  useEffect(() => {
    const runAnimation = async () => {
      await controls.start({
        pathLength: 1,
        transition: { duration: 3, ease: "easeInOut" },
      });
    };
    runAnimation();
  }, [controls]);

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>The Polling Station</h4>
      <p className={styles.subtitle}>Follow the path through Election Day.</p>

      <div className={styles.mapWrapper}>
        <svg viewBox="0 0 480 200" className={styles.map}>
          {/* Floor plan outlines */}
          <rect x="20" y="20" width="440" height="160" rx="8" className={styles.room} />
          <rect x="40" y="40" width="80" height="60" rx="4" className={styles.station} />
          <rect x="160" y="100" width="80" height="60" rx="4" className={styles.station} />
          <rect x="280" y="40" width="80" height="60" rx="4" className={styles.station} />

          {/* Labels */}
          {STATIONS.slice(0, -1).map(s => (
            <text key={s.id} x={s.x} y={s.y + 18} className={styles.stationLabel} textAnchor="middle">
              {s.label}
            </text>
          ))}
          <text x="400" y="148" className={styles.stationLabel} textAnchor="middle">Exit</text>

          {/* Animated trail */}
          <motion.polyline
            fill="none"
            stroke="var(--accent-cyan)"
            strokeWidth="2"
            strokeDasharray="4 4"
            points={PATH_POINTS}
            initial={{ pathLength: 0 }}
            animate={controls}
          />

          {/* Moving dot */}
          <motion.circle
            r="6"
            fill="var(--accent-cyan)"
            filter="url(#glow)"
            initial={{ offsetDistance: "0%" } as any}
            animate={{ offsetDistance: "100%" } as any}
            transition={{ duration: 3, ease: "easeInOut" }}
            style={
              {
                offsetPath: `polyline(${PATH_POINTS})`,
              } as any
            }
          />

          {/* Station dots */}
          {STATIONS.map(s => (
            <circle key={s.id} cx={s.x} cy={s.y} r="5" className={styles.stationDot} />
          ))}

          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}
