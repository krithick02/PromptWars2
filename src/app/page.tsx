"use client";

import { Suspense, memo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Calendar, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import styles from "./page.module.css";

import LanguageSelector from "../components/LanguageSelector";
import { useDashboardState } from "../hooks/useDashboardState";

// Dynamic imports for heavy components
const CivicConcierge = dynamic(() => import("../components/CivicConcierge"), {
  loading: () => <div className={styles.skeleton}>Loading Intelligence...</div>,
  ssr: false
});

const PollingPlaceMap = dynamic(() => import("../components/PollingPlaceMap"), {
  loading: () => <div className={styles.skeleton}>Loading Geospatial Map...</div>,
  ssr: false
});

// Other components
import QuietNotifier from "../components/QuietNotifier";
import MythRealityCards from "../components/MythRealityCards";
import BallotSandbox from "../components/BallotSandbox";
import DeepDivePanel from "../components/DeepDivePanel";
import StateSelector from "../components/StateSelector";
import ElectionCalendar from "../components/ElectionCalendar";
import CivicConfidenceScore from "../components/CivicConfidenceScore";

// Memoize components for performance
const MemoizedMythRealityCards = memo(MythRealityCards);
const MemoizedElectionCalendar = memo(ElectionCalendar);
const MemoizedQuietNotifier   = memo(QuietNotifier);
const MemoizedBallotSandbox    = memo(BallotSandbox);
const MemoizedDeepDivePanel    = memo(DeepDivePanel);
const MemoizedCivicConfidenceScore = memo(CivicConfidenceScore);

// Map icons to the steps in the hook
const STEP_ICONS = [
  <CheckCircle2 size={18} key="0" />,
  <Calendar     size={18} key="1" />,
  <MapPin       size={18} key="2" />,
];

export default function Home() {
  const {
    activeStep, setActiveStep,
    completedSteps,
    selectedState, setSelectedState,
    setSandboxCast,
    setNotifierOn,
    pathComplete,
    daysRemaining,
    score, achieved,
    handleCompleteStep,
    STEPS
  } = useDashboardState();

  return (
    <main className={styles.dashboard}>
      <header className={styles.headerRow}>
        <h1 className={styles.title}>ELECTION // SYS</h1>
        <div className={styles.headerCenter}>
          <StateSelector selected={selectedState} onSelect={setSelectedState} />
          <LanguageSelector />
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
          >
            {daysRemaining}d
          </motion.span>
        </div>
      </header>

      <div className={styles.bentoGrid}>
        <section className={`glass-panel ${styles.bentoPath}`}>
          <h3 className={styles.sectionTitle}>Guided Path</h3>
          <div className={styles.stepsContainer}>
            {STEPS.map((step, index) => {
              const isActive    = index === activeStep;
              const isCompleted = completedSteps.includes(index);
              const description = index === 0 ? "Verify status or register online." : 
                                 index === 1 ? "Review non-partisan summaries." : 
                                 "Track your mail-in or in-person ballot.";

              return (
                <motion.div
                  key={step.id}
                  className={`${styles.stepCard} ${isActive ? styles.stepActive : ""} ${isCompleted ? styles.stepCompleted : ""}`}
                  onClick={() => setActiveStep(index)}
                  layout
                >
                  <div className={styles.stepHeader}>
                    {STEP_ICONS[index]}
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
                        <p>{description}</p>
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

        <section className={`glass-panel ${styles.bentoScore}`} aria-label="Civic Readiness Score">
          <MemoizedCivicConfidenceScore score={score} achieved={achieved} />
        </section>

        <section className={`glass-panel ${styles.bentoSandbox}`} aria-label="Ballot Sandbox">
          <MemoizedBallotSandbox onCast={() => setSandboxCast(true)} />
        </section>

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
              <section className={`glass-panel ${styles.bentoConcierge}`} aria-label="AI Civic Concierge">
                <Suspense fallback={<Loader2 className="animate-spin" />}>
                  <CivicConcierge />
                </Suspense>
              </section>
              <section className={`glass-panel ${styles.bentoMap}`} aria-label="Polling Place Map">
                <Suspense fallback={<Loader2 className="animate-spin" />}>
                  <PollingPlaceMap />
                </Suspense>
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
