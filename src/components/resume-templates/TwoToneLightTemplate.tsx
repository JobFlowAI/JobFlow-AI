import { ResumeData } from "./AtsTemplate";

interface TwoToneLightTemplateProps {
  content: string | ResumeData;
  className?: string;
}

export function TwoToneLightTemplate({ content, className = "" }: TwoToneLightTemplateProps) {
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
      {/* Warm Gray Sidebar */}
      <div className="w-[260px] shrink-0 px-7 py-10 flex flex-col" style={{ backgroundColor: "#f5f0eb" }}>
        {/* Name */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-800 leading-snug mb-1">
            {data.personalInfo?.name || "YOUR NAME"}
          </h1>
          {data.experience && data.experience[0]?.title && (
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">{data.experience[0].title}</p>
          )}
        </div>

        {/* Contact */}
        <section className="mb-7">
          <h2 className="text-[9px] font-bold uppercase tracking-widest text-amber-800 mb-2 pb-1.5 border-b border-amber-200">
            Contact
          </h2>
          <div className="space-y-2 text-xs text-gray-600 mt-2">
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
            <h2 className="text-[9px] font-bold uppercase tracking-widest text-amber-800 mb-2 pb-1.5 border-b border-amber-200">
              Skills
            </h2>
            <div className="space-y-2 mt-2">
              {data.skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-xs text-gray-700">{skill}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section>
            <h2 className="text-[9px] font-bold uppercase tracking-widest text-amber-800 mb-2 pb-1.5 border-b border-amber-200">
              Certifications
            </h2>
            <div className="space-y-2 mt-2">
              {data.certifications.map((c, i) => (
                <p key={i} className="text-xs text-gray-600">{c}</p>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* White Main Column */}
      <div className="flex-1 px-9 py-10 space-y-7">
        {/* Summary */}
        {data.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-3 pb-1.5 border-b border-gray-100">
              About
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 text-justify">{data.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-4 pb-1.5 border-b border-gray-100">
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-gray-900 text-sm">{exp.title}</h3>
                    <span className="text-[10px] text-gray-400 shrink-0 ml-3">{exp.dates}</span>
                  </div>
                  <p className="text-xs font-semibold text-amber-700 mb-2">
                    {exp.company}{exp.location ? ` · ${exp.location}` : ""}
                  </p>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="text-sm text-gray-600 space-y-1 list-disc ml-4 marker:text-amber-300">
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
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-4 pb-1.5 border-b border-gray-100">
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={i}>
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
