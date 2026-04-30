"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import styles from "./DayOfChecklist.module.css";

const ITEMS = [
  { id: "id", label: "Valid Photo ID" },
  { id: "ballot", label: "Sample Ballot" },
  { id: "hours", label: "Polling Hours (7-8)" },
  { id: "location", label: "Polling Location" }
];

export default function DayOfChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.sectionTitle}>Checklist</h3>
      
      <div className={styles.list}>
        {ITEMS.map(item => {
          const isChecked = checked[item.id];
          return (
            <div 
              key={item.id} 
              className={styles.row}
              onClick={() => toggleCheck(item.id)}
            >
              <div className={`${styles.checkbox} ${isChecked ? styles.checkboxActive : ""}`}>
                {isChecked && <Check size={12} strokeWidth={4} className={styles.checkIcon} />}
              </div>
              <div className={styles.labelContainer}>
                <motion.span 
                  className={`${styles.label} ${isChecked ? styles.labelChecked : ""}`}
                  animate={{ color: isChecked ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.9)" }}
                >
                  {item.label}
                </motion.span>
                {isChecked && (
                  <motion.div 
                    className={styles.strikethrough}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{ transformOrigin: "left" }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
