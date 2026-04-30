"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Bot, User, Loader2 } from "lucide-react";
import { askCivicConcierge } from "../lib/gemini";
import styles from "./CivicConcierge.module.css";

export default function CivicConcierge() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    const response = await askCivicConcierge(userMsg);
    setMessages(prev => [...prev, { role: "bot", text: response }]);
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconBox}>
          <Sparkles size={16} className={styles.sparkle} />
        </div>
        <div>
          <h4 className={styles.title}>AI Civic Concierge</h4>
          <p className={styles.subtitle}>Powered by Google Gemini Pro</p>
        </div>
      </div>

      <div className={styles.chatArea}>
        {messages.length === 0 && (
          <div className={styles.empty}>
            <Bot size={32} className={styles.botIcon} />
            <p>Ask me anything about the voting process, registration, or your rights.</p>
          </div>
        )}
        <div className={styles.messageList}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${styles.message} ${m.role === "user" ? styles.userMsg : styles.botMsg}`}
            >
              <div className={styles.msgHeader}>
                {m.role === "user" ? <User size={12} /> : <Bot size={12} />}
                <span>{m.role === "user" ? "You" : "Concierge"}</span>
              </div>
              <p>{m.text}</p>
            </motion.div>
          ))}
          {loading && (
            <div className={`${styles.message} ${styles.botMsg}`}>
              <div className={styles.msgHeader}>
                <Bot size={12} />
                <span>Thinking...</span>
              </div>
              <Loader2 size={16} className={styles.spinner} />
            </div>
          )}
        </div>
      </div>

      <div className={styles.inputRow}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question..."
          className={styles.input}
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className={styles.sendBtn} disabled={loading || !input.trim()}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
