"use client";

import { useState } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./LanguageSelector.module.css";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "zh", name: "中文" },
  { code: "tl", name: "Tagalog" },
  { code: "vi", name: "Tiếng Việt" },
];

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");

  const handleSelect = (code: string) => {
    setCurrentLang(code);
    setIsOpen(false);
    // In a real app, this would trigger a global translation hook/state
    console.log(`Language changed to: ${code}`);
  };

  return (
    <div className={styles.wrapper}>
      <button 
        className={styles.trigger} 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe size={16} />
        <span>{LANGUAGES.find(l => l.code === currentLang)?.name}</span>
        <ChevronDown size={14} className={`${styles.chevron} ${isOpen ? styles.open : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className={styles.dropdown}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            role="listbox"
          >
            {LANGUAGES.map((lang) => (
              <li
                key={lang.code}
                className={`${styles.item} ${currentLang === lang.code ? styles.active : ""}`}
                onClick={() => handleSelect(lang.code)}
                role="option"
                aria-selected={currentLang === lang.code}
              >
                {lang.name}
                {currentLang === lang.code && <Check size={14} />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
