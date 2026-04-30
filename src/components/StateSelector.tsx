"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronDown } from "lucide-react";
import styles from "./StateSelector.module.css";

const STATES: Record<string, { reg: string; earlyStart: string; electionDay: string }> = {
  "California":   { reg: "Oct 21, 2026", earlyStart: "Oct 5, 2026",  electionDay: "Nov 3, 2026" },
  "Texas":        { reg: "Oct 5, 2026",  earlyStart: "Oct 19, 2026", electionDay: "Nov 3, 2026" },
  "New York":     { reg: "Oct 14, 2026", earlyStart: "Oct 24, 2026", electionDay: "Nov 3, 2026" },
  "Florida":      { reg: "Oct 4, 2026",  earlyStart: "Oct 19, 2026", electionDay: "Nov 3, 2026" },
  "Illinois":     { reg: "Nov 3, 2026",  earlyStart: "Oct 1, 2026",  electionDay: "Nov 3, 2026" },
  "Pennsylvania": { reg: "Oct 19, 2026", earlyStart: "Oct 19, 2026", electionDay: "Nov 3, 2026" },
  "Ohio":         { reg: "Oct 5, 2026",  earlyStart: "Oct 6, 2026",  electionDay: "Nov 3, 2026" },
  "Georgia":      { reg: "Oct 5, 2026",  earlyStart: "Oct 17, 2026", electionDay: "Nov 3, 2026" },
  "Michigan":     { reg: "Oct 21, 2026", earlyStart: "Sep 19, 2026", electionDay: "Nov 3, 2026" },
  "Arizona":      { reg: "Oct 5, 2026",  earlyStart: "Oct 7, 2026",  electionDay: "Nov 3, 2026" },
};

export const STATE_DATA = STATES;

interface Props {
  selected: string | null;
  onSelect: (state: string) => void;
}

export default function StateSelector({ selected, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={styles.wrapper} ref={ref}>
      <button className={styles.trigger} onClick={() => setOpen(v => !v)}>
        <MapPin size={13} className={styles.icon} />
        <span className={styles.label}>{selected ?? "Select State"}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={12} className={styles.chevron} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18 }}
          >
            {Object.keys(STATES).map(state => (
              <button
                key={state}
                className={`${styles.option} ${selected === state ? styles.optionActive : ""}`}
                onClick={() => { onSelect(state); setOpen(false); }}
              >
                {state}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
