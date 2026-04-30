"use client";

import { useState, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import styles from "./page.module.css";

import QuietNotifier from "../components/QuietNotifier";
import DayOfChecklist from "../components/DayOfChecklist";
import MythRealityCards from "../components/MythRealityCards";
import BallotSandbox from "../components/BallotSandbox";
import DeepDivePanel from "../components/DeepDivePanel";
import StateSelector, { STATE_DATA } from "../components/StateSelector";
import ElectionCalendar from "../components/ElectionCalendar";
import CivicConfidenceScore from "../components/CivicConfidenceScore";

// Memoize components for performance
const MemoizedMythRealityCards = memo(MythRealityCards);
const MemoizedElectionCalendar = memo(ElectionCalendar);
const MemoizedQuietNotifier   = memo(QuietNotifier);
const MemoizedBallotSandbox    = memo(BallotSandbox);
const MemoizedDeepDivePanel    = memo(DeepDivePanel);
const MemoizedCivicConfidenceScore = memo(CivicConfidenceScore);

const FALLBACK_DEADLINE = new Date("2026-11-03T00:00:00");

const STEPS = [
  { id: "reg",  title: "Registration", description: "Verify status or register online.",       icon: <CheckCircle2 size={18} className={styles.stepIcon} /> },
  { id: "edu",  title: "Education",    description: "Review non-partisan summaries.",           icon: <Calendar     size={18} className={styles.stepIcon} /> },
  { id: "vote", title: "Balloting",    description: "Track your mail-in or in-person ballot.", icon: <MapPin       size={18} className={styles.stepIcon} /> },
];

// Score weights (total 100)
const WEIGHTS: Record<string, number> = {
  stateSelected:    10,
  step_reg:         15,
  step_edu:         15,
  step_vote:        15,
  sandboxCast:      15,
  checklistAll:     15,
  notifierEnabled:  15,
};

export default function Home() {
  const [activeStep, setActiveStep]         = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedState, setSelectedState]   = useState<string | null>(null);
  const [sandboxCast, setSandboxCast]       = useState(false);
  const [checklistAll, setChecklistAll]     = useState(false);
  const [notifierOn, setNotifierOn]         = useState(false);

  const pathComplete = completedSteps.length === STEPS.length;

  // Dynamic countdown
  const deadline = useMemo(() => {
    if (!selectedState) return FALLBACK_DEADLINE;
    const d = STATE_DATA[selectedState]?.electionDay;
    return d ? new Date(d) : FALLBACK_DEADLINE;
  }, [selectedState]);

  const daysRemaining = Math.max(
    0,
    Math.ceil((deadline.getTime() - Date.now()) / (1000 * 3600 * 24))
  );

  // Compute Civic Confidence Score
  const { score, achieved } = useMemo(() => {
    const hits: string[] = [];
    let s = 0;
    if (selectedState)                   { s += WEIGHTS.stateSelected;   hits.push("State selected"); }
    if (completedSteps.includes(0))      { s += WEIGHTS.step_reg;         hits.push("Registration done"); }
    if (completedSteps.includes(1))      { s += WEIGHTS.step_edu;         hits.push("Education complete"); }
    if (completedSteps.includes(2))      { s += WEIGHTS.step_vote;        hits.push("Voting pathway read"); }
    if (sandboxCast)                     { s += WEIGHTS.sandboxCast;      hits.push("Ballot practiced"); }
    if (checklistAll)                    { s += WEIGHTS.checklistAll;     hits.push("Day-of checklist done"); }
    if (notifierOn)                      { s += WEIGHTS.notifierEnabled;  hits.push("Alerts configured"); }
    return { score: s, achieved: hits };
  }, [selectedState, completedSteps, sandboxCast, checklistAll, notifierOn]);

  const handleCompleteStep = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (!completedSteps.includes(index)) setCompletedSteps(prev => [...prev, index]);
    if (index < STEPS.length - 1) setActiveStep(index + 1);
  };

  return (
    <main className={styles.dashboard}>

      {/* ── Header ── */}
      <header className={styles.headerRow}>
        <h1 className={styles.title}>ELECTION // SYS</h1>
        <div className={styles.headerCenter}>
          <StateSelector selected={selectedState} onSelect={setSelectedState} />
        </div>
        <div className={styles.countdownArea}>
          <span className={styles.countdownLabel}>
            {selectedState ? selectedState.split(" ")[0].toUpperCase() + " • T-Minus" : "T-Minus"}
          </span>
          <motion.span
            key={daysRemaining}
            className={styles.countdownValue}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {daysRemaining}d
          </motion.span>
        </div>
      </header>

      {/* ── Bento Grid ── */}
      <div className={styles.bentoGrid}>

        {/* Left: Guided Path */}
        <section className={`glass-panel ${styles.bentoPath}`}>
          <h3 className={styles.sectionTitle}>Guided Path</h3>
          <div className={styles.stepsContainer}>
            {STEPS.map((step, index) => {
              const isActive    = index === activeStep;
              const isCompleted = completedSteps.includes(index);
              return (
                <motion.div
                  key={step.id}
                  className={`${styles.stepCard} ${isActive ? styles.stepActive : ""} ${isCompleted ? styles.stepCompleted : ""}`}
                  onClick={() => setActiveStep(index)}
                  layout
                >
                  <div className={styles.stepHeader}>
                    {step.icon}
                    <h4 className={styles.stepTitle} style={{ textDecoration: isCompleted ? "line-through" : "none" }}>
                      {step.title}
                    </h4>
                  </div>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={styles.stepContent}
                      >
                        <p>{step.description}</p>
                        <button
                          className={styles.actionBtn}
                          onClick={e => handleCompleteStep(e, index)}
                          disabled={isCompleted}
                        >
                          {isCompleted ? "Completed ✓" : "Complete Step"}{!isCompleted && <ChevronRight size={14} />}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
          <AnimatePresence>
            {pathComplete && (
              <motion.p className={styles.unlockHint} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                ✦ Advanced modules unlocked →
              </motion.p>
            )}
          </AnimatePresence>
        </section>

        {/* Left Bottom: Civic Confidence Score */}
        <section className={`glass-panel ${styles.bentoScore}`} aria-label="Civic Readiness Score">
          <MemoizedCivicConfidenceScore score={score} achieved={achieved} />
        </section>

        {/* Center: Sandbox */}
        <section className={`glass-panel ${styles.bentoSandbox}`} aria-label="Ballot Sandbox">
          <MemoizedBallotSandbox onCast={() => setSandboxCast(true)} />
        </section>

        {/* Right: Conditional */}
        <AnimatePresence mode="wait">
          {!pathComplete ? (
            <motion.div
              key="right-widgets"
              className={styles.rightWidgets}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <section className={`glass-panel ${styles.bentoCards}`} aria-label="Myth vs Reality">
                <MemoizedMythRealityCards />
              </section>
              <section className={`glass-panel ${styles.bentoCalendar}`} aria-label="Election Calendar">
                <MemoizedElectionCalendar state={selectedState} />
              </section>
              <section className={`glass-panel ${styles.bentoNotifier}`} aria-label="Alerts Configuration">
                <MemoizedQuietNotifier onEnable={() => setNotifierOn(true)} />
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="deep-dive"
              className={`glass-panel ${styles.deepDive}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <MemoizedDeepDivePanel />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
