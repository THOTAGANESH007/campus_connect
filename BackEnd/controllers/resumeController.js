import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = process.env.GEMINI_FLASH_URL;



// POST /api/resume/analyze
export async function analyzeResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No PDF file uploaded." });
    }
    if (!GEMINI_API_KEY) {
      return res
        .status(500)
        .json({ message: "Gemini API key not configured." });
    }

    // Convert PDF buffer to Base64
    const base64Pdf = req.file.buffer.toString("base64");

    // Build Gemini prompt
    const prompt = `
You are an expert ATS (Applicant Tracking System) resume analyzer and career coach.

Analyze the attached resume PDF and return a JSON object with EXACTLY these keys:
{
  "score": <integer 0-100, ATS-friendliness score>,
  "skills": [<array of skill strings found in the resume>],
  "suggestions": [<array of 4-6 actionable improvement strings>],
  "recommendedRoles": [<array of 3-5 job role strings that match this resume>],
  "summary": "<one sentence summary of the candidate profile>"
}

Rules:
- score must account for: relevant skills, clear sections, quantified achievements, formatting, length, contact info.
- suggestions must be specific and actionable, not generic.
- recommendedRoles must be realistic for the experience level shown.
- Return ONLY valid JSON, no markdown, no explanation text.
`.trim();

    // Call Gemini with Inline Data (PDF)

    const geminiRes = await axios.post(
      `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: "application/pdf",
                  data: base64Pdf
                }
              }
            ]
          }
        ],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
      },
      { headers: { "Content-Type": "application/json" } },
    );

    const rawText =
      geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Parse Gemini JSON response (strip possible markdown fences)
    const jsonStr = rawText.replace(/```json|```/g, "").trim();
    let analysis;
    try {
      analysis = JSON.parse(jsonStr);
    } catch {
      console.error("Gemini Response parsing failed", rawText);
      // Fallback
      return res.json({
        score: 50,
        skills: [],
        suggestions: [
          "Add quantified achievements to each experience entry.",
          "Ensure all section headings are clearly labelled.",
          "Tailor keywords to the job description you are targeting.",
        ],
        recommendedRoles: [],
        summary:
          "Could not generate detailed analysis.",
      });
    }

    return res.json({
      score: analysis.score ?? 50,
      skills: analysis.skills ?? [],
      suggestions: analysis.suggestions ?? [],
      recommendedRoles: analysis.recommendedRoles ?? [],
      summary: analysis.summary ?? "",
    });
  } catch (err) {
    const errMsg = err.response?.data?.error?.message || err.message;
    console.error("Resume analyze error:", errMsg);
    res.status(500).json({ message: "Analysis failed. Please try again later." });
  }
}
