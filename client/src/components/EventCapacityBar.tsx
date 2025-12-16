type Props = {
  current: number;
  capacity: number;
};

export default function EventCapacityBar({ current, capacity }: Props) {
  const percentage = Math.min((current / capacity) * 100, 100);

  return (
    <div>
      <div style={{ fontSize: "12px", marginBottom: "4px" }}>
        {current} / {capacity} slots filled
      </div>

      <div style={{ background: "#e5e7eb", height: "6px", borderRadius: "4px" }}>
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            borderRadius: "4px",
            background:
              percentage < 70
                ? "#22c55e"
                : percentage < 90
                ? "#facc15"
                : "#ef4444",
          }}
        />
      </div>
    </div>
  );
}
