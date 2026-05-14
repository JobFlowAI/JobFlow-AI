import { ResumeData } from "./AtsTemplate";

interface NavyCorporateTemplateProps {
  content: string | ResumeData;
  className?: string;
}

export function NavyCorporateTemplate({ content, className = "" }: NavyCorporateTemplateProps) {
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

  const navyBg = "#1a2f4e";
  const goldAccent = "#c9a84c";

  return (
    <div className={`font-sans bg-white text-gray-800 max-w-[850px] mx-auto min-h-[1056px] ${className}`}>
      {/* Navy Header */}
      <header style={{ backgroundColor: navyBg }} className="px-12 py-9 text-white">
        <h1 className="text-3xl font-bold tracking-wide mb-1">
          {data.personalInfo?.name || "YOUR NAME"}
        </h1>
        {data.experience && data.experience[0]?.title && (
          <p style={{ color: goldAccent }} className="text-base font-semibold mb-4">
            {data.experience[0].title}
          </p>
        )}
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm" style={{ color: "#a8c0d6" }}>
          {data.personalInfo?.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo?.phone && <span>· {data.personalInfo.phone}</span>}
          {data.personalInfo?.location && <span>· {data.personalInfo.location}</span>}
          {data.personalInfo?.linkedin && <span>· {data.personalInfo.linkedin}</span>}
          {data.personalInfo?.github && <span>· {data.personalInfo.github}</span>}
        </div>
      </header>

      {/* Gold divider bar */}
      <div style={{ backgroundColor: goldAccent, height: "3px" }} />

      {/* Body */}
      <div className="px-12 py-8 space-y-7">
        {/* Summary */}
        {data.summary && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-1 pb-2" style={{ color: navyBg, borderBottom: `2px solid ${goldAccent}` }}>
              Professional Summary
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 mt-3 text-justify">{data.summary}</p>
          </section>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-1 pb-2" style={{ color: navyBg, borderBottom: `2px solid ${goldAccent}` }}>
              Core Skills
            </h2>
            <div className="flex flex-wrap gap-2 mt-3">
              {data.skills.map((skill, i) => (
                <span key={i} className="text-xs px-3 py-1 border rounded font-medium text-gray-700"
                  style={{ borderColor: goldAccent, backgroundColor: "#fdf9ef" }}>
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-1 pb-2" style={{ color: navyBg, borderBottom: `2px solid ${goldAccent}` }}>
              Experience
            </h2>
            <div className="space-y-6 mt-3">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold" style={{ color: navyBg }}>{exp.title}</h3>
                    <span className="text-xs text-gray-500 shrink-0 ml-3">{exp.dates}</span>
                  </div>
                  <p className="text-sm font-medium mb-2" style={{ color: goldAccent }}>
                    {exp.company}{exp.location ? ` · ${exp.location}` : ""}
                  </p>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="text-sm text-gray-600 space-y-1.5 ml-4 list-disc" style={{ "--marker-color": navyBg } as React.CSSProperties}>
                      {exp.bullets.map((b, j) => <li key={j} className="pl-1 text-justify">{b}</li>)}
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
            <h2 className="text-sm font-bold uppercase tracking-widest mb-1 pb-2" style={{ color: navyBg, borderBottom: `2px solid ${goldAccent}` }}>
              Education
            </h2>
            <div className="space-y-4 mt-3">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold" style={{ color: navyBg }}>{edu.degree}</h3>
                    <span className="text-xs text-gray-500 shrink-0 ml-3">{edu.dates}</span>
                  </div>
                  <p className="text-sm text-gray-600">{edu.school}{edu.location ? `, ${edu.location}` : ""}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-1 pb-2" style={{ color: navyBg, borderBottom: `2px solid ${goldAccent}` }}>
              Certifications
            </h2>
            <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc mt-3">
              {data.certifications.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
