import { ResumeData } from "./AtsTemplate";

interface MinimalProTemplateProps {
  content: string | ResumeData;
  className?: string;
}

export function MinimalProTemplate({ content, className = "" }: MinimalProTemplateProps) {
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
    <div className={`font-sans bg-white text-gray-800 max-w-[850px] mx-auto min-h-[1056px] ${className}`}>
      {/* Header Band */}
      <header className="bg-indigo-50 border-b-2 border-indigo-200 px-12 py-8">
        <h1 className="text-3xl font-bold text-indigo-900 mb-1">
          {data.personalInfo?.name || "YOUR NAME"}
        </h1>
        {data.experience && data.experience[0]?.title && (
          <p className="text-base text-indigo-600 font-medium mb-3">{data.experience[0].title}</p>
        )}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {data.personalInfo?.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo?.phone && <span>· {data.personalInfo.phone}</span>}
          {data.personalInfo?.location && <span>· {data.personalInfo.location}</span>}
          {data.personalInfo?.linkedin && <span>· {data.personalInfo.linkedin}</span>}
          {data.personalInfo?.github && <span>· {data.personalInfo.github}</span>}
        </div>
      </header>

      {/* Body */}
      <div className="px-12 py-8 space-y-7">
        {/* Summary */}
        {data.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3 border-l-2 border-indigo-400 pl-3">
              Summary
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 text-justify">{data.summary}</p>
          </section>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3 border-l-2 border-indigo-400 pl-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="text-xs px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-4 border-l-2 border-indigo-400 pl-3">
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                    <span className="text-xs text-gray-500 shrink-0 ml-3">{exp.dates}</span>
                  </div>
                  <p className="text-sm text-indigo-600 font-medium mb-2">
                    {exp.company}{exp.location ? ` — ${exp.location}` : ""}
                  </p>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc marker:text-indigo-300">
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
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-4 border-l-2 border-indigo-400 pl-3">
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
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
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3 border-l-2 border-indigo-400 pl-3">
              Certifications
            </h2>
            <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc marker:text-indigo-300">
              {data.certifications.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
