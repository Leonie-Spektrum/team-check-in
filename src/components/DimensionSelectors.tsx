/* ==========================================================================
   DIMENSION SELECTORS
   Alle Dimensions-Eingabekomponenten mit inline SVG-Icons
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
        <div className="absolute inset-x-4 top-0 bottom-8 rounded-full border-2 border-border bg-secondary overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-300"
            style={{ height: `${pct}%`, backgroundColor: `hsl(${hue}, 70%, 55%)` }}
          />
        </div>
        <div
          className="w-12 h-12 rounded-full border-2 border-border transition-colors duration-300"
          style={{ backgroundColor: `hsl(${hue}, 70%, 55%)` }}
        />
      </div>
      <input
        type="range" min={1} max={10} value={value}
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
    case 1:
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <circle cx="24" cy="24" r="10" fill="hsl(45, 90%, 55%)" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line key={angle}
              x1={24 + 14 * Math.cos((angle * Math.PI) / 180)} y1={24 + 14 * Math.sin((angle * Math.PI) / 180)}
              x2={24 + 19 * Math.cos((angle * Math.PI) / 180)} y2={24 + 19 * Math.sin((angle * Math.PI) / 180)}
              stroke="hsl(45, 90%, 55%)" strokeWidth="2.5" strokeLinecap="round"
            />
          ))}
        </svg>
      );
    case 2:
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <circle cx="18" cy="18" r="8" fill="hsl(45, 90%, 55%)" />
          <ellipse cx="28" cy="30" rx="14" ry="9" fill="hsl(210, 15%, 82%)" />
        </svg>
      );
    case 3:
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <ellipse cx="24" cy="28" rx="16" ry="10" fill="hsl(210, 15%, 75%)" />
          <ellipse cx="20" cy="24" rx="10" ry="7" fill="hsl(210, 15%, 82%)" />
        </svg>
      );
    case 4:
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <ellipse cx="24" cy="20" rx="14" ry="9" fill="hsl(210, 20%, 70%)" />
          {[16, 24, 32].map((x) => (
            <line key={x} x1={x} y1="32" x2={x - 2} y2="40" stroke="hsl(210, 60%, 55%)" strokeWidth="2" strokeLinecap="round" />
          ))}
        </svg>
      );
    case 5:
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
      <button key={level} role="radio" aria-checked={value === level}
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

/* ---------- 3) ENERGIE – Batterie-Slider (1–5, angezeigt als %) ---------- */

const energyColors = [
  "hsl(0, 70%, 55%)",    // 20%
  "hsl(20, 80%, 55%)",   // 40%
  "hsl(35, 90%, 55%)",   // 60%
  "hsl(90, 50%, 45%)",   // 80%
  "hsl(145, 55%, 42%)",  // 100%
];

export const BatterySlider: React.FC<DimensionProps> = ({ value, onChange }) => {
  const pct = (value / 5) * 100;
  const color = energyColors[value - 1] || energyColors[0];

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Battery visual */}
      <div className="relative w-20 h-44 flex flex-col items-center">
        {/* Battery cap */}
        <div className="w-8 h-3 rounded-t-md border-2 border-b-0 border-border bg-secondary" />
        {/* Battery body */}
        <div className="w-20 h-40 rounded-lg border-2 border-border bg-secondary overflow-hidden relative">
          <div
            className="absolute bottom-0 left-0 right-0 transition-all duration-300 rounded-b-md"
            style={{ height: `${pct}%`, backgroundColor: color }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold" style={{ color: pct > 50 ? 'white' : 'hsl(220,15%,40%)' }}>
              {Math.round(pct)}%
            </span>
          </div>
        </div>
      </div>
      <input
        type="range" min={1} max={5} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full max-w-[200px] accent-primary"
        aria-label="Energie-Level von 1 bis 5"
      />
      <span className="text-sm text-muted-foreground">{Math.round(pct)}% Akku</span>
    </div>
  );
};

