import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Home from "./pages/Home";
import Profile from "./pages/Profile";

import Careers from "./pages/Careers/Careers";
import CareerDetail from "./pages/Careers/CareerDetail";
import CareerAdvisor from "./pages/CareerAdvisor/CareerAdvisor";

import Practice from "./pages/Practice";
import TestList from "./pages/TestList";
import TestPage from "./pages/TestPage";
import LevelTests from "./pages/LevelTests";
import LevelQuiz from "./pages/Level1Quiz";

import BehavioralPage from "./pages/BehavioralPage";
import CodingTestPage from "./pages/CodingTestPage";
import CoreCSConceptsPage from "./pages/CoreCSConceptsPage";
import SystemDesignPage from "./pages/SystemDesignPage";
import HRQuestionsPage from "./pages/HRQuestionsPage";

import AmazonTestListPage from "./pages/AmazonTestListPage";
import AmazonCodingTestPage from "./pages/AmazonCodingTestPage";
import GoogleTestList from "./pages/GoogleTestList";
import GoogleCodingTestPage from "./pages/GoogleCodingTestPage";
import MicrosoftTestListPage from "./pages/MicrosoftTestListPage";
import MicrosoftCodingTestPage from "./pages/MicrosoftCodingTestPage";
import MetaTestListPage from "./pages/MetaTestListPage";
import MetaCodingTestPage from "./pages/MetaCodingTestPage";
import AppleTestListPage from "./pages/AppleTestListPage";
import AppleCodingTestPage from "./pages/AppleCodingTestPage";
import NetflixTestListPage from "./pages/NetflixTestListPage";
import NetflixCodingTestPage from "./pages/NetflixCodingTestPage";

import Interviewer from "./pages/Interviewer";
import InterviewSession from "./pages/InterviewSession";
import InterviewFeedback from "./pages/InterviewerFeedback";

import Roadmap from "./pages/Roadmap";
import AIRoadmap from "./pages/AIRoadmap";
import AIRoadmapView from "./pages/AIRoadmapView";

import PrivateRoute from "./components/PrivateRoute";
import Interviewer_3d from "./components/Interviewer_3d";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Practice Module */}
        {/* Practice Module */}
<Route path="/practice" element={<Practice />} />

<Route path="/practice/tests" element={<TestList />} />
<Route path="/practice/tests/:testId" element={<TestPage />} />

<Route path="/practice/levels" element={<LevelTests />} />
<Route path="/practice/levels/:levelId" element={<LevelQuiz />} />

<Route path="/practice/algorithms" element={<CodingTestPage />} />
<Route path="/practice/data-structures" element={<CodingTestPage />} />
<Route path="/practice/coding-patterns" element={<CodingTestPage />} />

<Route path="/practice/system-design" element={<SystemDesignPage />} />
<Route path="/practice/behavioral" element={<BehavioralPage />} />
<Route path="/practice/cs-core" element={<CoreCSConceptsPage />} />
<Route path="/practice/hr" element={<HRQuestionsPage />} />

        {/* Company Coding Tests */}
        <Route path="/practice/google" element={<GoogleTestList />} />
        <Route path="/practice/google/:testId" element={<GoogleCodingTestPage />} />

        <Route path="/practice/amazon" element={<AmazonTestListPage />} />
        <Route path="/practice/amazon/:testId" element={<AmazonCodingTestPage />} />

        <Route path="/practice/microsoft" element={<MicrosoftTestListPage />} />
        <Route path="/practice/microsoft/:testId" element={<MicrosoftCodingTestPage />} />

        <Route path="/practice/meta" element={<MetaTestListPage />} />
        <Route path="/practice/meta/:testId" element={<MetaCodingTestPage />} />

        <Route path="/practice/apple" element={<AppleTestListPage />} />
        <Route path="/practice/apple/:testId" element={<AppleCodingTestPage />} />

        <Route path="/practice/netflix" element={<NetflixTestListPage />} />
        <Route path="/practice/netflix/:testId" element={<NetflixCodingTestPage />} />

        {/* Interviewer */}
        <Route path="/interview_3d" element={<Interviewer_3d/>}/>
        <Route path="/interviewer" element={<Interviewer />} />
        <Route path="/interview/session" element={<InterviewSession />} />
        <Route path="/interview/feedback" element={<InterviewFeedback />} />

        {/* Roadmaps */}
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/ai-roadmap" element={<AIRoadmap />} />
        <Route path="/ai-roadmap/view" element={<AIRoadmapView />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Career Pages */}
        <Route path="/careers" element={<Careers />} />
        <Route path="/careers/:id" element={<CareerDetail />} />
        <Route path="/career-advisor" element={<CareerAdvisor />} />

        {/* 404 */}
        <Route path="*" element={<h1 style={{ color: "cyan" }}>404 - Page Not Found</h1>} />

      </Routes>
    </BrowserRouter>
  );
}