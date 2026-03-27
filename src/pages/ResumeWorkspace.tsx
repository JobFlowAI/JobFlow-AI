import { motion } from "framer-motion";
import { Upload, FileText, Sparkles, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

const sampleKeywords = [
  { word: "React", found: true },
  { word: "TypeScript", found: true },
  { word: "CI/CD", found: false },
  { word: "Agile", found: true },
  { word: "REST APIs", found: true },
  { word: "Docker", found: false },
  { word: "Unit Testing", found: false },
  { word: "GraphQL", found: true },
];

const suggestions = [
  { before: "Worked on frontend projects", after: "Led development of 3 React applications serving 50K+ users, improving load times by 40%", section: "Experience" },
  { before: "Used various tools", after: "Proficient in TypeScript, GraphQL, Docker, and CI/CD pipelines using GitHub Actions", section: "Skills" },
];

export default function ResumeWorkspace() {
  const [uploaded, setUploaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fitScore = 72;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploaded(true);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Resume Workspace</h1>
        <p className="text-muted-foreground">Upload your resume and get AI-powered optimization.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Editor/Uploader */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-elevated p-6 min-h-[500px] flex flex-col"
        >
          {!uploaded ? (
            <div
              onClick={() => setUploaded(true)}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all p-10 ${
                isDragging
                  ? "border-primary bg-primary/10 shadow-lg scale-[1.02]"
                  : "border-border hover:border-primary/40 hover:bg-primary/5"
              }`}
            >
              <Upload className={`w-12 h-12 mb-4 transition-transform ${isDragging ? "text-primary scale-110" : "text-muted-foreground"}`} />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {isDragging ? "Drop to Upload" : "Upload Your Resume"}
              </h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Drag & drop your PDF or DOCX file, or click to browse
              </p>
              <span className="text-xs text-muted-foreground">2 credits per parse</span>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">John_Doe_Resume.pdf</p>
                  <p className="text-xs text-muted-foreground">Uploaded just now</p>
                </div>
              </div>
              <div className="flex-1 rounded-xl bg-secondary p-6 space-y-4 overflow-auto">
                <h4 className="font-semibold text-foreground text-sm">JOHN DOE</h4>
                <p className="text-sm text-muted-foreground">Senior Frontend Developer</p>
                <hr className="border-border" />
                <div>
                  <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Experience</h5>
                  <p className="text-sm text-foreground mb-1 font-medium">Frontend Developer — TechCorp</p>
                  <p className="text-sm text-muted-foreground">Worked on frontend projects using React and JavaScript. Used various tools for development.</p>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Skills</h5>
                  <p className="text-sm text-muted-foreground">React, JavaScript, HTML, CSS, Git</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Right: AI Feedback Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {/* Fit Score Gauge */}
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Fit Score</h3>
              <Sparkles className="w-5 h-5 text-gold" />
            </div>
            <div className="relative mx-auto w-48 h-24 mb-3">
              <svg viewBox="0 0 200 100" className="w-full h-full">
                <path d="M 20 90 A 80 80 0 0 1 180 90" fill="none" stroke="hsl(var(--secondary))" strokeWidth="12" strokeLinecap="round" />
                <path
                  d="M 20 90 A 80 80 0 0 1 180 90"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(fitScore / 100) * 252} 252`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-0">
                <span className="text-3xl font-bold text-foreground">{fitScore}</span>
                <span className="text-xs text-muted-foreground">out of 100</span>
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              {fitScore >= 80 ? "Great match!" : "Room for improvement — see suggestions below."}
            </p>
          </div>

          {/* Keywords */}
          <div className="card-elevated p-6">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-primary" /> Keyword Analysis
            </h3>
            <div className="flex flex-wrap gap-2">
              {sampleKeywords.map((kw) => (
                <span
                  key={kw.word}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium ${
                    kw.found
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {kw.found ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {kw.word}
                </span>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div className="card-elevated p-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">AI Suggestions</h3>
            <div className="space-y-4">
              {suggestions.map((s, i) => (
                <div key={i} className="space-y-2">
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">{s.section}</span>
                  <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                    <p className="text-xs text-muted-foreground line-through">{s.before}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-success/5 border border-success/10">
                    <p className="text-xs text-foreground">{s.after}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
