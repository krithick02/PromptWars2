"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, AlertCircle } from "lucide-react";
import { z } from "zod";
import styles from "./BallotZip.module.css";

const zipSchema = z.string().length(5).regex(/^\d+$/);

// Mock ballot data keyed by first two digits of ZIP
const BALLOT_DB: Record<string, { title: string; type: string; proSummary: string; conSummary: string }[]> = {
  "90": [ // California
    { title: "Prop 1: Clean Energy Bond", type: "State Proposition", proSummary: "Funds $15B in clean energy infrastructure and jobs.", conSummary: "Increases state debt; critics cite cost overruns risk." },
    { title: "Measure J: Transit Expansion", type: "Local Measure", proSummary: "Expands light rail to underserved neighborhoods.", conSummary: "Raises sales tax by 0.5% for 30 years." },
    { title: "Sheriff — County Race", type: "County Office", proSummary: "Candidates differ on community policing and jail reform.", conSummary: "—" },
  ],
  "78": [ // Texas
    { title: "Prop 3: Property Tax Cap", type: "State Proposition", proSummary: "Limits annual appraisal increases to 5%.", conSummary: "Reduces school district funding over time." },
    { title: "SB 12: Water Infrastructure", type: "State Bond", proSummary: "Allocates $1B for rural water systems.", conSummary: "Adds to state debt obligations." },
  ],
  "10": [ // New York
    { title: "Prop A: Public Safety Fund", type: "City Charter", proSummary: "Dedicated fund for first-responder equipment.", conSummary: "Limits budget flexibility for future administrations." },
    { title: "Rent Stabilization Renewal", type: "Local Measure", proSummary: "Keeps existing tenant protections in place.", conSummary: "Landlord groups argue it reduces housing supply." },
  ],
  "default": [
    { title: "General Election Ballot", type: "Federal Races", proSummary: "U.S. House and Senate seats up for election.", conSummary: "Enter your ZIP for local measures." },
  ],
};

function lookupBallot(zip: string) {
  const prefix = zip.substring(0, 2);
  return BALLOT_DB[prefix] ?? BALLOT_DB["default"];
}

export default function BallotZip() {
  const [zip, setZip]           = useState("");
  const [results, setResults]   = useState<typeof BALLOT_DB["default"] | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const handleSearch = () => {
    const validation = zipSchema.safeParse(zip);
    if (!validation.success) {
      setError("Please enter a valid 5-digit ZIP code.");
      return;
    }
    
    setError(null);
    setLoading(true);
    setResults(null);
    setExpanded(null);
    setTimeout(() => {                     // simulate async lookup
      setResults(lookupBallot(zip));
      setLoading(false);
    }, 600);
  };

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Ballot Simplicity</h4>
      <p className={styles.subtitle}>Enter your ZIP for a non-partisan breakdown.</p>

      <div className={styles.searchRow}>
        <input
          type="text"
          maxLength={5}
          value={zip}
          onChange={e => setZip(e.target.value.replace(/\D/g, ""))}
          placeholder="e.g. 90210"
          className={styles.input}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          aria-label="ZIP code search"
          aria-invalid={!!error}
        />
        <button 
          className={styles.searchBtn} 
          onClick={handleSearch} 
          disabled={zip.length < 5}
          aria-label="Search ballot"
        >
          <Search size={15} />
        </button>
      </div>

      {error && (
        <motion.div 
          className={styles.errorRow}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle size={14} /> {error}
        </motion.div>
      )}

      {loading && (
        <div className={styles.loadingRow} aria-live="polite">
          <motion.span
            className={styles.loadingDot}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span className={styles.loadingText}>Looking up ballot…</span>
        </div>
      )}

      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.resultsList}
          >
            {results.map((item, i) => (
              <div key={i} className={styles.item}>
                <button 
                  className={styles.itemHeader} 
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  aria-expanded={expanded === i}
                  aria-controls={`ballot-detail-${i}`}
                >
                  <div className={styles.itemLeft}>
                    <span className={styles.itemType}>{item.type}</span>
                    <span className={styles.itemTitle}>{item.title}</span>
                  </div>
                  <motion.div animate={{ rotate: expanded === i ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown size={13} className={styles.chevron} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expanded === i && (
                    <motion.div
                      id={`ballot-detail-${i}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className={styles.itemDetail}
                      role="region"
                    >
                      <div className={styles.stance}>
                        <span className={styles.stanceLabel}>YES means</span>
                        <p>{item.proSummary}</p>
                      </div>
                      {item.conSummary !== "—" && (
                        <div className={styles.stance}>
                          <span className={styles.stanceLabelCon}>Concern</span>
                          <p>{item.conSummary}</p>
                        </div>
                      )}
                    </motion.div>
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
