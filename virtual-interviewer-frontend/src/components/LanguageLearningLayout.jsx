import TopicSidebar from "./TopicSidebar";
import TopicContent from "./TopicContent";
import LanguageNavbar from "./LanguageNavbar";

const LanguageLearningLayout = () => {
  return (
    <div>
      <LanguageNavbar />   

      <div style={{ display: "flex" }}>
        <TopicSidebar />
        <TopicContent />
      </div>
    </div>
  );
};

export default LanguageLearningLayout;
