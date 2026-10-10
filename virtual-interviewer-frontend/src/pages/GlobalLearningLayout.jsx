import { Outlet } from "react-router-dom";
// import LanguageNavbar from "../components/LanguageNavbar";

export default function GlobalLearningLayout() {
  return (
    <div>
      <LanguageNavbar />
      <Outlet />
    </div>
  );
}
