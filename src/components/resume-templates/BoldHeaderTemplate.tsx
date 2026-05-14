import { ResumeData } from "./AtsTemplate";

interface BoldHeaderTemplateProps {
  content: string | ResumeData;
  className?: string;
}

export function BoldHeaderTemplate({ content, className = "" }: BoldHeaderTemplateProps) {
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
      {/* Bold Header Block */}
      <header className="bg-gray-900 text-white px-12 py-10">
        <h1 className="text-4xl font-black tracking-tight mb-1">
          {data.personalInfo?.name || "YOUR NAME"}
        </h1>
        {data.experience && data.experience[0]?.title && (
          <p className="text-lg text-gray-300 font-medium mb-4">{data.experience[0].title}</p>
        )}
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-400">
          {data.personalInfo?.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo?.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo?.location && <span>{data.personalInfo.location}</span>}
          {data.personalInfo?.linkedin && <span>{data.personalInfo.linkedin}</span>}
          {data.personalInfo?.github && <span>{data.personalInfo.github}</span>}
        </div>
      </header>

      {/* Skills Grid */}
      {data.skills && data.skills.length > 0 && (
        <div className="bg-gray-50 border-b border-gray-200 px-12 py-5">
          <div className="grid grid-cols-4 gap-2">
            {data.skills.map((skill, i) => (
              <div key={i} className="text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded px-2 py-1.5 text-center truncate">
                {skill}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Body */}
      <div className="px-12 py-8 space-y-7">
        {/* Summary */}
        {data.summary && (
          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-3 pb-1.5 border-b-2 border-gray-900">
              Profile
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 text-justify">{data.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4 pb-1.5 border-b-2 border-gray-900">
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-gray-900">{exp.title}</h3>
                    <span className="text-xs text-gray-500 shrink-0 ml-3 font-medium">{exp.dates}</span>
                  </div>
                  <p className="text-sm text-gray-500 italic mb-2">
                    {exp.company}{exp.location ? ` · ${exp.location}` : ""}
                  </p>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="text-sm text-gray-600 space-y-1.5 ml-4 list-disc marker:text-gray-400">
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
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4 pb-1.5 border-b-2 border-gray-900">
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <span className="text-xs text-gray-500 shrink-0 ml-3">{edu.dates}</span>
                  </div>
                  <p className="text-sm text-gray-500">{edu.school}{edu.location ? `, ${edu.location}` : ""}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-3 pb-1.5 border-b-2 border-gray-900">
              Certifications
            </h2>
            <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc marker:text-gray-400">
              {data.certifications.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
