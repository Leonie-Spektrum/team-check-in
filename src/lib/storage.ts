/* ==========================================================================
   PERSISTENZ – localStorage
   
   Schlüssel: "team-weekly-data"
   Format: JSON-Array von CheckInEntry
   ========================================================================== */

import { CheckInEntry, TEAM_MEMBERS, DIMENSIONS, DimensionKey } from "./types";

const STORAGE_KEY = "team-weekly-data";

export function getAllEntries(): CheckInEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEntry(entry: CheckInEntry): void {
  const entries = getAllEntries();
  // Überschreiben bei gleicher Person + Woche
  const idx = entries.findIndex(
    (e) => e.person === entry.person && e.week === entry.week
  );
  if (idx >= 0) {
    entries[idx] = entry;
  } else {
    entries.push(entry);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getEntry(
  person: string,
  week: string
): CheckInEntry | undefined {
  return getAllEntries().find((e) => e.person === person && e.week === week);
}

export function getEntriesForPerson(
  person: string,
  weeks: string[]
): (CheckInEntry | undefined)[] {
  const all = getAllEntries();
  return weeks.map((w) => all.find((e) => e.person === person && e.week === w));
}

/** Export als JSON-Datei */
export function exportJSON(): void {
  const data = getAllEntries();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "team-weekly.json";
  a.click();
  URL.revokeObjectURL(url);
}

/** Import aus JSON-Datei */
export function importJSON(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as CheckInEntry[];
        if (!Array.isArray(data)) throw new Error("Invalid format");
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        resolve(data.length);
      } catch (e) {
        reject(e);
      }
    };
    reader.readAsText(file);
  });
}

/* ==========================================================================
   DEMO-DATEN
   Füllt die letzten 8 Wochen mit plausiblen Zufallswerten für alle Personen.
   ========================================================================== */

export function fillDemoData(currentWeek: string): void {
  const weeks = getLast8Weeks(currentWeek);
  const entries: CheckInEntry[] = [];

  for (const person of TEAM_MEMBERS) {
    for (const week of weeks) {
      const dims = {} as Record<DimensionKey, number>;
      for (const d of DIMENSIONS) {
        dims[d.key] =
          Math.floor(Math.random() * (d.max - d.min + 1)) + d.min;
      }
      entries.push({
        person,
        week,
        dimensions: dims,
        notiz:
          Math.random() > 0.5
            ? "Alles gut diese Woche!"
            : "",
        timestamp: Date.now() - Math.random() * 1000000,
      });
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** Berechnet die letzten n Kalenderwochen als "YYYY-Www"-Strings */
export function getLast8Weeks(currentWeek: string): string[] {
  const [yearStr, weekStr] = currentWeek.split("-W");
  let year = parseInt(yearStr);
  let week = parseInt(weekStr);
  const weeks: string[] = [];

  for (let i = 7; i >= 0; i--) {
    let w = week - i;
    let y = year;
    while (w <= 0) {
      y--;
      w += 52; // Simplified; works well enough
    }
    weeks.push(`${y}-W${String(w).padStart(2, "0")}`);
  }
  return weeks;
}

/** Aktuelle Kalenderwoche als "YYYY-Www" */
export function getCurrentWeek(): string {
  const now = new Date();
  const onejan = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.ceil(
    (now.getTime() - onejan.getTime()) / 86400000
  );
  const weekNum = Math.ceil(
    (dayOfYear + onejan.getDay()) / 7
  );
  return `${now.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}
