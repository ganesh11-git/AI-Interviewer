import fs from "fs";
import javaTopics from "../src/data/javaTopics.js";

// template function
function createTemplate(topic) {
  return {
    title: topic.toUpperCase(),
    theory: `
This topic explains ${topic} in Java.
${topic} is an important concept in programming.
Understanding ${topic} is required for Java developers.
${topic} is widely used in real-world applications.
This topic is commonly asked in interviews.
Learning ${topic} improves programming skills.
`,
    code: `// Example code for ${topic}`
  };
}

const javaContent = {};

// loop through topics and generate content
javaTopics.forEach(topic => {
  javaContent[topic] = createTemplate(topic);
});

// save file
fs.writeFileSync(
  "./src/data/javaContent.json",
  JSON.stringify(javaContent, null, 2)
);

console.log("Java content generated successfully!");
