import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json());

  // Initialize server-side Gemini client
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;

  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } else {
    console.warn("WARNING: GEMINI_API_KEY is not defined in the environment.");
  }

  // Health and connection check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      hasApiKey: !!apiKey,
    });
  });

  // POST /api/gemini/scenario
  app.post("/api/gemini/scenario", async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({
          error: "Gemini client is not initialized. Please configure GEMINI_API_KEY in the Secrets panel."
        });
      }

      const { topic } = req.body;
      const userTopic = topic && typeof topic === "string" ? topic.trim() : "a healthy habits experiment";

      console.log(`Generating custom statisticians workbook for topic: "${userTopic}"`);

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are a warm, highly encouraging, and precise Statistician Tutor.
Create a custom real-world research scenario based on the topic: "${userTopic}".
The scenario MUST have exactly two variables, where:
- One variable represents the possible cause or driver (explanatory).
- The other variable represents the outcome or effect (response).
- Ensure at least one variable is Quantitative (numeric magnitude) and at least one variable is Categorical (descriptive classes/groups) OR choose another combination to keep it interesting but extremely clear.
- Formulate a clear research question relating the explanatory to the response variable.
- For each variable, write:
  1. A realistic description.
  2. Four distinct example data points.
  3. Clear reasoning of why it belongs to its type (Quantitative or Categorical).
  4. A Math Test showing whether calculating a physical arithmetic mean (average) of these values makes real-world sense or fails completely (with explanation).
  5. A Visual Analogy comparison (e.g. comparing it to a continuous ruler/thermometer/volumetric scale OR separate colored buckets/bins/shelves).

Output exactly corresponding to the JSON schema. Be highly precise in classification.`,
        config: {
          systemInstruction: "You are an expert Statistician Tutor. Output your response as a valid JSON object matching the requested schema. Ensure that variable classifications correspond to actual mathematical definitions. (Categorical variable can't have physical mathematical averages; Quantitative variable has a physical continuous height/count and calculating average is valid, normal, and represents a real middle state). Ensure the output is strictly valid JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "Short catchy title of the study, e.g. 'The Sleep & Social Media Study'"
              },
              description: {
                type: Type.STRING,
                description: "Fleshed-out background description of the experimental or observational setup"
              },
              researchQuestion: {
                type: Type.STRING,
                description: "A formal research question starting with 'Does...' or 'How does...'"
              },
              variables: {
                type: Type.ARRAY,
                description: "Array of exactly 2 variables",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Name of the variable" },
                    description: { type: Type.STRING, description: "Detailed description of what is measured" },
                    exampleData: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "List of exactly 4 sample data elements"
                    },
                    type: {
                      type: Type.STRING,
                      description: "Must be exactly 'Quantitative' or 'Categorical'"
                    },
                    typeReasoning: { type: Type.STRING, description: "Why it is this type" },
                    mathTest: {
                      type: Type.OBJECT,
                      properties: {
                        question: { type: Type.STRING, description: "Question like 'Can we calculate a meaningful average of these?'" },
                        items: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2 or 3 items to try to average" },
                        explanation: { type: Type.STRING, description: "Explain why it makes sense or fails physically to find the average of these specific words/values" },
                        mathExplanation: { type: Type.STRING, description: "The literal math addition and division representation or a custom error string like 'A + B = error'" },
                        averageAllowed: { type: Type.BOOLEAN, description: "True if average makes physical mathematical sense" }
                      },
                      required: ["question", "items", "explanation", "mathExplanation", "averageAllowed"]
                    },
                    visualAnalogy: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING, description: "Captivating title for the visual, e.g. 'The Sorting Bins'" },
                        analogyText: { type: Type.STRING, description: "The full analogy explaining how to visualize this variable (e.g. measuring tape vs post-it categorizations)" },
                        type: { type: Type.STRING, description: "Must be 'ruler', 'buckets' or 'scale'" },
                        concept: { type: Type.STRING, description: "Short summary of the physical visualization concept" }
                      },
                      required: ["title", "analogyText", "type", "concept"]
                    }
                  },
                  required: ["name", "description", "exampleData", "type", "typeReasoning", "mathTest", "visualAnalogy"]
                }
              },
              explanatoryIndex: {
                type: Type.INTEGER,
                description: "Index of the explanatory variable (0 or 1)"
              },
              responseIndex: {
                type: Type.INTEGER,
                description: "Index of the response variable (0 or 1)"
              },
              driverExplanation: {
                type: Type.STRING,
                description: "Explain why the explanatory variable is the driver or input"
              },
              outcomeExplanation: {
                type: Type.STRING,
                description: "Explain why the response variable is the outcome or result"
              }
            },
            required: [
              "title",
              "description",
              "researchQuestion",
              "variables",
              "explanatoryIndex",
              "responseIndex",
              "driverExplanation",
              "outcomeExplanation"
            ]
          }
        }
      });

      const responseText = response.text || "";
      const scenario = JSON.parse(responseText.trim());

      // Assign a unique ID to keep it consistent
      scenario.id = `custom-${Date.now()}`;
      scenario.category = "custom";

      res.json(scenario);
    } catch (error: any) {
      console.error("Error generating custom scenario with Gemini:", error);
      res.status(500).json({
        error: "Failed to generate dynamic tutoring study. Please double-check your connection or prompt contents.",
        details: error.message || error,
      });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Statistician Tutor Server] online at http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
