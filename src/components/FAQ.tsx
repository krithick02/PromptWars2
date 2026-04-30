"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ChevronDown } from "lucide-react";
import styles from "./FAQ.module.css";

const FAQS = [
  {
    q: "What if I miss the registration deadline?",
    a: "Many states offer Same-Day Registration (SDR) at the polls. Check your state's rules — 21 states plus D.C. allow it. You may also be eligible for Conditional Voter Registration."
  },
  {
    q: "Can I be turned away at the polls?",
    a: "You cannot be turned away without being offered a provisional ballot. Federal law requires poll workers to provide one if your eligibility is in question. Cast it, then follow up within 3 days."
  },
  {
    q: "Is my mail-in ballot confidential?",
    a: "Yes. Your name is on the outer envelope only for signature verification. The inner ballot sleeve is separated before counting — no one can connect your identity to your selections."
  },
  {
    q: "What happens if I make a mistake on my ballot?",
    a: "At an in-person polling place, ask for a spoiled ballot and a new one. For mail-in ballots, contact your county elections office immediately — they can issue a replacement if the deadline hasn't passed."
  },
  {
    q: "Can my employer punish me for voting?",
    a: "In almost all states, it's illegal for employers to penalize, threaten, or intimidate employees for their voting choices or for taking time off to vote."
  },
  {
    q: "How do I know my vote was counted?",
    a: "Most states offer a ballot tracking system via the Secretary of State website. You can verify your ballot was received, accepted, and counted, usually within 2 weeks after Election Day."
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <MessageCircle size={15} className={styles.icon} />
        <h4 className={styles.title}>Common Questions</h4>
      </div>
      <p className={styles.subtitle}>Answers to what voters ask most.</p>

      <div className={styles.list}>
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}>
              <button 
                className={styles.question} 
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${i}`}
              >
                <span className={styles.qText}>{faq.q}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDown size={13} className={styles.chevron} />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    id={`faq-answer-${i}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={styles.answer}
                    role="region"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
