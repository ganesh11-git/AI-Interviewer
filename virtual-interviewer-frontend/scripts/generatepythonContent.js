import fs from "fs";
import pythonTopics from "../src/data/pythonTopics.js";

function template(topic) {
  return {
    title: topic.toUpperCase(),
    theory: [
      `Python ${topic} is an important concept in programming.`,
      `${topic} is widely used in real-world Python applications.`,
      `Understanding ${topic} helps in writing efficient Python code.`,
      `${topic} is commonly asked in Python interviews.`,
      `Python ${topic} improves programming logic and problem solving.`,
      `${topic} is used in AI, web development, and automation.`,
      `Python ${topic} supports multiple programming paradigms.`,
      `${topic} makes Python powerful and flexible.`,
      `Mastering ${topic} is required for advanced Python developers.`,
      `Python ${topic} is essential for competitive programming.`
    ],
    code: `# Example Python code for ${topic}`
  };
}

const pythonContent = {};
pythonTopics.forEach(t => pythonContent[t] = template(t));

fs.writeFileSync("./src/data/pythonContent.json", JSON.stringify(pythonContent, null, 2));
console.log("Python content generated!");
