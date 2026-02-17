/* ==========================================================================
   DATENMODELL – Team Weekly Check-in
   
   Speicherformat in localStorage:
   Key: "team-weekly-data"
   Value: CheckInEntry[] (JSON-Array)
   
   Kalenderwoche-Format: "YYYY-Www" (z.B. "2026-W08")
   ========================================================================== */

/** Die 3 konfigurierbaren Teammitglieder */
export const TEAM_MEMBERS = ["Leonie", "Moritz", "Tobias"];

/** Die 6 Dimensionen mit Metadaten */
export type DimensionKey =
  | "auslastung"
  | "stress"
  | "energie"
  | "zufriedenheit"
  | "klarheit"
  | "teamSupport";

export interface DimensionMeta {
  key: DimensionKey;
  label: string;
  question: string;
  min: number;
  max: number;
  /** Schwellwerte für Ampellogik: [rot-max, orange-max] – darüber = grün */
  thresholds: [number, number];
}

/* ==========================================================================
   SCHWELLENWERTE – Ampellogik
   
   Jede Dimension hat [rot-max, orange-max]:
   - Wert <= rot-max → ROT (kritisch)
   - Wert <= orange-max → ORANGE (Aufmerksamkeit)
   - Wert > orange-max → GRÜN (gut)
   
   Für "auslastung" und "stress" ist die Logik invertiert:
   höherer Wert = schlechter
   ========================================================================== */

export const DIMENSIONS: DimensionMeta[] = [
  {
    key: "auslastung",
    label: "Auslastung",
    question: "Wie hoch ist deine Auslastung diese Woche?",
    min: 1,
    max: 10,
    thresholds: [3, 7], // 1-3 grün, 4-7 orange, 8-10 rot (invertiert)
  },
  {
    key: "stress",
    label: "Stress",
    question: "Wie gestresst fühlst du dich gerade?",
    min: 1,
    max: 5,
    thresholds: [1, 3], // 1 grün, 2-3 orange, 4-5 rot (invertiert)
  },
  {
    key: "energie",
    label: "Energie",
    question: "Wie voll ist dein Energie-Akku?",
    min: 1,
    max: 5,
    thresholds: [1, 3], // 1-1 rot, 2-3 orange, 4-5 grün
  },
  {
    key: "zufriedenheit",
    label: "Zufriedenheit",
    question: "Wie zufrieden bist du mit deiner Arbeit?",
    min: 1,
    max: 5,
    thresholds: [1, 3],
  },
  {
    key: "klarheit",
    label: "Klarheit & Alignment",
    question: "Wie klar ist dir, worauf ihr als Team hinarbeitet?",
    min: 1,
    max: 5,
    thresholds: [1, 3],
  },
  {
    key: "teamSupport",
    label: "Team-Support",
    question: "Wie stark spürst du Unterstützung im Team?",
    min: 1,
    max: 5,
    thresholds: [1, 3],
  },
];

/** Einzelne Check-in-Eingabe */
export interface CheckInEntry {
  person: string;
  week: string; // "YYYY-Www"
  dimensions: Record<DimensionKey, number>;
  notiz: string;
  timestamp: number;
}

/** Ampelfarbe */
export type TrafficColor = "red" | "orange" | "green";

/**
 * Gibt die Ampelfarbe für eine Dimension zurück.
 * Bei "auslastung" und "stress" ist höher = schlechter (invertiert).
 */
export function getTrafficColor(
  dim: DimensionMeta,
  value: number
): TrafficColor {
  const inverted = dim.key === "auslastung" || dim.key === "stress";
  if (inverted) {
    // Higher = worse
    if (value <= dim.thresholds[0]) return "green";
    if (value <= dim.thresholds[1]) return "orange";
    return "red";
  }
  // Higher = better
  if (value <= dim.thresholds[0]) return "red";
  if (value <= dim.thresholds[1]) return "orange";
  return "green";
}