/* Small battery icon for dashboard */
const BatteryIconSmall: React.FC<{ value: number; size?: number }> = ({ value, size = 28 }) => {
  const pct = (value / 5) * 100;
  const color = energyColors[value - 1] || energyColors[0];
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="8" y="10" width="28" height="28" rx="4" stroke="hsl(220, 15%, 60%)" strokeWidth="2.5" fill="none" />
      <rect x="36" y="18" width="4" height="12" rx="1" fill="hsl(220, 15%, 60%)" />
      <rect x="11" y={10 + 28 - (pct / 100) * 25} width="22" height={(pct / 100) * 25} rx="2" fill={color} />
    </svg>
  );
};

/* ---------- 4) ARBEITSQUALITÄT – Baum-Wachstum (Keim → Blühender Baum) ---------- */

const treeLabels = ["Keim", "Setzling", "Junger Baum", "Kräftiger Baum", "Blühender Baum"];

const TreeIcon: React.FC<{ level: number; size?: number }> = ({ level, size = 48 }) => {
  const green = `hsl(${100 + level * 12}, ${40 + level * 5}%, ${55 - level * 3}%)`;
  const trunk = "hsl(30, 40%, 45%)";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {/* Ground */}
      <ellipse cx="24" cy="44" rx="18" ry="3" fill="hsl(30, 35%, 65%)" />
      {level === 1 && (
        <>
          {/* Seed/Keim */}
          <ellipse cx="24" cy="40" rx="3" ry="2" fill="hsl(30, 50%, 45%)" />
          <path d="M24 40 Q22 36 24 34 Q26 36 24 40" fill="hsl(120, 45%, 50%)" />
        </>
      )}
      {level === 2 && (
        <>
          <line x1="24" y1="44" x2="24" y2="30" stroke={trunk} strokeWidth="2" />
          <ellipse cx="24" cy="28" rx="6" ry="5" fill={green} />
          <ellipse cx="20" cy="34" rx="3" ry="2" fill={green} opacity="0.7" />
        </>
      )}
      {level === 3 && (
        <>
          <line x1="24" y1="44" x2="24" y2="22" stroke={trunk} strokeWidth="3" />
          <line x1="24" y1="30" x2="18" y2="26" stroke={trunk} strokeWidth="2" />
          <line x1="24" y1="28" x2="30" y2="24" stroke={trunk} strokeWidth="2" />
          <ellipse cx="24" cy="18" rx="10" ry="8" fill={green} />
          <ellipse cx="18" cy="24" rx="5" ry="4" fill={green} opacity="0.8" />
          <ellipse cx="30" cy="22" rx="5" ry="4" fill={green} opacity="0.8" />
        </>
      )}
      {level === 4 && (
        <>
          <rect x="22" y="28" width="4" height="16" rx="1" fill={trunk} />
          <line x1="24" y1="34" x2="16" y2="28" stroke={trunk} strokeWidth="2" />
          <line x1="24" y1="32" x2="32" y2="26" stroke={trunk} strokeWidth="2" />
          <ellipse cx="24" cy="18" rx="14" ry="12" fill={green} />
          <ellipse cx="16" cy="24" rx="6" ry="5" fill={green} opacity="0.7" />
          <ellipse cx="32" cy="22" rx="6" ry="5" fill={green} opacity="0.7" />
        </>
      )}
      {level === 5 && (
        <>
          <rect x="22" y="28" width="4" height="16" rx="1" fill={trunk} />
          <line x1="24" y1="34" x2="14" y2="26" stroke={trunk} strokeWidth="2" />
          <line x1="24" y1="32" x2="34" y2="24" stroke={trunk} strokeWidth="2" />
          <ellipse cx="24" cy="16" rx="16" ry="13" fill={green} />
          <ellipse cx="14" cy="22" rx="7" ry="5" fill={green} opacity="0.7" />
          <ellipse cx="34" cy="20" rx="7" ry="5" fill={green} opacity="0.7" />
          {/* Blüten */}
          <circle cx="18" cy="12" r="2.5" fill="hsl(330, 70%, 65%)" />
          <circle cx="28" cy="10" r="2" fill="hsl(340, 65%, 60%)" />
          <circle cx="22" cy="8" r="2" fill="hsl(350, 60%, 70%)" />
          <circle cx="32" cy="14" r="2.5" fill="hsl(320, 60%, 65%)" />
          <circle cx="14" cy="16" r="1.5" fill="hsl(330, 70%, 70%)" />
        </>
      )}
    </svg>
  );
};

