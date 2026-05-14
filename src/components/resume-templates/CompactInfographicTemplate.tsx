import { ResumeData } from "./AtsTemplate";

interface CompactInfographicTemplateProps {
  content: string | ResumeData;
  className?: string;
}

export function CompactInfographicTemplate({ content, className = "" }: CompactInfographicTemplateProps) {
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

  const halfExp = data.experience ? Math.ceil(data.experience.length / 2) : 0;
  const leftExp = data.experience ? data.experience.slice(0, halfExp) : [];
  const rightExp = data.experience ? data.experience.slice(halfExp) : [];

  return (
    <div className={`font-sans bg-white text-gray-800 max-w-[850px] mx-auto min-h-[1056px] ${className}`}>
      {/* Teal Header */}
      <header className="bg-teal-700 text-white px-10 py-8">
        <div className="flex justify-between items-start gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">
              {data.personalInfo?.name || "YOUR NAME"}
            </h1>
            {data.experience && data.experience[0]?.title && (
              <p className="text-teal-200 font-medium text-sm">{data.experience[0].title}</p>
            )}
          </div>
          <div className="text-right text-xs text-teal-200 space-y-0.5 shrink-0">
            {data.personalInfo?.email && <p>{data.personalInfo.email}</p>}
            {data.personalInfo?.phone && <p>{data.personalInfo.phone}</p>}
            {data.personalInfo?.location && <p>{data.personalInfo.location}</p>}
            {data.personalInfo?.linkedin && <p className="break-all max-w-[180px]">{data.personalInfo.linkedin}</p>}
          </div>
        </div>
      </header>

      {/* Skills Chip Bar */}
      {data.skills && data.skills.length > 0 && (
        <div className="bg-teal-50 border-b border-teal-100 px-10 py-3 flex flex-wrap gap-2">
          {data.skills.map((skill, i) => (
            <span key={i} className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Body */}
      <div className="px-10 py-7">
        {/* Summary */}
        {data.summary && (
          <section className="mb-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-teal-700 mb-2 pb-1 border-b border-teal-100">
              Summary
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 text-justify">{data.summary}</p>
          </section>
        )}

        {/* Two-column Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-teal-700 mb-3 pb-1 border-b border-teal-100">
              Experience
            </h2>
            <div className="grid grid-cols-2 gap-x-6">
              {/* Left col */}
              <div className="space-y-5">
                {leftExp.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-bold text-gray-900 text-xs leading-snug">{exp.title}</h3>
                      <span className="text-[9px] text-gray-400 shrink-0 ml-2">{exp.dates}</span>
                    </div>
                    <p className="text-[10px] text-teal-600 font-medium mb-1">
                      {exp.company}{exp.location ? ` · ${exp.location}` : ""}
                    </p>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="text-[11px] text-gray-600 space-y-0.5 ml-3 list-disc marker:text-teal-400">
                        {exp.bullets.map((b, j) => <li key={j} className="pl-0.5">{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
              {/* Right col */}
              <div className="space-y-5">
                {rightExp.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-bold text-gray-900 text-xs leading-snug">{exp.title}</h3>
                      <span className="text-[9px] text-gray-400 shrink-0 ml-2">{exp.dates}</span>
                    </div>
                    <p className="text-[10px] text-teal-600 font-medium mb-1">
                      {exp.company}{exp.location ? ` · ${exp.location}` : ""}
                    </p>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="text-[11px] text-gray-600 space-y-0.5 ml-3 list-disc marker:text-teal-400">
                        {exp.bullets.map((b, j) => <li key={j} className="pl-0.5">{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Education + Certifications row */}
        <div className="grid grid-cols-2 gap-x-6">
          {data.education && data.education.length > 0 && (
            <section>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-teal-700 mb-2 pb-1 border-b border-teal-100">
                Education
              </h2>
              <div className="space-y-3 mt-2">
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-bold text-gray-900 text-xs">{edu.degree}</h3>
                      <span className="text-[9px] text-gray-400 shrink-0 ml-2">{edu.dates}</span>
                    </div>
                    <p className="text-[10px] text-gray-500">{edu.school}{edu.location ? `, ${edu.location}` : ""}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.certifications && data.certifications.length > 0 && (
            <section>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-teal-700 mb-2 pb-1 border-b border-teal-100">
                Certifications
              </h2>
              <ul className="text-[11px] text-gray-600 space-y-1 mt-2 list-disc ml-3 marker:text-teal-400">
                {data.certifications.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
