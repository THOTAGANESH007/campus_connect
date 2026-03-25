import { useState, useRef, useCallback } from "react";
import { analyzeResume } from "../../services/resumeService";

/* ─── colour palette ─── */
const CLR = {
  bg: "#0d0f1a",
  card: "#131626",
  border: "#1e2240",
  accent: "#6c63ff",
  accentSoft: "rgba(108,99,255,0.15)",
  green: "#22d3a5",
  greenSoft: "rgba(34,211,165,0.12)",
  yellow: "#f4c542",
  yellowSoft: "rgba(244,197,66,0.12)",
  red: "#ff6b6b",
  redSoft: "rgba(255,107,107,0.12)",
  text: "#e2e8f0",
  muted: "#64748b",
};

/* ─── Score ring component ─── */
function ScoreRing({ score }) {
  const radius = 58;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;

  const color =
    score >= 75 ? CLR.green :
    score >= 50 ? CLR.yellow :
    CLR.red;

  const label =
    score >= 75 ? "Excellent" :
    score >= 50 ? "Good" :
    "Needs Work";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* track */}
        <circle cx="70" cy="70" r={radius} fill="none" stroke={CLR.border} strokeWidth="10" />
        {/* progress */}
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)" }}
        />
        <text x="70" y="66" textAnchor="middle" fill={color} fontSize="28" fontWeight="700" fontFamily="Inter,sans-serif">{score}</text>
        <text x="70" y="84" textAnchor="middle" fill={CLR.muted} fontSize="11" fontFamily="Inter,sans-serif">/ 100</text>
      </svg>
      <span style={{ color, fontSize: 13, fontWeight: 600, letterSpacing: 1 }}>{label.toUpperCase()}</span>
    </div>
  );
}

