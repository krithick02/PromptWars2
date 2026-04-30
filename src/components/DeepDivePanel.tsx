"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Map, BookOpen, Accessibility, GitCommitHorizontal,
  Users, FileText, Vote, HelpCircle, MapPin
} from "lucide-react";
import styles from "./DeepDivePanel.module.css";

import dynamic from "next/dynamic";

const SpatialJourney      = dynamic(() => import("./SpatialJourney"), { loading: () => <div className={styles.loadingContainer}>Loading Station Map...</div> });
const TerminologyTooltips = dynamic(() => import("./TerminologyTooltips"));
const AccessibilityGuide  = dynamic(() => import("./AccessibilityGuide"));
const VoteLifecycle       = dynamic(() => import("./VoteLifecycle"));
const CommunitySteward    = dynamic(() => import("./CommunitySteward"));
const BallotZip           = dynamic(() => import("./BallotZip"));
const VotingMethods       = dynamic(() => import("./VotingMethods"));
const FAQ                 = dynamic(() => import("./FAQ"));
const PollingPlaceMap     = dynamic(() => import("./PollingPlaceMap"), { loading: () => <div className={styles.loadingContainer}>Initializing Google Maps...</div> });

const TABS = [
  { id: "map",       Icon: MapPin,              label: "Map",       Component: PollingPlaceMap },
  { id: "ballot",    Icon: FileText,            label: "Ballot",    Component: BallotZip },
  { id: "methods",   Icon: Vote,                label: "How to",    Component: VotingMethods },
  { id: "faq",       Icon: HelpCircle,          label: "FAQ",       Component: FAQ },
  { id: "journey",   Icon: Map,                 label: "Station",   Component: SpatialJourney },
  { id: "terms",     Icon: BookOpen,            label: "Terms",     Component: TerminologyTooltips },
  { id: "access",    Icon: Accessibility,       label: "Access",    Component: AccessibilityGuide },
  { id: "lifecycle", Icon: GitCommitHorizontal, label: "Lifecycle", Component: VoteLifecycle },
  { id: "steward",   Icon: Users,               label: "Volunteer", Component: CommunitySteward },
];

export default function DeepDivePanel() {
  const [activeTab, setActiveTab] = useState("map");
  const ActiveComponent = TABS.find(t => t.id === activeTab)?.Component ?? PollingPlaceMap;

  return (
    <motion.div
      className={styles.panel}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Reveal badge */}
      <div className={styles.revealBadge}>
        <span className={styles.revealDot} />
        Advanced Modules Unlocked
      </div>

      {/* Icon tab bar — 3 cols × 3 rows */}
      <div className={styles.tabGrid} role="tablist" aria-label="Educational modules">
        {TABS.map(({ id, Icon, label }) => (
          <button
            key={id}
            id={`tab-${id}`}
            className={`${styles.tab} ${activeTab === id ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(id)}
            role="tab"
            aria-selected={activeTab === id}
            aria-controls={`panel-${id}`}
            title={label}
          >
            <Icon size={14} />
            <span className={styles.tabLabel}>{label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className={styles.content}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={styles.contentInner}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
