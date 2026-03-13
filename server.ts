import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // AI Result Parsing Endpoint
  app.post("/api/ai/parse-results", async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) return res.status(400).json({ error: "Image data required" });

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: "Extract Free Fire match results from this image. Return a JSON array of objects with 'ign' (In-Game Name), 'kills', and 'placement' (rank). Only return the JSON." },
              { inlineData: { mimeType: "image/png", data: imageBase64 } }
            ]
          }
        ]
      });

      const response = await model;
      const text = response.text;
      
      // Basic JSON extraction
      const jsonMatch = text.match(/\[.*\]/s);
      if (jsonMatch) {
        const results = JSON.parse(jsonMatch[0]);
        res.json({ results });
      } else {
        res.status(500).json({ error: "Could not parse AI response", raw: text });
      }
    } catch (error) {
      console.error("AI Parsing Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
