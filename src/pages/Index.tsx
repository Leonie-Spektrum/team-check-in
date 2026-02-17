import React, { useState, useCallback } from "react";
import CheckIn from "@/components/CheckIn";
import Dashboard from "@/components/Dashboard";

const Index: React.FC = () => {
  const [tab, setTab] = useState<"checkin" | "dashboard">("checkin");
  const [refreshKey, setRefreshKey] = useState(0);

  const goToDashboard = useCallback(() => {
    setRefreshKey((k) => k + 1);
    setTab("dashboard");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-10 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-2">
          <span className="text-sm font-bold text-foreground tracking-tight">
            Team Weekly
          </span>
          <div className="flex gap-1 bg-secondary rounded-lg p-0.5">
            <button
              onClick={() => setTab("checkin")}
              className={`tab-button ${tab === "checkin" ? "active" : ""}`}
              aria-label="Zur Eingabe wechseln"
            >
              Eingabe
            </button>
            <button
              onClick={goToDashboard}
              className={`tab-button ${tab === "dashboard" ? "active" : ""}`}
              aria-label="Zum Dashboard wechseln"
            >
              Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main>
        {tab === "checkin" ? (
          <CheckIn onComplete={goToDashboard} />
        ) : (
          <Dashboard refreshKey={refreshKey} />
        )}
      </main>
    </div>
  );
};

export default Index;
