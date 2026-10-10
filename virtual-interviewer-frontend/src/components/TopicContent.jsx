import { useParams } from "react-router-dom";

const content = {
  intro: "Java is a high-level programming language...",
  variables: "Variables store data values...",
  loops: "Loops repeat code execution...",
  oops: "OOPS stands for Object Oriented Programming...",
  arrays: "Arrays store multiple values..."
};

export default function TopicPage() {
  const { topic } = useParams();
  const data = content[topic] || "Select a topic";

  return (
    <div>
      <h2>{topic?.toUpperCase()}</h2>
      <p>{data}</p>
    </div>
  );
}
