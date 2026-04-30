"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./BallotSandbox.module.css";

export default function BallotSandbox({ onCast }: { onCast?: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCast, setIsCast] = useState(false);

  const categories = ["Mayor", "City Council", "Propositions"];
  const options = {
    Mayor: ["Candidate A", "Candidate B", "Write-in"],
    "City Council": ["District 1 Representative", "District 2 Representative"],
    Propositions: ["Prop 1: Parks Funding", "Prop 2: Transit Expansion"]
  };

  const handleCategorySelect = (cat: string) => {
    if (isCast) return;
    setSelectedCategory(cat);
    setSelectedOption(null);
  };

  const handleCastBallot = () => {
    setIsCast(true);
    onCast?.();
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedOption(null);
    setIsCast(false);
  };

  return (
    <div className={styles.sandboxContainer}>
      <div className={styles.sandboxHeader}>
        <h3 className={styles.title}>Simulated Ballot</h3>
        <p className={styles.subtitle}>Test your selections in focus mode.</p>
      </div>

      <div className={styles.workspace}>
        {/* Step 1: Categories */}
        <div className={`${styles.column} ${isCast ? styles.blurred : ""}`}>
          <p className={styles.stepLabel}>1. Office</p>
          <div className={styles.optionsList}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.optionBtn} ${selectedCategory === cat ? styles.active : ""}`}
                onClick={() => handleCategorySelect(cat)}
                disabled={isCast}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Options */}
        <div className={`${styles.column} ${!selectedCategory || isCast ? styles.blurred : ""}`}>
          <p className={styles.stepLabel}>2. Selection</p>
          <div className={styles.optionsList}>
            <AnimatePresence mode="popLayout">
              {selectedCategory && (
                <motion.div
                  key={selectedCategory}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.4 }}
                  className={styles.optionsWrapper}
                >
                  {(options as any)[selectedCategory].map((opt: string) => (
                    <button
                      key={opt}
                      className={`${styles.optionBtn} ${selectedOption === opt ? styles.activeSelection : ""}`}
                      onClick={() => setSelectedOption(opt)}
                      disabled={isCast}
                    >
                      {opt}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            {!selectedCategory && (
              <p className={styles.emptyState}>Awaiting Input_</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Step 3: Confirmation */}
      <AnimatePresence mode="wait">
        {selectedOption && !isCast && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.confirmation}
          >
            <div className={styles.logText}>
              <span className={styles.checkIcon}>&gt;</span> LOGGED: <span className={styles.cyanText}>{selectedOption}</span>
            </div>
            <button className={styles.castBtn} onClick={handleCastBallot}>
              Cast Simulated Ballot
            </button>
          </motion.div>
        )}
        
        {isCast && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.confirmation}
          >
            <div className={styles.logText}>
              <span className={styles.checkIcon}>✓</span> BALLOT CAST SUCCESSFULLY
            </div>
            <button className={styles.resetBtn} onClick={handleReset}>
              Reset Sandbox
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
