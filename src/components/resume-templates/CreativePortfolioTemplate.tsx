import { ResumeData } from "./AtsTemplate";

interface CreativePortfolioTemplateProps {
  content: string | ResumeData;
  className?: string;
}

export function CreativePortfolioTemplate({ content, className = "" }: CreativePortfolioTemplateProps) {
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
    <div className={`font-sans bg-white text-gray-800 max-w-[850px] mx-auto min-h-[1056px] flex ${className}`}>
      {/* Thin left color strip */}
      <div className="w-[5px] bg-gradient-to-b from-violet-600 to-fuchsia-500 shrink-0" />

      {/* Sidebar */}
      <div className="w-[220px] bg-gray-50 border-r border-gray-100 px-6 py-10 flex flex-col shrink-0">
        {/* Name block */}
        <div className="mb-8">
          <h1 className="text-xl font-black text-gray-900 leading-tight mb-1">
            {data.personalInfo?.name || "YOUR NAME"}
          </h1>
          {data.experience && data.experience[0]?.title && (
            <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider">{data.experience[0].title}</p>
          )}
        </div>

        {/* Contact */}
        <section className="mb-7">
          <h2 className="text-[9px] font-bold uppercase tracking-widest text-violet-500 mb-3">Contact</h2>
          <div className="space-y-2 text-xs text-gray-600">
            {data.personalInfo?.email && <p>{data.personalInfo.email}</p>}
            {data.personalInfo?.phone && <p>{data.personalInfo.phone}</p>}
            {data.personalInfo?.location && <p>{data.personalInfo.location}</p>}
            {data.personalInfo?.linkedin && <p className="break-all">{data.personalInfo.linkedin}</p>}
            {data.personalInfo?.github && <p className="break-all">{data.personalInfo.github}</p>}
          </div>
        </section>

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section className="mb-7">
            <h2 className="text-[9px] font-bold uppercase tracking-widest text-violet-500 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section>
            <h2 className="text-[9px] font-bold uppercase tracking-widest text-violet-500 mb-3">Certifications</h2>
            <div className="space-y-2 text-xs text-gray-600">
              {data.certifications.map((c, i) => <p key={i}>{c}</p>)}
            </div>
          </section>
        )}
      </div>

      {/* Main Canvas */}
      <div className="flex-1 px-10 py-10 space-y-7">
        {/* Summary */}
        {data.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-violet-600 mb-3">About</h2>
            <p className="text-sm leading-relaxed text-gray-600 text-justify">{data.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-violet-600 mb-4">Experience</h2>
            <div className="space-y-6">
              {data.experience.map((exp, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-violet-200">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-gray-900 text-sm">{exp.title}</h3>
                    <span className="text-[10px] text-gray-400 shrink-0 ml-3">{exp.dates}</span>
                  </div>
                  <p className="text-xs font-semibold text-violet-500 mb-2">
                    {exp.company}{exp.location ? ` · ${exp.location}` : ""}
                  </p>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="text-sm text-gray-600 space-y-1 list-disc ml-4 marker:text-violet-300">
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
            <h2 className="text-xs font-bold uppercase tracking-widest text-violet-600 mb-4">Education</h2>
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={i} className="pl-4 border-l-2 border-violet-200">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-gray-900 text-sm">{edu.degree}</h3>
                    <span className="text-[10px] text-gray-400 shrink-0 ml-3">{edu.dates}</span>
                  </div>
                  <p className="text-xs text-gray-500">{edu.school}{edu.location ? `, ${edu.location}` : ""}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
