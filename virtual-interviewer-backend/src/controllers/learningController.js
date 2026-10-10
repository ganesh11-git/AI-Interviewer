const javaLevel1 = require("../../data/javaLevel1");
// GET all Java topics
exports.getJavaTopics = (req, res) => {
  res.json({
    module: javaLevel1.module,
    topics: javaLevel1.topics.map(t => ({
      slug: t.slug,
      title: t.title
    }))
  });
};


exports.getTopic = async (req, res) => {
  const { topic } = req.body;

  res.json({
    explanation: `This is static explanation for ${topic}`
  });
};
