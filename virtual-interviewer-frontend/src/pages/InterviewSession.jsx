import { useState, useEffect, useRef } from "react";
import ResumeSelector from "../components/ResumeSelector";
import "../styles/interviewSession.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Scene from "../components/Scene";

// GLOBAL speech lock
let speechLock = false;

const InterviewSession = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Load saved config
  const saved = JSON.parse(localStorage.getItem("interviewConfig")) || {};

  const interviewType = state?.interviewType || saved.interviewType || "Technical";
  const difficulty = state?.difficulty || saved.difficulty || "basic";
  const role = state?.role || saved.role || "Software Engineer";
  const duration = state?.duration || saved.duration || "30";

  console.log("SESSION CONFIG:", interviewType, difficulty, role, duration);

  // STATES
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [resumeChosen, setResumeChosen] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // CAMERA
  const videoRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);

  // TIMER
  const durationMinutes = parseInt(duration) || 30;
  const totalTime = durationMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(null);

  // TRANSCRIPT
  const [transcript, setTranscript] = useState([]);
  const saveAnswer = (q, a) => {
    setTranscript((prev) => [...prev, { question: q, answer: a }]);
  };

  // Load voices
  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  // Start timer
  useEffect(() => {
    if (interviewStarted) setTimeLeft(totalTime);
  }, [interviewStarted]);

  // Countdown timer
  useEffect(() => {
    if (!interviewStarted || interviewEnded || timeLeft === null) return;

    if (timeLeft <= 0) {
      alert("⏱️ Interview Time Over!");
      finishInterview();
      return;
    }

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, interviewStarted, interviewEnded]);

  // TEXT TO SPEECH
  const interviewerSpeak = (text) => {
  if (!text || speechLock) return;

  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.9;

  speechLock = true;
  setIsSpeaking(true);

  u.onend = () => {
    speechLock = false;
    setIsSpeaking(false);
  };

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
};

  // SPEECH TO TEXT
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recog = new SpeechRecognition();
    recog.lang = "en-US";
    recog.continuous = true;
    recog.interimResults = true;

    recog.onresult = (e) => {
      let t = "";
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      setAnswer(t);
    };

    recog.onend = () => setListening(false);
    setRecognition(recog);
  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setListening(false);
    }
  };

  // CAMERA FUNCTIONS
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch (err) {
      console.error("Camera Error:", err);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) stream.getTracks().forEach((track) => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  };

  // Auto start camera
  useEffect(() => {
    if (interviewStarted) startCamera();
    return () => stopCamera();
  }, [interviewStarted]);

  // QUESTION PARSER
  const extractQuestion = (data) => {
    return data?.question || "Please introduce yourself.";
  };

  // SUBMIT ANSWER
  const submitAnswer = async () => {
    if (!answer.trim()) return;

    saveAnswer(question, answer);

    const res = await fetch("http://localhost:8001/interview/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    });

    const data = await res.json();

    if (data.done) {
      await finishInterview();
      return;
    }

    const q = extractQuestion(data);
    setQuestion(q);
    setCurrentQuestion(data.current_question || 0);
    setTotalQuestions(data.total_questions || 10);
    setAnswer("");
    setTimeout(() => interviewerSpeak(q), 500);
  };

  // FINAL FEEDBACK
  const finishInterview = async () => {
    setInterviewEnded(true);

    const res = await axios.post("http://localhost:8001/interview/feedback", {
      transcript,
      resume_text: localStorage.getItem("resumeText") || "",
    });

    localStorage.setItem("feedbackReport", JSON.stringify(res.data));
    navigate("/interview/feedback");
  };

  return (
    <>
      {/* RESUME UPLOAD */}
      {!resumeChosen && (
        <ResumeSelector
          onSelect={async (type, extractedText) => {
            setResumeChosen(true);
            localStorage.setItem("resumeText", extractedText);

            const res = await fetch("http://localhost:8001/interview/start", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                resume_text: extractedText,
                interview_type: interviewType,
                difficulty,
                role,
                duration,
              }),
            });

            const data = await res.json();
            const q = extractQuestion(data);

            setQuestion(q);
            setInterviewStarted(true);
            setTimeout(() => interviewerSpeak(q), 500);
          }}
        />
      )}

      {/* INTERVIEW UI */}
      {interviewStarted && (
        <div className="pro-interview-layout">
          <div className="ai-panel">
            <div className="avatar-3d">
              <Scene isSpeaking={isSpeaking} />
              </div>
            <h3>Virtual Interviewer</h3>
            <p>
              {interviewType} • {difficulty} • {role}
            </p>
          </div>

          <div className="question-panel">
            {/* CAMERA BOX */}
            <div className="video-box">
              <video ref={videoRef} autoPlay muted className="camera-video" />
              <span className="video-label">Live Camera</span>
            </div>

            <div className="q-header">
              <h4>
                QUESTION {currentQuestion} / {totalQuestions}
              </h4>
              <div className="timer">
                ⏱{" "}
                {timeLeft
                  ? `${Math.floor(timeLeft / 60)}:${String(
                      timeLeft % 60
                    ).padStart(2, "0")}`
                  : "Starting..."}
              </div>
            </div>

            <div className="q-box">{question}</div>

            <textarea
              className="answer-box"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />

            <button
              className="speak-btn"
              onClick={listening ? stopListening : startListening}
            >
              {listening ? "Stop Mic" : "Speak"}
            </button>

            <button className="submit-btn" onClick={submitAnswer}>
              Submit Answer
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InterviewSession;