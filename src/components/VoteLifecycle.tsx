"use client";

import { motion, Variants } from "framer-motion";
import styles from "./VoteLifecycle.module.css";

const STAGES = [
  { id: "cast", label: "Cast", sub: "Ballot is deposited" },
  { id: "scan", label: "Scanned", sub: "Tabulation begins" },
  { id: "canvass", label: "Canvassed", sub: "Signatures verified" },
  { id: "certified", label: "Certified", sub: "Results are official" },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.4 } },
};

const nodeVariant: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
};

const lineVariant: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.4, ease: "easeInOut" } },
};

export default function VoteLifecycle() {
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Lifecycle of a Vote</h4>
      <p className={styles.subtitle}>From the scanner to certification.</p>

      <motion.div
        className={styles.track}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {STAGES.map((stage, i) => (
          <div key={stage.id} className={styles.stageGroup}>
            <div className={styles.stageItem}>
              <motion.div className={styles.node} variants={nodeVariant}>
                <div className={styles.nodeInner} />
              </motion.div>
              <div className={styles.stageText}>
                <span className={styles.stageLabel}>{stage.label}</span>
                <span className={styles.stageSub}>{stage.sub}</span>
              </div>
            </div>
            {i < STAGES.length - 1 && (
              <motion.div
                className={styles.connector}
                variants={lineVariant}
                style={{ transformOrigin: "left" }}
              />
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
