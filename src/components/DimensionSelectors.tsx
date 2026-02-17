/* ==========================================================================
   DIMENSION SELECTORS
   Alle 6 Dimensions-Eingabekomponenten mit inline SVG-Icons
   ========================================================================== */

import React from "react";

interface DimensionProps {
  value: number;
  onChange: (v: number) => void;
}

/* ---------- 1) AUSLASTUNG – Thermometer-Slider (1–10) ---------- */

export const ThermometerSlider: React.FC<DimensionProps> = ({ value, onChange }) => {
  const pct = ((value - 1) / 9) * 100;
  const hue = 172 - (pct / 100) * 172; // teal→red

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="relative w-16 h-48 flex items-end justify-center">
        {/* Thermometer body */}
        <div className="absolute inset-x-4 top-0 bottom-8 rounded-full border-2 border-border bg-secondary overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-300"
            style={{
              height: `${pct}%`,
              backgroundColor: `hsl(${hue}, 70%, 55%)`,
            }}
          />
        </div>
        {/* Bulb */}
        <div
          className="w-12 h-12 rounded-full border-2 border-border transition-colors duration-300"
          style={{ backgroundColor: `hsl(${hue}, 70%, 55%)` }}
        />
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full max-w-[200px] accent-primary"
        aria-label="Auslastung von 1 bis 10"
      />
      <span className="text-2xl font-bold text-foreground">{value} / 10</span>
    </div>
  );
};

/* ---------- 2) STRESS – Wetter-Icons (5 Stufen) ---------- */

const weatherLabels = ["Sonne", "Leicht bewölkt", "Bewölkt", "Regen", "Gewitter"];

const WeatherIcon: React.FC<{ level: number; size?: number }> = ({ level, size = 48 }) => {
  const s = size;
  switch (level) {
    case 1: // Sonne
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <circle cx="24" cy="24" r="10" fill="hsl(45, 90%, 55%)" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1={24 + 14 * Math.cos((angle * Math.PI) / 180)}
              y1={24 + 14 * Math.sin((angle * Math.PI) / 180)}
              x2={24 + 19 * Math.cos((angle * Math.PI) / 180)}
              y2={24 + 19 * Math.sin((angle * Math.PI) / 180)}
              stroke="hsl(45, 90%, 55%)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ))}
        </svg>
      );
    case 2: // Leicht bewölkt
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <circle cx="18" cy="18" r="8" fill="hsl(45, 90%, 55%)" />
          <ellipse cx="28" cy="30" rx="14" ry="9" fill="hsl(210, 15%, 82%)" />
        </svg>
      );
    case 3: // Bewölkt
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <ellipse cx="24" cy="28" rx="16" ry="10" fill="hsl(210, 15%, 75%)" />
          <ellipse cx="20" cy="24" rx="10" ry="7" fill="hsl(210, 15%, 82%)" />
        </svg>
      );
    case 4: // Regen
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <ellipse cx="24" cy="20" rx="14" ry="9" fill="hsl(210, 20%, 70%)" />
          {[16, 24, 32].map((x) => (
            <line key={x} x1={x} y1="32" x2={x - 2} y2="40" stroke="hsl(210, 60%, 55%)" strokeWidth="2" strokeLinecap="round" />
          ))}
        </svg>
      );
    case 5: // Gewitter
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <ellipse cx="24" cy="18" rx="14" ry="9" fill="hsl(220, 20%, 55%)" />
          <polygon points="22,26 26,26 23,34 28,34 20,44 23,36 19,36" fill="hsl(45, 95%, 55%)" />
        </svg>
      );
    default:
      return null;
  }
};

export const WeatherSelect: React.FC<DimensionProps> = ({ value, onChange }) => (
  <div className="flex flex-wrap justify-center gap-3" role="radiogroup" aria-label="Stresslevel wählen">
    {[1, 2, 3, 4, 5].map((level) => (
      <button
        key={level}
        role="radio"
        aria-checked={value === level}
        aria-label={weatherLabels[level - 1]}
        className={`dimension-option ${value === level ? "selected" : ""}`}
        onClick={() => onChange(level)}
      >
        <WeatherIcon level={level} />
        <span className="text-xs mt-1 text-muted-foreground">{weatherLabels[level - 1]}</span>
      </button>
    ))}
  </div>
);

/* ---------- 3) ENERGIE – Batterie (5 Stufen) ---------- */

