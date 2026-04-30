"use client";

import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { STATE_DATA } from "./StateSelector";
import styles from "./ElectionCalendar.module.css";

interface Props {
  state: string | null;
}

export default function ElectionCalendar({ state }: Props) {
  const data = state ? STATE_DATA[state] : null;

  const events = data
    ? [
        { label: "Registration Deadline", date: data.reg,         color: "purple" },
        { label: "Early Voting Begins",   date: data.earlyStart,  color: "cyan"   },
        { label: "Election Day",          date: data.electionDay, color: "white"  },
      ]
    : [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <CalendarDays size={15} className={styles.icon} />
        <h3 className={styles.title}>Election Calendar</h3>
      </div>

      {!state ? (
        <p className={styles.empty}>Select your state to see your key dates.</p>
      ) : (
        <motion.div
          className={styles.events}
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {events.map((ev) => (
            <motion.div
              key={ev.label}
              className={styles.event}
              variants={{ hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0 } }}
              transition={{ duration: 0.35 }}
            >
              <span className={`${styles.dot} ${styles[`dot_${ev.color}`]}`} />
              <div className={styles.eventBody}>
                <span className={styles.eventLabel}>{ev.label}</span>
                <span className={styles.eventDate}>{ev.date}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
