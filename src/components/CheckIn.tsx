/* ==========================================================================
   CHECK-IN FLOW
   Personenauswahl → Dimensions-Screens → Notiz → Zusammenfassung
   ========================================================================== */

import React, { useState, useCallback } from "react";
import { TEAM_MEMBERS, CHECKIN_SCREENS, DIMENSIONS, DimensionKey, CheckInEntry } from "@/lib/types";
import { saveEntry, getCurrentWeek, getEntry } from "@/lib/storage";
import {
  ThermometerSlider,
  WeatherSelect,
  BatterySlider,
  TreeSelect,
  TaskSelect,
  CompassSelect,
  SmileySelect,
  TeamleadCoordinate,
  DimensionIconSmall,
} from "./DimensionSelectors";

interface CheckInProps {
  onComplete: () => void;
}

type Step = "person" | "dimension" | "note" | "summary";

const DEFAULT_VALUES: Record<DimensionKey, number> = {
  auslastung: 5, stress: 3, energie: 3,
  zufriedenheit: 3, aufgabenart: 3, klarheit: 3,
  teamSupport: 3, teamleadX: 3, teamleadY: 1,
};

const CheckIn: React.FC<CheckInProps> = ({ onComplete }) => {
  const currentWeek = getCurrentWeek();
  const [step, setStep] = useState<Step>("person");
  const [person, setPerson] = useState("");
  const [dimIndex, setDimIndex] = useState(0);
  const [values, setValues] = useState<Record<DimensionKey, number>>({ ...DEFAULT_VALUES });
  const [notiz, setNotiz] = useState("");

  const selectPerson = useCallback((name: string) => {
    setPerson(name);
    const existing = getEntry(name, currentWeek);
    if (existing) {
      setValues(existing.dimensions);
      setNotiz(existing.notiz);
    }
    setStep("dimension");
    setDimIndex(0);
  }, [currentWeek]);

  const setDimValue = useCallback((key: DimensionKey, val: number) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  }, []);

  const screens = CHECKIN_SCREENS;

  const nextDim = () => {
    if (dimIndex < screens.length - 1) {
      setDimIndex((i) => i + 1);
    } else {
      setStep("note");
    }
  };

  const prevDim = () => {
    if (dimIndex > 0) {
      setDimIndex((i) => i - 1);
    } else {
      setStep("person");
    }
  };

  const saveAndFinish = () => {
    const entry: CheckInEntry = {
      person, week: currentWeek, dimensions: values,
      notiz, timestamp: Date.now(),
    };
    saveEntry(entry);
    setStep("summary");
  };

  const reset = () => {
    setPerson("");
    setStep("person");
    setDimIndex(0);
    setValues({ ...DEFAULT_VALUES });
    setNotiz("");
  };

  // ---- PERSON SELECT ----
  if (step === "person") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <h2 className="text-2xl font-bold text-foreground">Wer bist du?</h2>
        <p className="text-muted-foreground text-sm">KW {currentWeek.split("-W")[1]} / {currentWeek.split("-W")[0]}</p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {TEAM_MEMBERS.map((name) => (
            <button key={name} onClick={() => selectPerson(name)}
              className="btn-primary text-lg py-4" aria-label={`Check-in als ${name}`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ---- DIMENSION SCREEN ----
  if (step === "dimension") {
    const dim = screens[dimIndex];

    const renderSelector = () => {
      switch (dim.key) {
        case "auslastung":
          return <ThermometerSlider value={values.auslastung} onChange={(v) => setDimValue("auslastung", v)} />;
        case "stress":
          return <WeatherSelect value={values.stress} onChange={(v) => setDimValue("stress", v)} />;
        case "energie":
          return <BatterySlider value={values.energie} onChange={(v) => setDimValue("energie", v)} />;
        case "zufriedenheit":
          return <TreeSelect value={values.zufriedenheit} onChange={(v) => setDimValue("zufriedenheit", v)} />;
        case "aufgabenart":
          return <TaskSelect value={values.aufgabenart} onChange={(v) => setDimValue("aufgabenart", v)} />;
        case "klarheit":
          return <CompassSelect value={values.klarheit} onChange={(v) => setDimValue("klarheit", v)} />;
        case "teamSupport":
          return <SmileySelect value={values.teamSupport} onChange={(v) => setDimValue("teamSupport", v)} />;
        case "teamleadX":
          return (
            <TeamleadCoordinate
              valueX={values.teamleadX} valueY={values.teamleadY}
              onChangeX={(v) => setDimValue("teamleadX", v)}
              onChangeY={(v) => setDimValue("teamleadY", v)}
            />
          );
        default:
          return null;
      }
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <div className="text-sm text-muted-foreground">
          {dimIndex + 1} / {screens.length} · {person}
        </div>
        <h2 className="text-xl font-bold text-foreground text-center max-w-md">
          {dim.key === "teamleadX" ? "Wie viel Unterstützung bekommst du vom Teamlead?" : dim.question}
        </h2>
        <div className="w-full max-w-md">
          {renderSelector()}
        </div>
        <div className="flex gap-3 w-full max-w-xs">
          <button onClick={prevDim} className="btn-secondary flex-1">← Zurück</button>
          <button onClick={nextDim} className="btn-primary flex-1">Weiter →</button>
        </div>
      </div>
    );
  }

  // ---- NOTE ----
  if (step === "note") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <h2 className="text-xl font-bold text-foreground text-center">
          Was brauchst du diese Woche?
        </h2>
        <p className="text-sm text-muted-foreground">Optional · max. 140 Zeichen</p>
        <textarea
          value={notiz}
          onChange={(e) => setNotiz(e.target.value.slice(0, 140))}
          maxLength={140} rows={3}
          className="w-full max-w-md p-3 rounded-xl border border-input bg-card text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="z.B. Mehr Fokuszeit, Feedback zu Projekt X..."
          aria-label="Optionale Notiz"
        />
        <span className="text-xs text-muted-foreground">{notiz.length}/140</span>
        <div className="flex gap-3 w-full max-w-xs">
          <button onClick={() => { setStep("dimension"); setDimIndex(screens.length - 1); }} className="btn-secondary flex-1">
            ← Zurück
          </button>
          <button onClick={saveAndFinish} className="btn-primary flex-1">Speichern ✓</button>
        </div>
      </div>
    );
  }

  // ---- SUMMARY ----
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <div className="text-4xl">✅</div>
      <h2 className="text-xl font-bold text-foreground">Gespeichert!</h2>
      <p className="text-sm text-muted-foreground">{person} · KW {currentWeek.split("-W")[1]}</p>
      <div className="card-elevated w-full max-w-sm">
        <div className="grid grid-cols-3 gap-3">
          {DIMENSIONS.map((dim) => (
            <div key={dim.key} className="flex flex-col items-center gap-1">
              <DimensionIconSmall dimKey={dim.key} value={values[dim.key]} />
              <span className="text-[10px] text-muted-foreground text-center leading-tight">{dim.label}</span>
            </div>
          ))}
        </div>
        {notiz && (
          <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border italic">
            „{notiz}"
          </p>
        )}
      </div>
      <div className="flex gap-3">
        <button onClick={reset} className="btn-secondary">Nächste Person</button>
        <button onClick={onComplete} className="btn-primary">Zum Dashboard</button>
      </div>
    </div>
  );
};

export default CheckIn;
