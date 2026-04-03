import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = process.env.GEMINI_FLASH_URL;

// --- Keyword bank for quick client-side extraction ---
const KNOWN_SKILLS = [
  // Languages
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C",
  "C++",
  "C#",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "PHP",
  "Ruby",
  "Scala",
  "R",
  "MATLAB",
  // Web
  "HTML",
  "CSS",
  "React",
  "Next.js",
  "Vue",
  "Angular",
  "Svelte",
  "Node.js",
  "Express",
  "FastAPI",
  "Django",
  "Flask",
  "Spring Boot",
  "REST",
  "GraphQL",
  "WebSocket",
  // Databases
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "SQLite",
  "Redis",
  "Firebase",
  "Cassandra",
  "DynamoDB",
  "Supabase",
  // DevOps / Cloud
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
  "CI/CD",
  "GitHub Actions",
  "Jenkins",
  "Terraform",
  "Linux",
  "Nginx",
  // AI / ML
  "Machine Learning",
  "Deep Learning",
  "TensorFlow",
  "PyTorch",
  "Scikit-learn",
  "NLP",
  "LLM",
  "OpenCV",
  "Pandas",
  "NumPy",
  "Matplotlib",
  // Tools
  "Git",
  "GitHub",
  "VS Code",
  "Postman",
  "Figma",
  "JIRA",
  "Agile",
  "Scrum",
  // Mobile
  "React Native",
  "Flutter",
  "Android",
  "iOS",
  // Soft skills (section keywords)
  "Leadership",
  "Communication",
  "Teamwork",
  "Problem Solving",
];

/**
 * Extract skills from resume text via simple case-insensitive keyword match.
 */
function extractSkills(text) {
  const lower = text.toLowerCase();
  return KNOWN_SKILLS.filter((skill) => lower.includes(skill.toLowerCase()));
}

/**
 * Rough ATS pre-score based on structure signals.
 * Gemini will refine this into the final score.
 */
function preScore(text, skills) {
  let score = 0;
  const lower = text.toLowerCase();

  // Section presence (5 pts each)
  const sections = [
    "experience",
    "education",
    "projects",
    "skills",
    "summary",
    "objective",
    "certifications",
  ];
  sections.forEach((s) => {
    if (lower.includes(s)) score += 5;
  });

  // Skills count (up to 30 pts)
  score += Math.min(skills.length * 2, 30);

  // Length check — 300–900 words is ideal
  const wordCount = text.split(/\s+/).length;
  if (wordCount >= 300 && wordCount <= 900) score += 10;
  else if (wordCount > 100) score += 5;

  // Contact info signals
  if (
    lower.includes("@") ||
    lower.includes("linkedin") ||
    lower.includes("github")
  )
    score += 5;
  if (/\d{10}|\+91/.test(text)) score += 5;

  return Math.min(score, 70); // leave room for Gemini refinement
}

// POST /api/resume/analyze
export async function analyzeResume(req, res) {
  // try {
    console.log("first")
    if (!req.file) {
      return res.status(400).json({ message: "No PDF file uploaded." });
    }
    if (!GEMINI_API_KEY) {
      return res
        .status(500)
        .json({ message: "Gemini API key not configured." });
    }

    // 1. Parse PDF buffer → raw text
    let resumeText = "";
    try {
      console.log(req.file.buffer)
      const parsed = await pdfParse(req.file.buffer);
      console.log("bhaai")
      console.log(parsed.text);
      resumeText = parsed.text.trim();
    } catch (parseErr) {
      return res
        .status(422)
        .json({
          message:
            "Could not extract text from PDF. Please ensure the PDF contains selectable text.",
        });
    }

    if (!resumeText || resumeText.length < 50) {
      return res
        .status(422)
        .json({
          message:
            "PDF appears to be empty or image-only. Please use a text-based PDF.",
        });
    }

    // 2. Quick local extraction
    const extractedSkills = extractSkills(resumeText);
    const roughScore = preScore(resumeText, extractedSkills);

    // 3. Build Gemini prompt
    const prompt = `
You are an expert ATS (Applicant Tracking System) resume analyzer and career coach.

Analyze the following resume text and return a JSON object with EXACTLY these keys:
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

Resume Text:
---
${resumeText.slice(0, 6000)}
---
`.trim();

    // 4. Call Gemini
    const geminiRes = await axios.post(
      `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
      },
      { headers: { "Content-Type": "application/json" } },
    );

    const rawText =
      geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // 5. Parse Gemini JSON response (strip possible markdown fences)
    const jsonStr = rawText.replace(/```json|```/g, "").trim();
    let analysis;
    try {
      analysis = JSON.parse(jsonStr);
    } catch {
      // Fallback: return local analysis if Gemini JSON is malformed
      return res.json({
        score: roughScore,
        skills: extractedSkills,
        suggestions: [
          "Add quantified achievements to each experience entry.",
          "Include a concise professional summary at the top.",
          "Ensure all section headings are clearly labelled.",
          "List relevant certifications or courses.",
          "Tailor keywords to the job description you are targeting.",
        ],
        recommendedRoles: ["Software Developer", "Full Stack Engineer"],
        summary:
          "Could not generate detailed analysis. Showing local extraction.",
      });
    }

    // Merge local extracted skills if Gemini missed some
    const mergedSkills = Array.from(
      new Set([...(analysis.skills || []), ...extractedSkills]),
    );

    return res.json({
      score: analysis.score ?? roughScore,
      skills: mergedSkills,
      suggestions: analysis.suggestions ?? [],
      recommendedRoles: analysis.recommendedRoles ?? [],
      summary: analysis.summary ?? "",
    });
  // } catch (err) {
  //   const errMsg = err.response?.data?.error?.message || err.message;
  //   console.error("Resume analyze error:", errMsg);
  //   res.status(500).json({ error: errMsg });
  // }
}