export const TreeSelect: React.FC<DimensionProps> = ({ value, onChange }) => (
  <div className="flex flex-wrap justify-center gap-3" role="radiogroup" aria-label="Arbeitsqualität wählen">
    {[1, 2, 3, 4, 5].map((level) => (
      <button key={level} role="radio" aria-checked={value === level}
        aria-label={treeLabels[level - 1]}
        className={`dimension-option ${value === level ? "selected" : ""}`}
        onClick={() => onChange(level)}
      >
        <TreeIcon level={level} />
        <span className="text-xs mt-1 text-muted-foreground">{treeLabels[level - 1]}</span>
      </button>
    ))}
  </div>
);

/* ---------- 5) AUFGABENART – Motivation (5 Stufen) ---------- */

const taskLabels = ["Frustrierend", "Wenig motivierend", "Gemischt", "Herausfordernd", "Sehr motivierend"];
const taskColors = [
  "hsl(0, 60%, 55%)",     // frustrating - red
  "hsl(25, 70%, 55%)",    // low motivation - orange
  "hsl(45, 80%, 50%)",    // mixed - amber
  "hsl(170, 50%, 45%)",   // challenging - teal
  "hsl(145, 55%, 42%)",   // very motivating - green
];

const TaskIcon: React.FC<{ level: number; size?: number }> = ({ level, size = 48 }) => {
  const color = taskColors[level - 1];
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {level === 1 && (
        <>
          {/* Frustrated - storm cloud with X */}
          <ellipse cx="24" cy="20" rx="14" ry="10" fill="hsl(0, 30%, 70%)" />
          <line x1="18" y1="34" x2="22" y2="38" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="22" y1="34" x2="18" y2="38" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="26" y1="34" x2="30" y2="38" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="30" y1="34" x2="26" y2="38" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
      {level === 2 && (
        <>
          {/* Low motivation - drooping arrow */}
          <circle cx="24" cy="24" r="16" fill="none" stroke="hsl(25, 40%, 75%)" strokeWidth="2" />
          <path d="M16 20 L24 30 L32 20" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </>
      )}
      {level === 3 && (
        <>
          {/* Mixed - balance/scale */}
          <line x1="24" y1="10" x2="24" y2="38" stroke="hsl(45, 50%, 50%)" strokeWidth="2" />
          <line x1="12" y1="22" x2="36" y2="22" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="12" cy="22" r="4" fill={color} opacity="0.6" />
          <circle cx="36" cy="22" r="4" fill={color} opacity="0.6" />
          <rect x="20" y="36" width="8" height="4" rx="1" fill="hsl(45, 50%, 50%)" />
        </>
      )}
      {level === 4 && (
        <>
          {/* Challenging - upward arrow with spark */}
          <circle cx="24" cy="24" r="16" fill="none" stroke="hsl(170, 30%, 80%)" strokeWidth="2" />
          <path d="M16 30 L24 16 L32 30" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <line x1="24" y1="16" x2="24" y2="36" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
      {level === 5 && (
        <>
          {/* Very motivating - rocket/star burst */}
          <polygon points="24,6 28,18 40,18 30,26 34,38 24,30 14,38 18,26 8,18 20,18" fill={color} />
          <circle cx="24" cy="22" r="4" fill="hsl(45, 90%, 60%)" />
        </>
      )}
    </svg>
  );
};

export const TaskSelect: React.FC<DimensionProps> = ({ value, onChange }) => (
  <div className="flex flex-wrap justify-center gap-3" role="radiogroup" aria-label="Aufgabenart wählen">
    {[1, 2, 3, 4, 5].map((level) => (
      <button key={level} role="radio" aria-checked={value === level}
        aria-label={taskLabels[level - 1]}
        className={`dimension-option ${value === level ? "selected" : ""}`}
        onClick={() => onChange(level)}
      >
        <TaskIcon level={level} />
        <span className="text-xs mt-1 text-muted-foreground">{taskLabels[level - 1]}</span>
      </button>
    ))}
  </div>
);

/* ---------- 6) KLARHEIT – Kompass (5 Stufen) ---------- */

const compassLabels = ["Stark abweichend", "Abweichend", "Leicht daneben", "Fast perfekt", "Perfekt ausgerichtet"];

const CompassIcon: React.FC<{ level: number; size?: number }> = ({ level, size = 48 }) => {
  const rotation = (5 - level) * 35;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="20" stroke="hsl(210, 15%, 75%)" strokeWidth="2" fill="hsl(210, 20%, 96%)" />
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
  <div className="flex flex-wrap justify-center gap-3" role="radiogroup" aria-label="Alignment wählen">
    {[1, 2, 3, 4, 5].map((level) => (
      <button key={level} role="radio" aria-checked={value === level}
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

/* ---------- 7) TEAM-SUPPORT – Smiley-Logik (5 Stufen) ---------- */

const smileyLabels = ["Gar nicht unterstützt", "Wenig unterstützt", "Teilweise unterstützt", "Gut unterstützt", "Sehr gut unterstützt"];
const smileyColors = [
  "hsl(0, 70%, 55%)",
  "hsl(25, 70%, 55%)",
  "hsl(45, 80%, 50%)",
  "hsl(90, 50%, 45%)",
  "hsl(145, 55%, 42%)",
];

const SmileyIcon: React.FC<{ level: number; size?: number }> = ({ level, size = 48 }) => {
  const color = smileyColors[level - 1];
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="20" fill={color} opacity="0.15" stroke={color} strokeWidth="2" />
      {/* Eyes */}
      {level <= 2 ? (
        <>
          <line x1="16" y1="18" x2="20" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="20" y1="18" x2="16" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="28" y1="18" x2="32" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="32" y1="18" x2="28" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="18" cy="20" r="2.5" fill={color} />
          <circle cx="30" cy="20" r="2.5" fill={color} />
        </>
      )}
      {/* Mouth */}
      {level === 1 && (
        <path d="M16 34 Q24 26 32 34" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      )}
      {level === 2 && (
        <path d="M16 32 Q24 28 32 32" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      )}
      {level === 3 && (
        <line x1="16" y1="30" x2="32" y2="30" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      )}
      {level === 4 && (
        <path d="M16 28 Q24 34 32 28" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      )}
      {level === 5 && (
        <path d="M14 26 Q24 38 34 26" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      )}
    </svg>
  );
};

export const SmileySelect: React.FC<DimensionProps> = ({ value, onChange }) => (
  <div className="flex flex-wrap justify-center gap-3" role="radiogroup" aria-label="Team-Support wählen">
    {[1, 2, 3, 4, 5].map((level) => (
      <button key={level} role="radio" aria-checked={value === level}
        aria-label={smileyLabels[level - 1]}
        className={`dimension-option ${value === level ? "selected" : ""}`}
        onClick={() => onChange(level)}
      >
        <SmileyIcon level={level} />
        <span className="text-xs mt-1 text-muted-foreground leading-tight text-center">{smileyLabels[level - 1]}</span>
      </button>
    ))}
  </div>
);

/* ---------- 8) TEAMLEAD-SUPPORT – 2D Koordinatensystem ---------- */

interface CoordinateProps {
  valueX: number;
  valueY: number;
  onChangeX: (v: number) => void;
  onChangeY: (v: number) => void;
}

const xLabels = ["Sehr wenig", "Wenig", "Mittel", "Viel", "Sehr viel"];
const yLabels = ["Passt so", "Etwas mehr", "Mehr", "Deutlich mehr", "Viel mehr"];

export const TeamleadCoordinate: React.FC<CoordinateProps> = ({ valueX, valueY, onChangeX, onChangeY }) => {
  const gridSize = 260;
  const pad = 40;
  const innerSize = gridSize - 2 * pad;
  const cellSize = innerSize / 4;

  const dotX = pad + (valueX - 1) * cellSize;
  const dotY = pad + (5 - valueY) * cellSize; // inverted Y (1=bottom, 5=top)

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * gridSize;
    const clickY = ((e.clientY - rect.top) / rect.height) * gridSize;
    
    const newX = Math.round(Math.min(5, Math.max(1, 1 + (clickX - pad) / cellSize)));
    const newYRaw = Math.round(Math.min(5, Math.max(1, 5 - (clickY - pad) / cellSize)));
    
    onChangeX(newX);
    onChangeY(newYRaw);
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <svg
        width="100%" viewBox={`0 0 ${gridSize} ${gridSize}`}
        className="max-w-[300px] cursor-pointer touch-none"
        onClick={handleClick}
        aria-label="Teamlead-Unterstützung Koordinatensystem"
      >
        {/* Background */}
        <rect x={pad} y={pad} width={innerSize} height={innerSize} fill="hsl(210, 20%, 96%)" rx="4" />
        
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <React.Fragment key={i}>
            <line x1={pad + i * cellSize} y1={pad} x2={pad + i * cellSize} y2={pad + innerSize}
              stroke="hsl(210, 15%, 88%)" strokeWidth="1" />
            <line x1={pad} y1={pad + i * cellSize} x2={pad + innerSize} y2={pad + i * cellSize}
              stroke="hsl(210, 15%, 88%)" strokeWidth="1" />
          </React.Fragment>
        ))}
        
        {/* Axes */}
        <line x1={pad} y1={pad + innerSize} x2={pad + innerSize} y2={pad + innerSize} stroke="hsl(220, 15%, 50%)" strokeWidth="2" />
        <line x1={pad} y1={pad} x2={pad} y2={pad + innerSize} stroke="hsl(220, 15%, 50%)" strokeWidth="2" />
        
        {/* X axis labels */}
        <text x={pad} y={gridSize - 6} fontSize="7" fill="hsl(220, 15%, 50%)" textAnchor="middle">Wenig</text>
        <text x={pad + innerSize} y={gridSize - 6} fontSize="7" fill="hsl(220, 15%, 50%)" textAnchor="middle">Viel</text>
        <text x={pad + innerSize / 2} y={gridSize - 0} fontSize="8" fill="hsl(220, 15%, 40%)" textAnchor="middle" fontWeight="bold">
          Unterstützung erhalten
        </text>
        
        {/* Y axis labels */}
        <text x="6" y={pad + innerSize} fontSize="7" fill="hsl(220, 15%, 50%)" textAnchor="start" transform={`rotate(-90, 6, ${pad + innerSize})`}>Passt so</text>
        <text x="6" y={pad + 4} fontSize="7" fill="hsl(220, 15%, 50%)" textAnchor="start" transform={`rotate(-90, 6, ${pad + 4})`}>Viel mehr</text>
        <text x="4" y={pad + innerSize / 2} fontSize="8" fill="hsl(220, 15%, 40%)" textAnchor="middle" fontWeight="bold"
          transform={`rotate(-90, 10, ${pad + innerSize / 2})`}>
          Bedarf
        </text>
        
        {/* Dot */}
        <circle cx={dotX} cy={dotY} r="10" fill="hsl(172, 50%, 45%)" stroke="white" strokeWidth="3" />
        <circle cx={dotX} cy={dotY} r="4" fill="white" />
      </svg>
      <div className="text-xs text-muted-foreground text-center space-y-0.5">
        <div>Erhalten: <strong>{xLabels[valueX - 1]}</strong> · Bedarf: <strong>{yLabels[valueY - 1]}</strong></div>
        <div className="text-[10px]">Klicke ins Feld, um deine Position zu setzen</div>
      </div>
    </div>
  );
};

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
      return <BatteryIconSmall value={value} size={28} />;
    case "zufriedenheit":
      return <TreeIcon level={value} size={28} />;
    case "aufgabenart":
      return <TaskIcon level={value} size={28} />;
    case "klarheit":
      return <CompassIcon level={value} size={28} />;
    case "teamSupport":
      return <SmileyIcon level={value} size={28} />;
    case "teamleadX":
    case "teamleadY":
      return (
        <svg width="28" height="28" viewBox="0 0 48 48" fill="none" aria-label={`${dimKey} ${value}/5`}>
          <rect x="8" y="8" width="32" height="32" rx="4" stroke="hsl(210,15%,80%)" strokeWidth="2" fill="hsl(210,20%,96%)" />
          <text x="24" y="30" textAnchor="middle" fontSize="18" fill="hsl(172,50%,45%)" fontWeight="bold">{value}</text>
        </svg>
      );
    default:
      return null;
  }
};
