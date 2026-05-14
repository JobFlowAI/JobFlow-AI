import { ResumeData } from "./AtsTemplate";

interface ExecutiveClassicTemplateProps {
  content: string | ResumeData;
  className?: string;
}

export function ExecutiveClassicTemplate({ content, className = "" }: ExecutiveClassicTemplateProps) {
  let data: ResumeData | null = null;
  let rawTextFallback = "";

  if (typeof content === "string") {
    try {
      data = JSON.parse(content);
    } catch (e) {
      rawTextFallback = content;
    }
  } else {
    data = content;
  }

  if (!data || rawTextFallback) {
    return (
      <div className={`whitespace-pre-wrap text-sm leading-relaxed text-foreground font-[system-ui] ${className}`}>
        {rawTextFallback || JSON.stringify(data)}
      </div>
    );
  }

  return (
    <div
      className={`bg-white text-gray-900 max-w-[850px] mx-auto min-h-[1056px] px-12 py-10 ${className}`}
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Centered Header */}
      <header className="text-center mb-6 pb-5 border-b border-gray-400">
        <h1 className="text-3xl font-bold tracking-wide mb-1">
          {data.personalInfo?.name || "YOUR NAME"}
        </h1>
        <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600 mt-2">
          {data.personalInfo?.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo?.phone && <span>| {data.personalInfo.phone}</span>}
          {data.personalInfo?.location && <span>| {data.personalInfo.location}</span>}
          {data.personalInfo?.linkedin && <span>| {data.personalInfo.linkedin}</span>}
          {data.personalInfo?.github && <span>| {data.personalInfo.github}</span>}
        </div>
      </header>

      <div className="space-y-6">
        {/* Summary */}
        {data.summary && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-2 pb-1 border-b border-gray-300">
              Executive Summary
            </h2>
            <p className="text-sm leading-relaxed text-gray-700 text-justify">{data.summary}</p>
          </section>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-2 pb-1 border-b border-gray-300">
              Core Competencies
            </h2>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-700">
              {data.skills.map((skill, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-gray-500 inline-block" />
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-3 pb-1 border-b border-gray-300">
              Professional Experience
            </h2>
            <div className="space-y-5">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900">{exp.title}</h3>
                    <span className="text-sm text-gray-600 shrink-0 ml-3">{exp.dates}</span>
                  </div>
                  <p className="text-sm italic text-gray-600 mb-2">
                    {exp.company}{exp.location ? `, ${exp.location}` : ""}
                  </p>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="text-sm text-gray-700 space-y-1 ml-5 list-disc">
                      {exp.bullets.map((b, j) => <li key={j} className="text-justify">{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-3 pb-1 border-b border-gray-300">
              Education
            </h2>
            <div className="space-y-3">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <span className="text-sm text-gray-600 shrink-0 ml-3">{edu.dates}</span>
                  </div>
                  <p className="text-sm italic text-gray-600">{edu.school}{edu.location ? `, ${edu.location}` : ""}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-2 pb-1 border-b border-gray-300">
              Certifications
            </h2>
            <ul className="text-sm text-gray-700 space-y-1 ml-5 list-disc">
              {data.certifications.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
