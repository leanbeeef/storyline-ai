import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// serve static files (index.html, css, js) from this folder
app.use(express.static(__dirname));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/evaluate", async (req, res) => {
  try {
    const { text } = req.body;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `Evaluate the following learner text. Give strengths, weaknesses, and one concrete improvement.\n\n${text}`
    });

    const output = response.output_text;
    res.json({ result: output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
});

// fallback to index.html for root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
