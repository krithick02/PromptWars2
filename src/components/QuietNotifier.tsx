"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ArrowRight } from "lucide-react";
import styles from "./QuietNotifier.module.css";

export default function QuietNotifier({ onEnable }: { onEnable?: () => void }) {
  const [enabled, setEnabled] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [contact, setContact] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contact.trim() !== "") setSubmitted(true);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.sectionTitle}>Alerts</h3>
      
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <div className={styles.iconContainer}>
            <Bell size={18} className={enabled ? styles.iconActive : styles.iconIdle} />
          </div>
          <div className={styles.textContainer}>
            <h4 className={styles.title}>Milestones</h4>
            <p className={styles.subtitle}>Get a gentle nudge.</p>
          </div>
          
          <button 
            className={`${styles.toggle} ${enabled ? styles.toggleActive : ""}`}
            onClick={() => { const next = !enabled; setEnabled(next); if (next) onEnable?.(); }}
          >
            <motion.div 
              className={styles.toggleKnob}
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        <AnimatePresence>
          {enabled && !submitted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={styles.inputSection}
            >
              <form onSubmit={handleSubmit} className={styles.form}>
                <input 
                  type="text" 
                  placeholder="Email / Phone" 
                  className={styles.input}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
                <button type="submit" className={styles.submitBtn} disabled={!contact.trim()}>
                  <ArrowRight size={16} />
                </button>
              </form>
            </motion.div>
          )}

          {enabled && submitted && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={styles.successMessage}>
              <span className={styles.checkIcon}>&gt;</span> Configured.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
