import { ResumeData } from "./AtsTemplate";

interface ElegantTimelineTemplateProps {
  content: string | ResumeData;
  className?: string;
}

export function ElegantTimelineTemplate({ content, className = "" }: ElegantTimelineTemplateProps) {
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
      {/* Elegant top stripe */}
      <div className="h-1.5 bg-gradient-to-r from-rose-400 via-pink-500 to-fuchsia-500" />

      {/* Header */}
      <header className="px-12 pt-9 pb-6 border-b border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">
          {data.personalInfo?.name || "YOUR NAME"}
        </h1>
        {data.experience && data.experience[0]?.title && (
          <p className="text-base text-rose-500 font-medium mb-3">{data.experience[0].title}</p>
        )}
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500">
          {data.personalInfo?.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo?.phone && <span>· {data.personalInfo.phone}</span>}
          {data.personalInfo?.location && <span>· {data.personalInfo.location}</span>}
          {data.personalInfo?.linkedin && <span>· {data.personalInfo.linkedin}</span>}
          {data.personalInfo?.github && <span>· {data.personalInfo.github}</span>}
        </div>
      </header>

      <div className="px-12 py-8 space-y-8">
        {/* Summary */}
        {data.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-3">About</h2>
            <p className="text-sm leading-relaxed text-gray-600 text-justify">{data.summary}</p>
          </section>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="text-xs px-3 py-1 bg-rose-50 text-rose-700 rounded-full border border-rose-200">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience with timeline */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-5">Experience</h2>
            <div className="relative ml-3">
              {/* Vertical line */}
              <div className="absolute left-0 top-2 bottom-0 w-px bg-rose-200" />
              <div className="space-y-7">
                {data.experience.map((exp, i) => (
                  <div key={i} className="relative pl-7">
                    {/* Dot marker */}
                    <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-rose-400 ring-2 ring-white" />
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-bold text-gray-900">{exp.title}</h3>
                      <span className="text-xs text-gray-400 shrink-0 ml-3">{exp.dates}</span>
                    </div>
                    <p className="text-sm text-rose-500 font-medium mb-2">
                      {exp.company}{exp.location ? ` · ${exp.location}` : ""}
                    </p>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="text-sm text-gray-600 space-y-1 list-disc ml-4 marker:text-rose-300">
                        {exp.bullets.map((b, j) => <li key={j} className="pl-1 text-justify">{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-4">Education</h2>
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                  <div>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-bold text-gray-900 text-sm">{edu.degree}</h3>
                      <span className="text-xs text-gray-400 shrink-0 ml-3">{edu.dates}</span>
                    </div>
                    <p className="text-sm text-gray-500">{edu.school}{edu.location ? `, ${edu.location}` : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-3">Certifications</h2>
            <ul className="text-sm text-gray-600 space-y-1">
              {data.certifications.map((c, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-rose-400">·</span>
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
