import { ResumeData } from "./AtsTemplate";

interface GradientProTemplateProps {
  content: string | ResumeData;
  className?: string;
}

export function GradientProTemplate({ content, className = "" }: GradientProTemplateProps) {
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
    <div className={`font-sans bg-white text-gray-800 max-w-[850px] mx-auto min-h-[1056px] overflow-hidden ${className}`}>
      {/* Gradient Header */}
      <header
        className="px-12 py-11 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #0ea5e9 60%, #38bdf8 100%)" }}
      >
        {/* Decorative circle */}
        <div
          className="absolute -top-10 -right-10 w-52 h-52 rounded-full opacity-10"
          style={{ background: "white" }}
        />
        <div
          className="absolute bottom-0 left-1/2 w-96 h-16 opacity-5"
          style={{ background: "white", borderRadius: "50%" }}
        />
        <h1 className="text-4xl font-extrabold tracking-tight mb-1 relative z-10">
          {data.personalInfo?.name || "YOUR NAME"}
        </h1>
        {data.experience && data.experience[0]?.title && (
          <p className="text-lg font-medium text-blue-100 mb-4 relative z-10">{data.experience[0].title}</p>
        )}
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-blue-100 relative z-10">
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
            <h2 className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-3 flex items-center gap-2">
              <span className="w-6 h-px bg-sky-400 inline-block" />
              Professional Summary
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 text-justify">{data.summary}</p>
          </section>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-3 flex items-center gap-2">
              <span className="w-6 h-px bg-sky-400 inline-block" />
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="text-xs px-3 py-1 bg-sky-50 text-sky-700 rounded border border-sky-200 font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-sky-400 inline-block" />
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-gray-900">{exp.title}</h3>
                    <span className="text-xs text-gray-500 shrink-0 ml-3">{exp.dates}</span>
                  </div>
                  <p className="text-sm font-semibold text-sky-600 mb-2">
                    {exp.company}{exp.location ? ` · ${exp.location}` : ""}
                  </p>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="text-sm text-gray-600 space-y-1.5 ml-4 list-disc marker:text-sky-300">
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
            <h2 className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-sky-400 inline-block" />
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
            <h2 className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-3 flex items-center gap-2">
              <span className="w-6 h-px bg-sky-400 inline-block" />
              Certifications
            </h2>
            <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc marker:text-sky-300">
              {data.certifications.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
