import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai";
  import fs from "fs";
  import mime from "mime-types";
  
  // Consider storing API key in .env file for security
  const apiKey = "AIzaSyC0bzj6sBK40SAm5nppnRU7odOt_pgDW3U";
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-pro", // ✅ this is correct for "text-only" requests
  });
  
  
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 65536,
    responseModalities: [],
    responseMimeType: "text/plain",
  };
  
  export default async function run(prompt) {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
  
    const result = await chatSession.sendMessage(prompt);
    const candidates = result.response.candidates;
  
    for (let candidate_index = 0; candidate_index < candidates.length; candidate_index++) {
      for (let part_index = 0; part_index < candidates[candidate_index].content.parts.length; part_index++) {
        const part = candidates[candidate_index].content.parts[part_index];
        if (part.inlineData) {
          try {
            const filename = `output_${candidate_index}_${part_index}.${mime.extension(part.inlineData.mimeType)}`;
            fs.writeFileSync(filename, Buffer.from(part.inlineData.data, "base64"));
            console.log(`Output written to: ${filename}`);
          } catch (err) {
            console.error("Error writing file:", err);
          }
        } else if (part.text) {
          console.log("Response text:", part.text);
        }
      }
    }
  }
  
  // Example call
  run("Explain how photosynthesis works.");
  