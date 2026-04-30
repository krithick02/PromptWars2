"use client";

import { motion, Variants } from "framer-motion";
import { Users, ExternalLink } from "lucide-react";
import styles from "./CommunitySteward.module.css";

const ROLES = [
  { label: "Poll Worker", desc: "Staff a voting location on Election Day.", hours: "6–14 hrs", pay: "Paid" },
  { label: "Election Observer", desc: "Non-partisan monitor of the counting process.", hours: "Flexible", pay: "Volunteer" },
  { label: "Voter Registration Drive", desc: "Help community members register before the deadline.", hours: "2–4 hrs", pay: "Volunteer" },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariant: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function CommunitySteward() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Users size={16} className={styles.icon} />
        <h4 className={styles.title}>Community Steward</h4>
      </div>
      <p className={styles.subtitle}>
        The journey doesn't end at the ballot box. Consider giving back.
      </p>

      <motion.div
        className={styles.rolesList}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {ROLES.map(role => (
          <motion.div key={role.label} className={styles.roleCard} variants={itemVariant}>
            <div className={styles.roleInfo}>
              <span className={styles.roleLabel}>{role.label}</span>
              <span className={styles.roleDesc}>{role.desc}</span>
            </div>
            <div className={styles.roleMeta}>
              <span className={styles.rolePill}>{role.pay}</span>
              <span className={styles.roleHours}>{role.hours}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.a
        href="https://www.usa.gov/election-worker"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.ctaLink}
        whileHover={{ x: 3 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        Learn more <ExternalLink size={12} />
      </motion.a>
    </div>
  );
}
