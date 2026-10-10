const ALGO_QUESTIONS = Array.from({ length: 10 }).map(() => ({
  title: "Multi Choice Type Question",
  question: "What is the output of maxRotate([8, 3, 1, 2])?",
  code: `function maxRotate(arr):
    maxSum = -∞
    n = length(arr)
    for k = 0 to n-1:
        rotateRight(arr)
        sum = 0
        for i = 0 to n-1:
            sum += i * arr[i]
        if sum > maxSum:
            maxSum = sum
    return maxSum`,
  options: ["26", "24", "29", "35"],
  correct: 3,
  explanation:
    "After rotating the array in all possible ways, the maximum value is 35.",
}));

const APTITUDE_QUESTIONS = [
  {
    title: "Aptitude Question",
    question: "If a train travels 60 km in 1 hour, how far in 2.5 hours?",
    options: ["120 km", "150 km", "180 km", "200 km"],
    correct: 1,
    explanation: "60 × 2.5 = 150 km",
  },
  {
    title: "Aptitude Question",
    question: "What is 20% of 250?",
    options: ["40", "50", "60", "70"],
    correct: 1,
    explanation: "20% of 250 = 50",
  },
];

export function getMcqQuestions(topic) {
  if (topic === "aptitude") return APTITUDE_QUESTIONS;
  return ALGO_QUESTIONS;
}
