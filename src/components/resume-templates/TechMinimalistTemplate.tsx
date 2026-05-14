import { ResumeData } from "./AtsTemplate";

interface TechMinimalistTemplateProps {
  content: string | ResumeData;
  className?: string;
}

export function TechMinimalistTemplate({ content, className = "" }: TechMinimalistTemplateProps) {
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
      className={`bg-[#0f1117] text-[#e2e8f0] max-w-[850px] mx-auto min-h-[1056px] px-12 py-10 ${className}`}
      style={{ fontFamily: "'Courier New', 'Courier', monospace" }}
    >
      {/* Header */}
      <header className="mb-8 pb-5 border-b border-[#1e2d3d]">
        <div className="text-[#38bdf8] text-xs mb-1">// developer resume</div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">
          {data.personalInfo?.name || "YOUR NAME"}
        </h1>
        {data.experience && data.experience[0]?.title && (
          <p className="text-sm text-[#94a3b8] mb-3">{`> ${data.experience[0].title}`}</p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#64748b]">
          {data.personalInfo?.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo?.phone && <span>| {data.personalInfo.phone}</span>}
          {data.personalInfo?.location && <span>| {data.personalInfo.location}</span>}
          {data.personalInfo?.linkedin && <span>| {data.personalInfo.linkedin}</span>}
          {data.personalInfo?.github && <span>| {data.personalInfo.github}</span>}
        </div>
      </header>

      <div className="space-y-7">
        {/* Summary */}
        {data.summary && (
          <section>
            <div className="text-[#38bdf8] text-xs mb-2">{"/* summary */"}</div>
            <p className="text-sm leading-relaxed text-[#94a3b8]">{data.summary}</p>
          </section>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section>
            <div className="text-[#38bdf8] text-xs mb-2">{"/* tech_stack */"}</div>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="text-xs px-2 py-0.5 border border-[#1e40af] text-[#60a5fa] rounded bg-[#0c1a33]">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <div className="text-[#38bdf8] text-xs mb-3">{"/* experience */"}</div>
            <div className="space-y-6">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-white">{`fn ${exp.title?.replace(/\s+/g, "_").toLowerCase()}()`}</h3>
                    <span className="text-xs text-[#64748b] shrink-0 ml-3">{exp.dates}</span>
                  </div>
                  <p className="text-xs text-[#a3e635] mb-2">
                    {`@${exp.company?.replace(/\s+/g, "") || "company"}`}{exp.location ? ` // ${exp.location}` : ""}
                  </p>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="text-sm text-[#94a3b8] space-y-1.5 ml-4">
                      {exp.bullets.map((b, j) => (
                        <li key={j} className="flex gap-2">
                          <span className="text-[#38bdf8] shrink-0">-</span>
                          <span className="text-justify">{b}</span>
                        </li>
                      ))}
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
            <div className="text-[#38bdf8] text-xs mb-3">{"/* education */"}</div>
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-white">{edu.degree}</h3>
                    <span className="text-xs text-[#64748b] shrink-0 ml-3">{edu.dates}</span>
                  </div>
                  <p className="text-xs text-[#94a3b8]">{edu.school}{edu.location ? ` // ${edu.location}` : ""}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section>
            <div className="text-[#38bdf8] text-xs mb-2">{"/* certifications */"}</div>
            <ul className="text-sm text-[#94a3b8] space-y-1 ml-4">
              {data.certifications.map((c, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[#38bdf8] shrink-0">-</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