/* ─── Skill tag ─── */
function SkillTag({ label }) {
  return (
    <span style={{
      background: CLR.accentSoft,
      color: CLR.accent,
      border: `1px solid ${CLR.accent}44`,
      borderRadius: 20,
      padding: "4px 12px",
      fontSize: 12,
      fontWeight: 600,
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

/* ─── Role badge ─── */
function RoleBadge({ label }) {
  return (
    <span style={{
      background: CLR.greenSoft,
      color: CLR.green,
      border: `1px solid ${CLR.green}44`,
      borderRadius: 20,
      padding: "5px 14px",
      fontSize: 12,
      fontWeight: 600,
    }}>
      💼 {label}
    </span>
  );
}

/* ─── Card wrapper ─── */
function Card({ title, icon, children }) {
  return (
    <div style={{
      background: CLR.card,
      border: `1px solid ${CLR.border}`,
      borderRadius: 16,
      padding: "20px 24px",
    }}>
      <h3 style={{ margin: "0 0 16px", color: CLR.text, fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
        <span>{icon}</span> {title}
      </h3>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function ResumeAnalyzer() {
  const [file, setFile]       = useState(null);
  const [dragging, setDrag]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState("");
  const inputRef              = useRef();

  /* Drag & drop handlers */
  const onDragOver = useCallback((e) => { e.preventDefault(); setDrag(true); }, []);
  const onDragLeave = useCallback(() => setDrag(false), []);
  const onDrop = useCallback((e) => {
    e.preventDefault(); setDrag(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") { setFile(dropped); setResult(null); setError(""); }
    else setError("Only PDF files are accepted.");
  }, []);

  const onFileChange = (e) => {
    const chosen = e.target.files[0];
    if (chosen?.type === "application/pdf") { setFile(chosen); setResult(null); setError(""); }
    else setError("Only PDF files are accepted.");
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await analyzeResume(file);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setFile(null); setResult(null); setError(""); };

  /* ── styles ── */
  const s = {
    page: {
      minHeight: "100vh",
      background: CLR.bg,
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: CLR.text,
      padding: "40px 20px 60px",
    },
    center: { maxWidth: 820, margin: "0 auto" },

    hero: { textAlign: "center", marginBottom: 40 },
    heroTitle: {
      fontSize: "clamp(28px, 5vw, 42px)",
      fontWeight: 800,
      background: `linear-gradient(135deg, ${CLR.accent}, ${CLR.green})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      margin: "0 0 10px",
    },
    heroSub: { color: CLR.muted, fontSize: 15, margin: 0 },

    dropzone: {
      border: `2px dashed ${dragging ? CLR.accent : CLR.border}`,
      borderRadius: 20,
      background: dragging ? CLR.accentSoft : CLR.card,
      padding: "48px 24px",
      textAlign: "center",
      cursor: "pointer",
      transition: "all .25s ease",
    },
    dropIcon: { fontSize: 48, display: "block", marginBottom: 12 },
    dropText: { color: CLR.text, fontSize: 15, marginBottom: 6, fontWeight: 600 },
    dropSub: { color: CLR.muted, fontSize: 13, marginBottom: 20 },

    fileChip: {
      display: "inline-flex", alignItems: "center", gap: 8,
      background: CLR.accentSoft, border: `1px solid ${CLR.accent}44`,
      borderRadius: 24, padding: "8px 16px",
      color: CLR.accent, fontSize: 13, fontWeight: 600,
    },
    removeBtn: {
      background: "none", border: "none", cursor: "pointer",
      color: CLR.muted, fontSize: 16, lineHeight: 1, padding: 0,
    },

    analyzeBtn: {
      width: "100%", marginTop: 20,
      padding: "14px 0",
      background: loading
        ? CLR.border
        : `linear-gradient(135deg, ${CLR.accent}, #9b59b6)`,
      border: "none", borderRadius: 12,
      color: "#fff", fontSize: 16, fontWeight: 700,
      cursor: loading ? "not-allowed" : "pointer",
      letterSpacing: 0.5,
      transition: "opacity .2s",
    },

    errorBox: {
      background: CLR.redSoft, border: `1px solid ${CLR.red}44`,
      borderRadius: 12, padding: "12px 16px", color: CLR.red,
      fontSize: 14, marginTop: 12,
    },

    grid2: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: 16,
    },
    tagsWrap: { display: "flex", flexWrap: "wrap", gap: 8 },

    suggItem: {
      display: "flex", alignItems: "flex-start", gap: 10,
      marginBottom: 10, fontSize: 14, lineHeight: 1.5, color: CLR.text,
    },
    suggBullet: {
      minWidth: 22, height: 22, borderRadius: "50%",
      background: CLR.yellowSoft, border: `1px solid ${CLR.yellow}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 11, fontWeight: 700, color: CLR.yellow, marginTop: 1,
    },

    summaryBox: {
      background: CLR.accentSoft, borderRadius: 12,
      padding: "14px 18px", color: CLR.text,
      fontSize: 14, lineHeight: 1.7, fontStyle: "italic",
      border: `1px solid ${CLR.accent}33`, marginBottom: 20,
    },

    resetBtn: {
      display: "block", margin: "28px auto 0",
      background: "none", border: `1px solid ${CLR.border}`,
      color: CLR.muted, borderRadius: 10, padding: "10px 24px",
      cursor: "pointer", fontSize: 13, transition: "all .2s",
    },

    loader: {
      display: "flex", flexDirection: "column",
      alignItems: "center", gap: 16, padding: "40px 0",
    },
    loaderRing: {
      width: 50, height: 50,
      border: `4px solid ${CLR.border}`,
      borderTop: `4px solid ${CLR.accent}`,
      borderRadius: "50%",
      animation: "spin 0.9s linear infinite",
    },
  };

  return (
    <div style={s.page}>
      {/* Global keyframe for spinner */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      `}</style>

      <div style={s.center}>
        {/* HERO */}
        <div style={s.hero}>
          <h1 style={s.heroTitle}>📄 AI Resume Analyzer</h1>
          <p style={s.heroSub}>Upload your resume and get an instant ATS score, skill extraction, and personalised suggestions powered by Gemini AI.</p>
        </div>

        {/* UPLOAD ZONE */}
        {!result && (
          <div>
            <div
              style={s.dropzone}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => !file && inputRef.current.click()}
            >
              <input ref={inputRef} type="file" accept="application/pdf" hidden onChange={onFileChange} />

              {!file ? (
                <>
                  <span style={s.dropIcon}>☁️</span>
                  <p style={s.dropText}>Drag & drop your resume here</p>
                  <p style={s.dropSub}>or click to browse — PDF only</p>
                  <button
                    style={{
                      background: CLR.accentSoft, border: `1px solid ${CLR.accent}66`,
                      color: CLR.accent, borderRadius: 8, padding: "8px 18px",
                      cursor: "pointer", fontSize: 13, fontWeight: 600,
                    }}
                    onClick={(e) => { e.stopPropagation(); inputRef.current.click(); }}
                  >
                    Browse File
                  </button>
                </>
              ) : (
                <>
                  <span style={{ fontSize: 40, display: "block", marginBottom: 10 }}>📄</span>
                  <span style={s.fileChip}>
                    {file.name}
                    <button style={s.removeBtn} onClick={(e) => { e.stopPropagation(); reset(); }} title="Remove">✕</button>
                  </span>
                  <p style={{ color: CLR.muted, fontSize: 12, marginTop: 10 }}>
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </>
              )}
            </div>

            {error && <div style={s.errorBox}>⚠️ {error}</div>}

            <button
              style={s.analyzeBtn}
              disabled={!file || loading}
              onClick={handleAnalyze}
            >
              {loading ? "Analyzing…" : "🔍 Analyze Resume"}
            </button>
          </div>
        )}

        {/* LOADER */}
        {loading && (
          <div style={s.loader}>
            <div style={s.loaderRing} />
            <p style={{ color: CLR.muted, fontSize: 14 }}>Extracting skills and generating insights…</p>
          </div>
        )}

        {/* RESULTS */}
        {result && !loading && (
          <div>
            {/* Summary */}
            {result.summary && (
              <div style={s.summaryBox}>
                🧠 &nbsp;{result.summary}
              </div>
            )}

            {/* Score + Skills */}
            <div style={{ ...s.grid2, marginBottom: 16 }}>
              {/* ATS Score */}
              <Card title="ATS Score" icon="🎯">
                <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
                  <ScoreRing score={result.score} />
                </div>
                <p style={{ color: CLR.muted, fontSize: 12, textAlign: "center", marginTop: 10, marginBottom: 0 }}>
                  Score is based on skills, formatting, sections, and keyword density.
                </p>
              </Card>

              {/* Recommended Roles */}
              <Card title="Recommended Roles" icon="💼">
                {result.recommendedRoles?.length ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {result.recommendedRoles.map((r, i) => <RoleBadge key={i} label={r} />)}
                  </div>
                ) : (
                  <p style={{ color: CLR.muted, fontSize: 13 }}>No roles detected.</p>
                )}
              </Card>
            </div>

            {/* Skills */}
            <div style={{ marginBottom: 16 }}>
              <Card title={`Detected Skills (${result.skills?.length ?? 0})`} icon="⚡">
                {result.skills?.length ? (
                  <div style={s.tagsWrap}>
                    {result.skills.map((sk, i) => <SkillTag key={i} label={sk} />)}
                  </div>
                ) : (
                  <p style={{ color: CLR.muted, fontSize: 13 }}>No specific skills detected.</p>
                )}
              </Card>
            </div>

            {/* Suggestions */}
            <div style={{ marginBottom: 8 }}>
              <Card title="Improvement Suggestions" icon="💡">
                {result.suggestions?.length ? (
                  result.suggestions.map((s, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      marginBottom: i < result.suggestions.length - 1 ? 12 : 0,
                      fontSize: 14, lineHeight: 1.6, color: CLR.text,
                    }}>
                      <span style={{
                        minWidth: 24, height: 24, borderRadius: "50%",
                        background: CLR.yellowSoft, border: `1px solid ${CLR.yellow}44`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700, color: CLR.yellow, marginTop: 1,
                        flexShrink: 0,
                      }}>{i + 1}</span>
                      {s}
                    </div>
                  ))
                ) : (
                  <p style={{ color: CLR.muted, fontSize: 13 }}>No suggestions available.</p>
                )}
              </Card>
            </div>

            {/* Analyze another */}
            <button
              style={s.resetBtn}
              onMouseEnter={(e) => { e.target.style.borderColor = CLR.accent; e.target.style.color = CLR.accent; }}
              onMouseLeave={(e) => { e.target.style.borderColor = CLR.border; e.target.style.color = CLR.muted; }}
              onClick={reset}
            >
              ↩ Analyze Another Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