const energyColors = [
  "hsl(0, 70%, 55%)",    // 20% - rot
  "hsl(20, 80%, 55%)",   // 40% - orange
  "hsl(35, 90%, 55%)",   // 60% - amber
  "hsl(90, 50%, 45%)",   // 80% - hellgrün
  "hsl(145, 55%, 42%)",  // 100% - grün
];
const energyLabels = ["20%", "40%", "60%", "80%", "100%"];

const BatteryIcon: React.FC<{ level: number; size?: number }> = ({ level, size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <rect x="8" y="10" width="28" height="28" rx="4" stroke="hsl(220, 15%, 60%)" strokeWidth="2.5" fill="none" />
    <rect x="36" y="18" width="4" height="12" rx="1" fill="hsl(220, 15%, 60%)" />
    <rect
      x="11"
      y={10 + 28 - (level / 5) * 25}
      width="22"
      height={(level / 5) * 25}
      rx="2"
      fill={energyColors[level - 1]}
    />
  </svg>
);

export const BatterySelect: React.FC<DimensionProps> = ({ value, onChange }) => (
  <div className="flex flex-wrap justify-center gap-3" role="radiogroup" aria-label="Energielevel wählen">
    {[1, 2, 3, 4, 5].map((level) => (
      <button
        key={level}
        role="radio"
        aria-checked={value === level}
        aria-label={`Energie ${energyLabels[level - 1]}`}
        className={`dimension-option ${value === level ? "selected" : ""}`}
        onClick={() => onChange(level)}
      >
        <BatteryIcon level={level} />
        <span className="text-xs mt-1 text-muted-foreground">{energyLabels[level - 1]}</span>
      </button>
    ))}
  </div>
);

/* ---------- 4) ZUFRIEDENHEIT – Pflanzenstadien ---------- */

const plantLabels = ["Welk", "Keim", "Pflanze", "Kräftig", "Blühend"];

const PlantIcon: React.FC<{ level: number; size?: number }> = ({ level, size = 48 }) => {
  const green = `hsl(${100 + level * 10}, ${40 + level * 5}%, ${55 - level * 3}%)`;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {/* Boden */}
      <ellipse cx="24" cy="42" rx="16" ry="4" fill="hsl(30, 40%, 65%)" />
      {/* Stiel */}
      <line x1="24" y1="42" x2="24" y2={42 - level * 6} stroke={green} strokeWidth="2.5" strokeLinecap="round" />
      {level >= 1 && (
        <ellipse cx="24" cy={42 - level * 6} rx={3 + level} ry={2 + level * 0.5} fill={green} opacity="0.7" />
      )}
      {level >= 3 && (
        <>
          <ellipse cx={20} cy={42 - level * 4} rx={4} ry={2.5} fill={green} opacity="0.6" transform="rotate(-20 20 30)" />
          <ellipse cx={28} cy={42 - level * 4} rx={4} ry={2.5} fill={green} opacity="0.6" transform="rotate(20 28 30)" />
        </>
      )}
      {level === 5 && (
        <>
          <circle cx="22" cy="10" r="3" fill="hsl(330, 70%, 60%)" />
          <circle cx="26" cy="8" r="2.5" fill="hsl(340, 65%, 65%)" />
          <circle cx="20" cy="7" r="2" fill="hsl(320, 60%, 55%)" />
        </>
      )}
    </svg>
  );
};

export const PlantSelect: React.FC<DimensionProps> = ({ value, onChange }) => (
  <div className="flex flex-wrap justify-center gap-3" role="radiogroup" aria-label="Zufriedenheit wählen">
    {[1, 2, 3, 4, 5].map((level) => (
      <button
        key={level}
        role="radio"
        aria-checked={value === level}
        aria-label={plantLabels[level - 1]}
        className={`dimension-option ${value === level ? "selected" : ""}`}
        onClick={() => onChange(level)}
      >
        <PlantIcon level={level} />
        <span className="text-xs mt-1 text-muted-foreground">{plantLabels[level - 1]}</span>
      </button>
    ))}
  </div>
);

/* ---------- 5) KLARHEIT – Kompass (5 Stufen) ---------- */

const compassLabels = ["Stark abweichend", "Abweichend", "Leicht daneben", "Fast perfekt", "Perfekt ausgerichtet"];

