import { Navigate } from "react-router-dom";

export default function ProtectedLevel2({ children }) {
  const level = Number(localStorage.getItem("level"));

  if (level < 2) {
    return <Navigate to="/level1/quiz" />;
  }

  return children;
}
