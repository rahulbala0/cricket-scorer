export default function WicketInput({ onWicket }) {
  const types = ["bowled", "caught", "lbw", "stumped", "run out", "hit wicket"];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}>
      {types.map((t) => (
        <button key={t} onClick={() => onWicket(t)} style={{ fontSize: 13 }}>
          {t}
        </button>
      ))}
    </div>
  );
}
