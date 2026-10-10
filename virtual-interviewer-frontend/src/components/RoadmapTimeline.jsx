import PhaseCard from "./PhaseCard";

export default function RoadmapTimeline({ data, dataState, setData, selected }) {
  return (
    <div className="timeline">
      {data.map((phase, index) => (
        <PhaseCard
          key={index}
          phase={phase}
          phaseIndex={index}
          data={dataState}
          setData={setData}
          selected={selected}
        />
      ))}
    </div>
  );
}
