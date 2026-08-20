import {
  FaFileMedical,
  FaHeartbeat,
  FaHistory,
  FaChartLine,
} from "react-icons/fa";

function QuickStats() {
  const cards = [
    {
      title: "Health Reports",
      value: "12",
      icon: <FaFileMedical />,
      color: "#2563eb",
    },
    {
      title: "Predictions",
      value: "18",
      icon: <FaHeartbeat />,
      color: "#10b981",
    },
    {
      title: "Medical History",
      value: "24",
      icon: <FaHistory />,
      color: "#7c3aed",
    },
    {
      title: "Risk Score",
      value: "Medium",
      icon: <FaChartLine />,
      color: "#f59e0b",
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, index) => (
        <div className="stat-card" key={index}>
          <div
            className="stat-icon"
            style={{ background: card.color }}
          >
            {card.icon}
          </div>

          <h3>{card.value}</h3>

          <p>{card.title}</p>
        </div>
      ))}
    </div>
  );
}

export default QuickStats;