const CompassIcon: React.FC<{ level: number; size?: number }> = ({ level, size = 48 }) => {
  const rotation = (5 - level) * 35; // 5=0°, 1=140°
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="20" stroke="hsl(210, 15%, 75%)" strokeWidth="2" fill="hsl(210, 20%, 96%)" />
      {/* N marker */}
      <text x="24" y="8" textAnchor="middle" fontSize="7" fill="hsl(0, 70%, 55%)" fontWeight="bold">N</text>
      <g transform={`rotate(${rotation} 24 24)`}>
        <polygon points="24,8 21,24 27,24" fill="hsl(0, 70%, 55%)" />
        <polygon points="24,40 21,24 27,24" fill="hsl(210, 15%, 70%)" />
      </g>
      <circle cx="24" cy="24" r="3" fill="hsl(220, 15%, 50%)" />
    </svg>
  );
};

export const CompassSelect: React.FC<DimensionProps> = ({ value, onChange }) => (
  <div className="flex flex-wrap justify-center gap-3" role="radiogroup" aria-label="Klarheit wählen">
    {[1, 2, 3, 4, 5].map((level) => (
      <button
        key={level}
        role="radio"
        aria-checked={value === level}
        aria-label={compassLabels[level - 1]}
        className={`dimension-option ${value === level ? "selected" : ""}`}
        onClick={() => onChange(level)}
      >
        <CompassIcon level={level} />
        <span className="text-xs mt-1 text-muted-foreground">{compassLabels[level - 1]}</span>
      </button>
    ))}
  </div>
);

/* ---------- 6) TEAM-SUPPORT – Zwei Punkte mit Abstand ---------- */

const supportLabels = ["Weit weg", "Entfernt", "Mittel", "Nah", "Sehr nah"];

const TeamSupportIcon: React.FC<{ level: number; size?: number }> = ({ level, size = 48 }) => {
  const gap = 18 - level * 3; // 5→3, 1→15
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx={24 - gap} cy="24" r="7" fill="hsl(172, 50%, 45%)" />
      <circle cx={24 + gap} cy="24" r="7" fill="hsl(35, 90%, 55%)" />
      {level >= 4 && (
        <line x1={24 - gap + 7} y1="24" x2={24 + gap - 7} y2="24" stroke="hsl(172, 50%, 45%)" strokeWidth="2" strokeDasharray="2,2" />
      )}
    </svg>
  );
};

export const TeamSupportSelect: React.FC<DimensionProps> = ({ value, onChange }) => (
  <div className="flex flex-wrap justify-center gap-3" role="radiogroup" aria-label="Team-Support wählen">
    {[1, 2, 3, 4, 5].map((level) => (
      <button
        key={level}
        role="radio"
        aria-checked={value === level}
        aria-label={supportLabels[level - 1]}
        className={`dimension-option ${value === level ? "selected" : ""}`}
        onClick={() => onChange(level)}
      >
        <TeamSupportIcon level={level} />
        <span className="text-xs mt-1 text-muted-foreground">{supportLabels[level - 1]}</span>
      </button>
    ))}
  </div>
);

/* ---------- Compact icon renderers for dashboard ---------- */

export const DimensionIconSmall: React.FC<{ dimKey: string; value: number }> = ({ dimKey, value }) => {
  switch (dimKey) {
    case "auslastung": {
      const pct = ((value - 1) / 9) * 100;
      const hue = 172 - (pct / 100) * 172;
      return (
        <svg width="28" height="28" viewBox="0 0 48 48" fill="none" aria-label={`Auslastung ${value}/10`}>
          <rect x="18" y="6" width="12" height="32" rx="6" stroke="hsl(210,15%,80%)" strokeWidth="2" fill="none" />
          <rect x="20" y={6 + 32 - (pct / 100) * 30} width="8" height={(pct / 100) * 30} rx="4" fill={`hsl(${hue},70%,55%)`} />
          <circle cx="24" cy="42" r="4" fill={`hsl(${hue},70%,55%)`} />
        </svg>
      );
    }
    case "stress":
      return <WeatherIcon level={value} size={28} />;
    case "energie":
      return <BatteryIcon level={value} size={28} />;
    case "zufriedenheit":
      return <PlantIcon level={value} size={28} />;
    case "klarheit":
      return <CompassIcon level={value} size={28} />;
    case "teamSupport":
      return <TeamSupportIcon level={value} size={28} />;
    default:
      return null;
  }
};
