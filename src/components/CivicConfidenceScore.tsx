"use client";

import { motion } from "framer-motion";
import styles from "./CivicConfidenceScore.module.css";

interface Props {
  /** 0–100 score, computed by caller */
  score: number;
  /** Labels for criteria checked off */
  achieved: string[];
}

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const LEVELS: { min: number; label: string; color: string }[] = [
  { min: 0,  label: "New Voter",       color: "rgba(255,255,255,0.3)" },
  { min: 25, label: "Informed",        color: "#4facfe" },
  { min: 50, label: "Prepared",        color: "#00c9ff" },
  { min: 75, label: "Champion",        color: "#00f2fe" },
  { min: 95, label: "Civic Guardian",  color: "#a8ff78" },
];

function levelFor(score: number) {
  return [...LEVELS].reverse().find(l => score >= l.min)!;
}

export default function CivicConfidenceScore({ score, achieved }: Props) {
  const level = levelFor(score);
  const dashOffset = CIRCUMFERENCE * (1 - score / 100);

  return (
    <div className={styles.container}>
      <h3 className={styles.sectionTitle}>Civic Readiness</h3>

      <div className={styles.body}>
        {/* Radial ring */}
        <div className={styles.ringWrapper}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            {/* Track */}
            <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
            {/* Progress arc */}
            <motion.circle
              cx="50" cy="50" r={RADIUS}
              fill="none"
              stroke={level.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              transform="rotate(-90 50 50)"
              style={{ filter: `drop-shadow(0 0 4px ${level.color})` }}
            />
            {/* Score text */}
            <text x="50" y="47" textAnchor="middle" className={styles.scoreNum}>{score}</text>
            <text x="50" y="60" textAnchor="middle" className={styles.scoreUnit}>/ 100</text>
          </svg>

          {/* Glow pulse behind ring */}
          <motion.div
            className={styles.ringGlow}
            style={{ boxShadow: `0 0 30px ${level.color}` }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        {/* Level badge + checklist */}
        <div className={styles.info}>
          <span className={styles.levelBadge} style={{ color: level.color }}>
            ◆ {level.label}
          </span>

          <ul className={styles.achievedList}>
            {achieved.length === 0 && (
              <li className={styles.achievedItem} style={{ opacity: 0.35 }}>Complete modules to earn points</li>
            )}
            {achieved.map(a => (
              <li key={a} className={styles.achievedItem}>
                <span className={styles.checkMark}>✓</span> {a}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
