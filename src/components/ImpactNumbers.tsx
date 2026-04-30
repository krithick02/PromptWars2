"use client";

import { motion } from "framer-motion";
import styles from "./ImpactNumbers.module.css";

const DATA = [
  {
    id: 1,
    metric: "$2.4M",
    label: "Local Funding",
    points: "0,40 20,35 40,20 60,25 80,10 100,5"
  }
];

export default function ImpactNumbers() {
  return (
    <div className={styles.container}>
      <h3 className={styles.sectionTitle}>Impact</h3>

      <div className={styles.grid}>
        {DATA.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.metricContainer}>
              <h4 className={styles.metric}>{item.metric}</h4>
              <p className={styles.label}>{item.label}</p>
            </div>
            
            <div className={styles.sparklineContainer}>
              <svg viewBox="0 0 100 40" className={styles.sparkline} preserveAspectRatio="none">
                <line x1="0" y1="35" x2="100" y2="35" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <motion.polyline
                  fill="none"
                  stroke="var(--accent-cyan)"
                  strokeWidth="2"
                  points={item.points}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                <motion.circle 
                  cx="100" 
                  cy={item.points.split(' ').pop()?.split(',')[1]} 
                  r="3" 
                  fill="var(--accent-purple)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: 1.5, duration: 0.3 }}
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
