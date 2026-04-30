"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Clock, Landmark } from "lucide-react";
import styles from "./VotingMethods.module.css";

const METHODS = [
  {
    id: "mail",
    Icon: Mail,
    title: "Vote by Mail",
    tag: "Most Flexible",
    tagColor: "cyan",
    pros: ["Vote from home, any time", "No wait lines", "Allows careful research before marking"],
    cons: ["Must request early", "Return tracking varies by state", "Delivery risks if mailed too late"],
    tip: "Request your ballot at least 2 weeks before Election Day.",
  },
  {
    id: "early",
    Icon: Clock,
    title: "Early In-Person",
    tag: "Low Hassle",
    tagColor: "purple",
    pros: ["Shorter lines than Election Day", "Private, in-person experience", "Immediate confirmation"],
    cons: ["Limited early voting dates by state", "Need to visit a specific location"],
    tip: "Check your state's early voting window — often 2–3 weeks before Election Day.",
  },
  {
    id: "inperson",
    Icon: Landmark,
    title: "Election Day",
    tag: "Traditional",
    tagColor: "white",
    pros: ["Familiar, well-established process", "Day-of access if you missed mail-in", "Community experience"],
    cons: ["Potential wait times", "Must vote only at your assigned precinct"],
    tip: "Bring your ID and your sample ballot. Polls are open 7 AM – 8 PM in most states.",
  },
];

export default function VotingMethods() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>How Would You Like to Vote?</h4>
      <p className={styles.subtitle}>Compare your options — all methods are equally valid.</p>

      <div className={styles.grid}>
        {METHODS.map(({ id, Icon, title, tag, tagColor, pros, cons, tip }) => (
          <motion.button
            key={id}
            className={`${styles.card} ${active === id ? styles.cardActive : ""}`}
            onClick={() => setActive(active === id ? null : id)}
            layout
            aria-expanded={active === id}
            aria-controls={`method-detail-${id}`}
          >
            <div className={styles.cardHeader}>
              <div className={styles.iconWrap}>
                <Icon size={18} className={styles.icon} />
              </div>
              <div className={styles.cardTitles}>
                <span className={styles.cardTitle}>{title}</span>
                <span className={`${styles.tag} ${styles[`tag_${tagColor}`]}`}>{tag}</span>
              </div>
            </div>

            <AnimatePresence>
              {active === id && (
                <motion.div
                  id={`method-detail-${id}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className={styles.cardBody}
                  role="region"
                >
                  <div className={styles.listsRow}>
                    <div className={styles.listCol}>
                      <span className={styles.listLabel}>Advantages</span>
                      {pros.map(p => <p key={p} className={styles.proItem}>↑ {p}</p>)}
                    </div>
                    <div className={styles.listCol}>
                      <span className={styles.listLabel}>Consider</span>
                      {cons.map(c => <p key={c} className={styles.conItem}>· {c}</p>)}
                    </div>
                  </div>
                  <div className={styles.tipBox}>
                    <span className={styles.tipLabel}>Tip</span>
                    <p className={styles.tipText}>{tip}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
