import fs from "fs";
import jsTopics from "../src/data/jsTopics.js";

function template(topic) {
  return {
    title: topic.toUpperCase(),
    theory: [
      `JavaScript ${topic} is a fundamental concept in web development.`,
      `${topic} is widely used in frontend and backend development.`,
      `Understanding ${topic} helps in building interactive websites.`,
      `${topic} is asked in JavaScript interviews.`,
      `JavaScript ${topic} is used in React, Node.js, and frameworks.`,
      `${topic} improves logic and programming skills.`,
      `JavaScript ${topic} is essential for full-stack developers.`,
      `${topic} supports asynchronous programming.`,
      `Learning ${topic} is required for modern web apps.`,
      `${topic} makes JavaScript powerful and flexible.`
    ],
    code: `// Example JavaScript code for ${topic}`
  };
}

const jsContent = {};
jsTopics.forEach(t => jsContent[t] = template(t));

fs.writeFileSync("./src/data/jsContent.json", JSON.stringify(jsContent, null, 2));
console.log("JavaScript content generated!");
