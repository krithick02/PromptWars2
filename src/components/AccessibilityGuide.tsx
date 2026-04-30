"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Accessibility, ChevronDown } from "lucide-react";
import styles from "./AccessibilityGuide.module.css";

const RIGHTS = [
  { id: 1, right: "Curbside Voting", detail: "You may request to vote from your vehicle if you cannot enter the polling place." },
  { id: 2, right: "Audio Ballot", detail: "Request a headphone-compatible audio ballot device at any polling location." },
  { id: 3, right: "Assistance in the Booth", detail: "You may bring a person of your choice to assist you inside the voting booth, except your employer or union rep." },
  { id: 4, right: "Accessible Voting Machines", detail: "Every polling place is required by law to offer at least one accessible voting machine." },
];

export default function AccessibilityGuide() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className={styles.container}>
      <button className={styles.trigger} onClick={() => setOpen(v => !v)} aria-expanded={open}>
        <div className={styles.triggerLeft}>
          <Accessibility size={16} className={styles.triggerIcon} />
          <span>Universal Access Guide</span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={14} className={styles.chevron} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={styles.panel}
          >
            {RIGHTS.map(item => (
              <div key={item.id} className={styles.right}>
                <button
                  className={styles.rightTrigger}
                  onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                  aria-expanded={expanded === item.id}
                  aria-controls={`right-detail-${item.id}`}
                >
                  <span className={styles.bullet}>◆</span>
                  <span>{item.right}</span>
                  <ChevronDown
                    size={12}
                    style={{ marginLeft: "auto", opacity: 0.5, transform: expanded === item.id ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}
                  />
                </button>
                <AnimatePresence>
                  {expanded === item.id && (
                    <motion.p
                      id={`right-detail-${item.id}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className={styles.detail}
                      role="region"
                    >
                      {item.detail}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
