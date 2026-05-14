import { ResumeData } from "./AtsTemplate";

interface ClassicAcademicTemplateProps {
  content: string | ResumeData;
  className?: string;
}

export function ClassicAcademicTemplate({ content, className = "" }: ClassicAcademicTemplateProps) {
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
      className={`bg-white text-gray-900 max-w-[850px] mx-auto min-h-[1056px] px-16 py-10 ${className}`}
      style={{ fontFamily: "'Palatino Linotype', 'Book Antiqua', 'Palatino', Georgia, serif" }}
    >
      {/* Centered Header */}
      <header className="text-center mb-6">
        <h1 className="text-[28px] font-bold mb-1 tracking-wide">
          {data.personalInfo?.name || "YOUR NAME"}
        </h1>
        {data.experience && data.experience[0]?.title && (
          <p className="text-base text-gray-600 italic mb-2">{data.experience[0].title}</p>
        )}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-0.5 text-sm text-gray-600">
          {data.personalInfo?.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo?.phone && <span>|  {data.personalInfo.phone}</span>}
          {data.personalInfo?.location && <span>|  {data.personalInfo.location}</span>}
          {data.personalInfo?.linkedin && <span>|  {data.personalInfo.linkedin}</span>}
          {data.personalInfo?.github && <span>|  {data.personalInfo.github}</span>}
        </div>
      </header>

      <hr className="border-t-2 border-gray-800 mb-6" />

      <div className="space-y-5">
        {/* Summary */}
        {data.summary && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-gray-900 mb-2">
              Research &amp; Professional Summary
            </h2>
            <hr className="border-t border-gray-400 mb-3" />
            <p className="text-sm leading-relaxed text-gray-700 text-justify">{data.summary}</p>
          </section>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-gray-900 mb-2">
              Areas of Expertise
            </h2>
            <hr className="border-t border-gray-400 mb-3" />
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-700">
              {data.skills.map((skill, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-gray-600 inline-block" />
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-gray-900 mb-2">
              Academic &amp; Professional Experience
            </h2>
            <hr className="border-t border-gray-400 mb-3" />
            <div className="space-y-5">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900">{exp.title}</h3>
                    <span className="text-sm text-gray-600 italic shrink-0 ml-3">{exp.dates}</span>
                  </div>
                  <p className="text-sm italic text-gray-700 mb-2">
                    {exp.company}{exp.location ? `, ${exp.location}` : ""}
                  </p>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="text-sm text-gray-700 space-y-1 ml-5 list-disc">
                      {exp.bullets.map((b, j) => <li key={j} className="text-justify leading-relaxed">{b}</li>)}
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
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-gray-900 mb-2">
              Education
            </h2>
            <hr className="border-t border-gray-400 mb-3" />
            <div className="space-y-3">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <span className="text-sm text-gray-600 italic shrink-0 ml-3">{edu.dates}</span>
                  </div>
                  <p className="text-sm italic text-gray-700">{edu.school}{edu.location ? `, ${edu.location}` : ""}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-gray-900 mb-2">
              Honors &amp; Certifications
            </h2>
            <hr className="border-t border-gray-400 mb-3" />
            <ul className="text-sm text-gray-700 space-y-1 ml-5 list-disc">
              {data.certifications.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </section>
        )}
      </div>

      <hr className="border-t border-gray-400 mt-8" />
    </div>
  );
}
