import fs from "fs";
import cppTopics from "../src/data/cppTopics.js";

function template(topic) {
  return {
    title: topic.toUpperCase(),
    theory: [
      `C++ ${topic} is a core programming concept.`,
      `${topic} is widely used in system programming.`,
      `Understanding ${topic} improves C++ coding skills.`,
      `${topic} is asked in technical interviews.`,
      `C++ ${topic} is used in game engines and OS development.`,
      `${topic} improves memory and performance understanding.`,
      `C++ ${topic} supports object-oriented programming.`,
      `${topic} is used in competitive programming.`,
      `Learning ${topic} is essential for C++ developers.`,
      `${topic} helps in writing efficient C++ programs.`
    ],
    code: `// Example C++ code for ${topic}`
  };
}

const cppContent = {};
cppTopics.forEach(t => cppContent[t] = template(t));

fs.writeFileSync("./src/data/cppContent.json", JSON.stringify(cppContent, null, 2));
console.log("C++ content generated!");
