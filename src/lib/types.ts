/* ==========================================================================
   DATENMODELL – Team Weekly Check-in
   
   Speicherformat in localStorage:
   Key: "team-weekly-data"
   Value: CheckInEntry[] (JSON-Array)
   
   Kalenderwoche-Format: "YYYY-Www" (z.B. "2026-W08")
   ========================================================================== */

/** Die 3 konfigurierbaren Teammitglieder */
export const TEAM_MEMBERS = ["Leonie", "Moritz", "Tobias"];

/** Die Dimensions-Keys */
export type DimensionKey =
  | "auslastung"
  | "stress"
  | "energie"
  | "zufriedenheit"
  | "aufgabenart"
  | "klarheit"
  | "teamSupport"
  | "teamleadX"
  | "teamleadY";

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
    thresholds: [1, 3],
  },
  {
    key: "zufriedenheit",
    label: "Arbeitsqualität",
    question: "Wie zufrieden bist du mit der Qualität deiner Arbeit?",
    min: 1,
    max: 5,
    thresholds: [1, 3],
  },
  {
    key: "aufgabenart",
    label: "Aufgabenart",
    question: "Wie zufrieden bist du mit der Art deiner Aufgaben?",
    min: 1,
    max: 5,
    thresholds: [1, 3],
  },
  {
    key: "klarheit",
    label: "Alignment",
    question: "Wie gut sind wir als Team auf unsere Ziele ausgerichtet?",
    min: 1,
    max: 5,
    thresholds: [1, 3],
  },
  {
    key: "teamSupport",
    label: "Team-Support",
    question: "Wie gut fühlst du dich von deinem Team unterstützt?",
    min: 1,
    max: 5,
    thresholds: [1, 3],
  },
  {
    key: "teamleadX",
    label: "TL: Unterstützung",
    question: "Wie viel Unterstützung bekommst du vom Teamlead?",
    min: 1,
    max: 5,
    thresholds: [1, 3],
  },
  {
    key: "teamleadY",
    label: "TL: Bedarf",
    question: "Wie viel mehr Unterstützung brauchst du?",
    min: 1,
    max: 5,
    thresholds: [1, 3], // higher = needs more = worse (invertiert)
  },
];

/** Dimensions shown as individual check-in screens (excludes teamleadY which is on same screen as teamleadX) */
export const CHECKIN_SCREENS: DimensionMeta[] = DIMENSIONS.filter(d => d.key !== "teamleadY");

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
 * Bei "auslastung", "stress" und "teamleadY" ist höher = schlechter (invertiert).
 */
export function getTrafficColor(
  dim: DimensionMeta,
  value: number
): TrafficColor {
  const inverted = dim.key === "auslastung" || dim.key === "stress" || dim.key === "teamleadY";
  if (inverted) {
    if (value <= dim.thresholds[0]) return "green";
    if (value <= dim.thresholds[1]) return "orange";
    return "red";
  }
  if (value <= dim.thresholds[0]) return "red";
  if (value <= dim.thresholds[1]) return "orange";
  return "green";
}
