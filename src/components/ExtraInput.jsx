import { useState } from "react";

export default function ExtraInput({ onExtra }) {
  const [type, setType] = useState("wide");
  const [runs, setRuns] = useState(0);

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: "0.5rem" }}>
        {[
          { key: "wide", label: "Wide" },
          { key: "noball", label: "No ball" },
          { key: "bye", label: "Bye" },
          { key: "legbye", label: "Leg bye" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setType(t.key)}
            style={{
              flex: 1,
              fontSize: 13,
              background: type === t.key ? "var(--surface-1)" : undefined,
              borderColor: type === t.key ? "var(--border-strong)" : undefined,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>
        Extra runs (in addition to the 1 for wide/no-ball)
      </label>
      <div style={{ display: "flex", gap: 6, marginTop: "0.4rem" }}>
        {[0, 1, 2, 3, 4].map((r) => (
          <button key={r} onClick={() => setRuns(r)} style={{ background: runs === r ? "var(--surface-1)" : undefined }}>
            {r}
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          const base = type === "wide" || type === "noball" ? 1 : 0;
          onExtra(type, base + runs);
        }}
        style={{ width: "100%", marginTop: "0.6rem", fontWeight: 500 }}
      >
        Record {type}
      </button>
    </div>
  );
}
