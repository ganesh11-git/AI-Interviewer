from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os


from evaluation.preprocess import extract_text_from_pdf
from evaluation.final_evaluation import evaluate_answer, generate_final_feedback
from evaluation.adaptive_controller import AdaptiveInterviewController

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

controller = None

def get_controller():
    global controller
    if controller is None:
        print("Creating AdaptiveInterviewController...")
        controller = AdaptiveInterviewController()
    return controller


class StartInterviewRequest(BaseModel):
    resume_text: str
    interview_type: str
    difficulty: str
    role: str
    duration: str


class AnswerRequest(BaseModel):
    answer: str


class ResumeRequest(BaseModel):
    file_path: str


class ScoreRequest(BaseModel):
    question: str
    answer: str
    resume_text: str = ""


class FeedbackRequest(BaseModel):
    transcript: list
    resume_text: str = ""


@app.post("/resume/extract")
def extract_resume(req: ResumeRequest):
    try:
        text = extract_text_from_pdf(req.file_path)
        return {"text": text}
    except Exception as e:
        return {"error": str(e)}


@app.post("/interview/start")
def start_interview(req: StartInterviewRequest):
    ctrl = get_controller()
    return ctrl.start_interview(
        resume_text=req.resume_text,
        interview_type=req.interview_type,
        difficulty=req.difficulty,
        role=req.role,
        duration=req.duration
    )



@app.post("/interview/answer")
def submit_answer(req: AnswerRequest):
    ctrl = get_controller()
    return ctrl.process_answer(req.answer)


@app.post("/interview/score")
def score_answer(req: ScoreRequest):
    return evaluate_answer(req.question, req.answer, req.resume_text)


@app.post("/interview/feedback")
def get_final_feedback(req: FeedbackRequest):
    report = generate_final_feedback(req.transcript, req.resume_text)
    return report


@app.post("/resume/upload")
async def upload_resume(file: UploadFile = File(...)):
    os.makedirs("uploads", exist_ok=True)

    file_path = os.path.join("uploads", file.filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    text = extract_text_from_pdf(file_path)
    return {"text": text}