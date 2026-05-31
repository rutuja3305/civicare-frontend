const PRIORITY_STYLES = {
  High:   { bg: "#FCEBEB", color: "#A32D2D", dot: "#E24B4A" },
  Medium: { bg: "#FAEEDA", color: "#854F0B", dot: "#BA7517" },
  Low:    { bg: "#EAF3DE", color: "#3B6D11", dot: "#639922" },
};

const STATUS_STYLES = {
  "Pending":     { bg: "#F1EFE8", color: "#5F5E5A" },
  "In Progress": { bg: "#E6F1FB", color: "#185FA5" },
  "Resolved":    { bg: "#EAF3DE", color: "#3B6D11" },
};

export default function Badge({ label, type = "status" }) {
  const map = type === "priority" ? PRIORITY_STYLES : STATUS_STYLES;
  const s = map[label] || { bg: "#eee", color: "#555" };

  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize: 12, fontWeight: 600,
      padding: "3px 10px", borderRadius: 20,
      display: "inline-flex", alignItems: "center", gap: 5,
    }}>
      {type === "priority" && s.dot && (
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot }} />
      )}
      {label}
    </span>
  );
}