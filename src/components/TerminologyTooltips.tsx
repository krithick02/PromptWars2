"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./TerminologyTooltips.module.css";

const TERMS: Record<string, string> = {
  "provisional ballot": "A ballot cast when a voter's eligibility cannot be confirmed at the polls. It is set aside and counted only after eligibility is verified.",
  "down-ballot": "Races appearing lower on the ballot — like local judges or school boards — that receive less attention but have significant local impact.",
  "precinct": "A geographic subdivision used to organize voters into polling places. Your polling location is determined by your precinct.",
  "canvassing": "The official post-election process where authorities review and verify all ballots — including mail-in, early, and provisional — before certifying results.",
};

function Term({ word, definition }: { word: string; definition: string }) {
  const [open, setOpen] = useState(false);

  return (
    <span className={styles.termWrapper}>
      <button
        className={styles.term}
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        {word}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.tooltip}
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            {definition}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

export default function TerminologyTooltips() {
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Terminology in Context</h4>
      <p className={styles.subtitle}>Tap the <span className={styles.sampleUnderline}>underlined</span> terms to expand.</p>

      <p className={styles.prose}>
        After casting your vote, your ballot enters{" "}
        <Term word="canvassing" definition={TERMS["canvassing"]} />
        {" "}— an official verification process. If questions arise at the
        polls, you may be issued a{" "}
        <Term word="provisional ballot" definition={TERMS["provisional ballot"]} />
        . Don't overlook the{" "}
        <Term word="down-ballot" definition={TERMS["down-ballot"]} />
        {" "}races — they shape your{" "}
        <Term word="precinct" definition={TERMS["precinct"]} />
        {" "}directly.
      </p>
    </div>
  );
}
