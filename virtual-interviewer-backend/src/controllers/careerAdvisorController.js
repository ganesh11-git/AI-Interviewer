const { getCareerRecommendation } = require("../services/groqService");

exports.askCareerAdvisor = async (req, res) => {
  try {
    const { message } = req.body;

    const aiReply = await getCareerRecommendation(message);

    let result;
    try {
      result = JSON.parse(aiReply); 
    } catch {
      result = { rawText: aiReply };
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Groq AI failed" });
  }
};
