import re
from PyPDF2 import PdfReader

def extract_text_from_pdf(file_path):
    text = ""
    reader = PdfReader(file_path)

    for page in reader.pages:
        text += page.extract_text() or ""

    return text


def preprocess(text: str) -> dict:
    """
    Light preprocessing for answer evaluation.
    Preserves meaning and structure.
    """

    if not text:
        return {
            "clean_text": "",
            "sentences": [],
            "word_count": 0
        }

    # Normalize
    text = text.lower()
    text = re.sub(r"\s+", " ", text).strip()

    # Sentence split (basic but effective)
    sentences = re.split(r"[.!?]", text)
    sentences = [s.strip() for s in sentences if s.strip()]

    # Remove only non-alphabetic characters (keep spaces)
    clean_text = re.sub(r"[^a-zA-Z\s]", "", text)

    return {
        "clean_text": clean_text,
        "sentences": sentences,
        "word_count": len(clean_text.split())
    }