/* ==========================================================================
   DASHBOARD
   Aktuelle Woche: Kachel-Übersicht
   Verlauf: Mini-Trend (letzte 8 Wochen)
   ========================================================================== */

import React, { useMemo } from "react";
import {
  TEAM_MEMBERS,
  DIMENSIONS,
  DimensionKey,
  getTrafficColor,
} from "@/lib/types";
import {
  getAllEntries,
  getCurrentWeek,
  getLast8Weeks,
} from "@/lib/storage";
import { DimensionIconSmall } from "./DimensionSelectors";

const trafficHsl: Record<string, string> = {
  red: "hsl(0, 70%, 55%)",
  orange: "hsl(35, 90%, 55%)",
  green: "hsl(145, 55%, 42%)",
};

const trafficBg: Record<string, string> = {
  red: "hsl(0, 70%, 95%)",
  orange: "hsl(35, 90%, 93%)",
  green: "hsl(145, 55%, 93%)",
};

interface DashboardProps {
  refreshKey: number;
}

const Dashboard: React.FC<DashboardProps> = ({ refreshKey }) => {
  const currentWeek = getCurrentWeek();
  const weeks = useMemo(() => getLast8Weeks(currentWeek), [currentWeek]);
  const entries = useMemo(() => getAllEntries(), [refreshKey]);

  const getVal = (person: string, week: string, dim: DimensionKey): number | null => {
    const e = entries.find((x) => x.person === person && x.week === week);
    return e ? (e.dimensions[dim] ?? null) : null;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
      {/* Current Week Overview */}
      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">
          Aktuelle Woche – KW {currentWeek.split("-W")[1]}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr>
                <th className="text-left py-2 pr-2 text-muted-foreground font-medium text-xs">Person</th>
                {DIMENSIONS.map((d) => (
                  <th key={d.key} className="text-center py-2 px-1 text-muted-foreground font-medium text-xs">
                    {d.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TEAM_MEMBERS.map((person) => (
                <tr key={person} className="border-t border-border">
                  <td className="py-3 pr-2 font-medium text-foreground">{person}</td>
                  {DIMENSIONS.map((dim) => {
                    const val = getVal(person, currentWeek, dim.key);
                    if (val === null) {
                      return (
                        <td key={dim.key} className="text-center py-3 px-1">
                          <span className="text-muted-foreground text-xs">–</span>
                        </td>
                      );
                    }
                    const color = getTrafficColor(dim, val);
                    return (
                      <td key={dim.key} className="text-center py-3 px-1">
                        <div
                          className="inline-flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg"
                          style={{ backgroundColor: trafficBg[color] }}
                        >
                          <DimensionIconSmall dimKey={dim.key} value={val} />
                          <span className="text-[10px] font-medium" style={{ color: trafficHsl[color] }}>
                            {dim.key === "auslastung" ? `${val}/10` : `${val}/5`}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Notes */}
      <section>
        <h3 className="text-sm font-bold text-foreground mb-2">Notizen diese Woche</h3>
        <div className="space-y-2">
          {TEAM_MEMBERS.map((person) => {
            const e = entries.find((x) => x.person === person && x.week === currentWeek);
            if (!e?.notiz) return null;
            return (
              <div key={person} className="card-elevated text-sm">
                <span className="font-medium text-foreground">{person}:</span>{" "}
                <span className="text-muted-foreground italic">„{e.notiz}"</span>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

/* ---------- Mini-Trend-Chart (SVG) ---------- */

const MiniTrend: React.FC<{
  label: string;
  dimKey: string;
  max: number;
  weeks: string[];
  values: (number | null)[];
}> = ({ label, dimKey, max, weeks, values }) => {
  const w = 140;
  const h = 50;
  const padX = 8;
  const padY = 6;

  const points = values
    .map((v, i) => {
      if (v === null) return null;
      const x = padX + (i / Math.max(weeks.length - 1, 1)) * (w - 2 * padX);
      const y = padY + ((max - v) / Math.max(max - 1, 1)) * (h - 2 * padY);
      return { x, y, v };
    })
    .filter(Boolean) as { x: number; y: number; v: number }[];

  return (
    <div className="card-elevated p-2">
      <div className="text-[10px] text-muted-foreground font-medium mb-1">{label}</div>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} aria-label={`${label} Trend`}>
        <line x1={padX} y1={h / 2} x2={w - padX} y2={h / 2} stroke="hsl(210,15%,90%)" strokeWidth="1" />
        {points.length > 1 && (
          <polyline
            points={points.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none" stroke="hsl(172,50%,45%)" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
          />
        )}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="hsl(172,50%,40%)" />
        ))}
      </svg>
    </div>
  );
};

export default Dashboard;
