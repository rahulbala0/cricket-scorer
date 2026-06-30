import { useState } from "react";
import ExtraInput from "./ExtraInput.jsx";
import WicketInput from "./WicketInput.jsx";

export default function BallInput({ onRuns, onExtra, onWicket }) {
  const [mode, setMode] = useState("runs");

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: "0.5rem" }}>
        {["runs", "extra", "wicket"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              flex: 1,
              fontSize: 13,
              background: mode === m ? "var(--surface-1)" : undefined,
              borderColor: mode === m ? "var(--border-strong)" : undefined,
            }}
          >
            {m === "runs" ? "Runs" : m === "extra" ? "Extra" : "Wicket"}
          </button>
        ))}
      </div>

      {mode === "runs" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
          {[0, 1, 2, 3, 4, 5, 6].map((r) => (
            <button key={r} onClick={() => onRuns(r)} style={{ fontWeight: 500 }}>
              {r}
            </button>
          ))}
        </div>
      )}

      {mode === "extra" && <ExtraInput onExtra={onExtra} />}

      {mode === "wicket" && <WicketInput onWicket={onWicket} />}
    </div>
  );
}
