"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./MythRealityCards.module.css";

const CARDS = [
  {
    id: 1,
    myth: "My vote doesn't really matter locally.",
    reality: "Local elections are often decided by <100 votes."
  }
];

export default function MythRealityCards() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const toggleFlip = (id: number) => {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.sectionTitle}>Myth vs. Reality</h3>
      
      <div className={styles.grid}>
        {CARDS.map(card => {
          const isFlipped = flipped[card.id];
          return (
            <div 
              key={card.id} 
              className={styles.cardWrapper}
              onClick={() => toggleFlip(card.id)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleFlip(card.id)}
              role="button"
              tabIndex={0}
              aria-pressed={isFlipped}
              aria-label="Toggle myth vs reality card"
            >
              <motion.div
                className={styles.cardInner}
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className={`${styles.cardFace} ${styles.cardFront}`}>
                  <span className={styles.label}>Myth</span>
                  <p className={styles.text}>"{card.myth}"</p>
                </div>
                
                <div className={`${styles.cardFace} ${styles.cardBack}`}>
                  <span className={styles.label}>Reality</span>
                  <p className={styles.text}>{card.reality}</p>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
