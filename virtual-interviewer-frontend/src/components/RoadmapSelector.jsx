const roles = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist"];

export default function RoadmapSelector({ selected, setSelected }) {
  return (
    <div className="selector-box">
      <h3>SELECT ROADMAP</h3>

      {roles.map(role => (
        <button
          key={role}
          className={selected === role ? "active" : ""}
          onClick={() => setSelected(role)}
        >
          {role}
        </button>
      ))}
    </div>
  );
}
