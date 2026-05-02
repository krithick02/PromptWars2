"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation, MapPin, ExternalLink, AlertCircle, Loader } from "lucide-react";
import { GoogleMapsEmbed } from "@next/third-parties/google";
import styles from "./PollingPlaceMap.module.css";

type Status = "idle" | "locating" | "ready" | "no-key" | "error";

interface Coords { lat: number; lng: number }



function buildDirectionsUrl(coords: Coords) {
  return (
    `https://www.google.com/maps/search/polling+place/@${coords.lat},${coords.lng},13z`
  );
}

export default function PollingPlaceMap() {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const HAS_KEY = API_KEY.length > 10 && API_KEY !== "YOUR_GOOGLE_MAPS_API_KEY_HERE";
  const [status, setStatus]   = useState<Status>(HAS_KEY ? "idle" : "no-key");
  const [coords, setCoords]   = useState<Coords | null>(null);

  const handleLocate = () => {
    if (!navigator.geolocation) { setStatus("error"); return; }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("ready");
      },
      () => setStatus("error"),
      { timeout: 10000 }
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <MapPin size={15} className={styles.icon} />
        <h4 className={styles.title}>Nearest Polling Places</h4>
      </div>

      {/* ── No API Key state ── */}
      {status === "no-key" && (
        <motion.div
          className={styles.stateCard}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          <AlertCircle size={28} className={styles.alertIcon} />
          <p className={styles.stateTitle}>API Key Required</p>
          <p className={styles.stateBody}>
            Add your Google Maps key to{" "}
            <code className={styles.code}>.env.local</code>:
          </p>
          <div className={styles.codeBlock}>
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
          </div>
          <p className={styles.stateBody} style={{ marginTop: "0.5rem" }}>
            Enable <strong>Maps Embed API</strong> in your{" "}
            <a
              href="https://console.cloud.google.com/apis/library/maps-embed-backend.googleapis.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Google Cloud Console ↗
            </a>
          </p>
        </motion.div>
      )}

      {/* ── Idle state ── */}
      {status === "idle" && (
        <motion.div
          className={styles.stateCard}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          <Navigation size={32} className={styles.navIcon} />
          <p className={styles.stateTitle}>Find Your Polling Place</p>
          <p className={styles.stateBody}>
            We'll use your location to show the nearest voting booths on Election Day.
          </p>
          <button className={styles.locateBtn} onClick={handleLocate}>
            <Navigation size={14} /> Use My Location
          </button>
          <p className={styles.privacyNote}>
            Your location is never stored or transmitted to our servers.
          </p>
        </motion.div>
      )}

      {/* ── Locating state ── */}
      {status === "locating" && (
        <motion.div className={styles.stateCard} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          >
            <Loader size={28} className={styles.loaderIcon} />
          </motion.div>
          <p className={styles.stateTitle}>Locating…</p>
          <p className={styles.stateBody}>Requesting your browser location.</p>
        </motion.div>
      )}

      {/* ── Error state ── */}
      {status === "error" && (
        <motion.div className={styles.stateCard} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <AlertCircle size={28} className={styles.alertIcon} />
          <p className={styles.stateTitle}>Location Unavailable</p>
          <p className={styles.stateBody}>
            Please enable location permissions in your browser, then try again.
          </p>
          <button className={styles.locateBtn} onClick={handleLocate}>Retry</button>
        </motion.div>
      )}

      {/* ── Map ready state ── */}
      <AnimatePresence>
        {status === "ready" && coords && (
          <motion.div
            className={styles.mapWrapper}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className={styles.shimmer}></div>

            <GoogleMapsEmbed
              apiKey={API_KEY}
              height={400}
              width="100%"
              mode="search"
              q="polling place voting location"
              center={`${coords.lat},${coords.lng}`}
              zoom="13"
              style="border-radius: 12px; border: none;"
            />
            {/* Action bar below map */}
            <div className={styles.mapActions}>
              <span className={styles.coordText}>
                {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
              </span>
              <div className={styles.actionBtns}>
                <button className={styles.refreshBtn} onClick={handleLocate}>
                  <Navigation size={12} /> Re-locate
                </button>
                <a
                  href={buildDirectionsUrl(coords)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.directionsBtn}
                >
                  Open in Maps <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
