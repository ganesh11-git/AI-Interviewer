from final_evaluation import aggregate_final_score

knowledge = {"knowledge_score": 72.5}
fluency = 68.0
tone = {"tone": "Confident", "confidence": 0.8}
resume = {"resume_match_score": 75.0}

print(aggregate_final_score(knowledge, fluency, tone, resume))