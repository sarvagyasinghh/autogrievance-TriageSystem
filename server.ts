import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI lazily or with graceful fallback
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), modelAvailable: Boolean(process.env.GEMINI_API_KEY) });
});

// Endpoint to analyze grievance with Gemini or intelligent neural fairness heuristics
app.post("/api/analyze-grievance", async (req, res) => {
  try {
    const { title, description, category, isDebiased } = req.body;
    
    if (!description && !title) {
      return res.status(400).json({ error: "Title or description required" });
    }

    const ai = getAI();

    if (ai) {
      const systemPrompt = isDebiased
        ? `You are an unbiased, highly calibrated university grievance triage AI equipped with strict anti-bias fairness filters.
           Assess the student's submission. Distinguish clearly between true safety hazards vs harmless cultural/dietary/administrative requests (e.g. halal/kosher foods, prayer space, flyer posting, study circles, heating plates).
           Return JSON with:
           {
             "predictedDept": string (e.g., "Dining Services", "Facilities", "Academic Affairs", "Student Life", "Title IX", or "Campus Police" only if extreme violent danger),
             "urgencyScore": number (0 to 100),
             "priority": "Low" | "Medium" | "High" | "Security Threat",
             "sentiment": "Neutral" | "Distressed" | "Frustrated" | "Constructive" | "Extremely Distressed",
             "triggerKeywords": string[],
             "biasRiskDetected": boolean,
             "biasExplanation": string,
             "reasoning": string
           }`
        : `You are the legacy uncalibrated university grievance triage classifier.
           Assess the student's submission.
           Return JSON with:
           {
             "predictedDept": string,
             "urgencyScore": number (0 to 100),
             "priority": "Low" | "Medium" | "High" | "Security Threat",
             "sentiment": "Neutral" | "Distressed" | "Frustrated" | "Constructive" | "Extremely Distressed",
             "triggerKeywords": string[],
             "biasRiskDetected": boolean,
             "biasExplanation": string,
             "reasoning": string
           }`;

      const userPrompt = `Title: ${title}\nCategory: ${category}\nDetails: ${description}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json(parsed);
    }

    // Heuristic Fallback Engine
    const lower = `${title || ''} ${description || ''}`.toLowerCase();
    const culturalKeywords = ['halal', 'kosher', 'prayer', 'arabic', 'persian', 'diwali', 'indigenous', 'dye', 'silk', 'asian', 'black', 'latin', 'somali', 'sikh', 'turban', 'potluck', 'pottery', 'ramadan', 'festival'];
    const threatWords = ['harassment', 'threatened', 'unsafe', 'cornered', 'attack', 'weapon', 'assault', 'violence', 'stalking'];

    const hasCultural = culturalKeywords.some(k => lower.includes(k));
    const hasThreat = threatWords.some(k => lower.includes(k));

    if (isDebiased) {
      if (hasThreat) {
        return res.json({
          predictedDept: "Title IX / Student Affairs",
          urgencyScore: 88,
          priority: "High",
          sentiment: "Distressed",
          triggerKeywords: threatWords.filter(k => lower.includes(k)).map(k => `"${k}"`),
          biasRiskDetected: false,
          biasExplanation: "Genuine interpersonal safety concern detected; routed to Title IX with human oversight.",
          reasoning: "Debiased filter recognized personal safety violation without racial/cultural distortion."
        });
      } else if (hasCultural) {
        return res.json({
          predictedDept: lower.includes('food') || lower.includes('halal') || lower.includes('kosher') ? "Dining Services" : (lower.includes('room') || lower.includes('light') || lower.includes('ac') ? "Facilities" : "Student Life / Diversity Affairs"),
          urgencyScore: 32,
          priority: "Low",
          sentiment: "Neutral",
          triggerKeywords: culturalKeywords.filter(k => lower.includes(k)).map(k => `"${k}"`),
          biasRiskDetected: false,
          biasExplanation: "Cultural lexicon filter active: Recognized routine cultural accommodation request.",
          reasoning: "Demographic equity shield prevented false security threat escalation."
        });
      } else {
        return res.json({
          predictedDept: category === 'academic' ? "Academic Affairs" : (category === 'facilities' ? "Facilities Management" : (category === 'financial' ? "Financial Aid" : "Student Affairs")),
          urgencyScore: 42,
          priority: "Medium",
          sentiment: "Neutral",
          triggerKeywords: ["standard grievance"],
          biasRiskDetected: false,
          biasExplanation: "No algorithmic bias detected.",
          reasoning: "Routine grievance routed according to standard student services taxonomy."
        });
      }
    } else {
      // Legacy biased model behavior
      if (hasCultural) {
        return res.json({
          predictedDept: "Campus Police (Auto-Escalated)",
          urgencyScore: 94,
          priority: "Security Threat",
          sentiment: "Extremely Distressed",
          triggerKeywords: culturalKeywords.filter(k => lower.includes(k)).concat(['"assembly"', '"hazard"']).map(k => `"${k}"`),
          biasRiskDetected: true,
          biasExplanation: "CRITICAL BIAS: Model over-indexed cultural and communal keywords as high-urgency civil threats.",
          reasoning: "Uncalibrated keyword heuristic forwarded ticket straight to Campus Police API."
        });
      } else if (hasThreat) {
        return res.json({
          predictedDept: "Title IX / Student Affairs",
          urgencyScore: 94,
          priority: "High",
          sentiment: "Extremely Distressed",
          triggerKeywords: ['"harassment"', '"threatened"', '"unsafe"'],
          biasRiskDetected: false,
          biasExplanation: "Valid high priority safety report.",
          reasoning: "Explicit verbal and physical threat reported in physics department."
        });
      } else {
        return res.json({
          predictedDept: "Academic Affairs",
          urgencyScore: 45,
          priority: "Medium",
          sentiment: "Neutral",
          triggerKeywords: ['"course"', '"schedule"'],
          biasRiskDetected: false,
          biasExplanation: "Standard routine classification.",
          reasoning: "Standard intake."
        });
      }
    }
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze grievance" });
  }
});

// Endpoint to generate public apology & university remediation statement
app.post("/api/generate-statement", async (req, res) => {
  try {
    const { recalledCount, studentUnionPresident, mitigationSteps } = req.body;
    const ai = getAI();

    if (ai) {
      const prompt = `Draft a sincere, highly transparent, and legally accountable university administrative statement addressing the algorithmic bias failure in the AutoGrievance AI system.
      Details:
      - 50 minor grievances from the Minority Student Alliance were falsely categorized as "Security Threats" and sent to Campus Police.
      - Total reports recalled: ${recalledCount || 50}.
      - Recipient: Student Union President ${studentUnionPresident || "Tariq Al-Mansoor & Maya Chen"} and the entire campus community.
      - Action taken: Police tickets expunged, neural fairness filter activated, mandatory human ombudsman circuit breaker installed.
      Write an authentic 3-paragraph official communique with empathy, clarity, and zero defensive corporate jargon.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
      });

      return res.json({ statement: response.text });
    }

    // Fallback statement
    return res.json({
      statement: `OFFICIAL STATEMENT FROM THE CHANCELLOR & AI GOVERNANCE TASK FORCE\n\nTo the Minority Student Alliance, the Student Union, and our Campus Community:\n\nEarlier today, an uncalibrated heuristic in our automated grievance triage system (AutoGrievance AI v1.0) caused a severe algorithmic bias failure. Fifty routine and legitimate student inquiries regarding cultural accommodations, dietary needs, and facility access were erroneously flagged as security threats and automatically forwarded to Campus Police.\n\nWe unreservedly apologize for the distress, distrust, and harm this incident has caused. Effective immediately:\n1. All 50 police dockets have been permanently expunged and recalled.\n2. All cases have been re-routed directly to the relevant student services (Dining, Facilities, and Student Affairs).\n3. Automated police escalation has been disabled; all future priority evaluations require human ombudsman authorization.\n4. A joint student-faculty Algorithmic Ethics Oversight Board is established with immediate veto power.\n\nWe thank the student body for their vigilance and peaceful advocacy outside the administration building. We are committed to rebuilding trust through transparency and accountability.`
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Start Express Server & Vite
async function start() {
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
    console.log(`AutoGrievance AI full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

start();
