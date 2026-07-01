const games = [
  { name: "FarmVille", icon: "🌾" },
  { name: "Mafia Wars", icon: "🔫" },
  { name: "Pet Society", icon: "🐾" },
  { name: "Restaurant City", icon: "🍽️" },
  { name: "Texas Hold'em", icon: "🃏" },
  { name: "Café World", icon: "☕" },
  { name: "Bejeweled Blitz", icon: "💎" },
  { name: "FishVille", icon: "🐟" },
  { name: "YoVille", icon: "🏠" },
  { name: "Happy Aquarium", icon: "🐠" },
  { name: "Sorority Life", icon: "💄" },
  { name: "Bubble Island", icon: "🫧" },
];

export default function Sidebar() {
  return (
    <aside className="fb-sidebar">
      <div className="fb-sidebar-header">Juegos</div>
      {games.map((g) => (
        <div key={g.name} className="fb-sidebar-item">
          <span className="fb-sidebar-icon">{g.icon}</span>
          <span>{g.name}</span>
        </div>
      ))}
    </aside>
  );
}