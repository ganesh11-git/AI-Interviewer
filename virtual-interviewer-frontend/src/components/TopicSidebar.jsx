import { NavLink, useParams } from "react-router-dom";
import { topicsMap } from "../data/languageMap";

export default function TopicSidebar() {
  const { language } = useParams();
  const topics = topicsMap[language] || [];

  return (
    <div className="topic-sidebar">
      {topics.map((t) => (
        <NavLink key={t.slug} to={`/learning/${language}/${t.slug}`}>
          {t.title}
        </NavLink>
      ))}
    </div>
  );
}
