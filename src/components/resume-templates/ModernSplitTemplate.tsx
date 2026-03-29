import { ResumeData } from "./AtsTemplate";

interface ModernSplitTemplateProps {
  content: string | ResumeData;
  className?: string;
}

export function ModernSplitTemplate({ content, className = "" }: ModernSplitTemplateProps) {
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
    <div className={`font-sans bg-white text-gray-800 leading-normal max-w-[850px] mx-auto flex shadow-sm min-h-[1056px] overflow-hidden ${className}`}>
      
      {/* Left Column (Accent Sidebar) */}
      <div className="w-[32%] bg-zinc-900 text-zinc-100 p-8 flex flex-col pt-12">
        {/* Contact Info */}
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-700 pb-2 mb-4">
            Contact
          </h2>
          <div className="flex flex-col gap-3 text-sm">
            {data.personalInfo?.email && <div>{data.personalInfo.email}</div>}
            {data.personalInfo?.phone && <div>{data.personalInfo.phone}</div>}
            {data.personalInfo?.location && <div>{data.personalInfo.location}</div>}
            {data.personalInfo?.linkedin && <div>{data.personalInfo.linkedin}</div>}
            {data.personalInfo?.github && <div>{data.personalInfo.github}</div>}
          </div>
        </section>

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-700 pb-2 mb-4">
              Expertise
            </h2>
            <div className="flex flex-col gap-2 text-sm">
              {data.skills.map((skill, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 mt-1.5 shrink-0" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-700 pb-2 mb-4">
              Certifications
            </h2>
            <div className="flex flex-col gap-3 text-sm">
              {data.certifications.map((cert, i) => (
                <div key={i}>{cert}</div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Right Column (Main Content) */}
      <div className="w-[68%] p-10 pt-12 flex flex-col">
        {/* Header (Name) */}
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold uppercase tracking-tight text-zinc-900 mb-2">
            {data.personalInfo?.name || "YOUR NAME"}
          </h1>
          {data.experience && data.experience[0] && (
            <h2 className="text-xl font-medium text-zinc-500">
              {data.experience[0].title}
            </h2>
          )}
        </header>

        {/* Summary */}
        {data.summary && (
          <section className="mb-8">
            <p className="text-sm leading-relaxed text-zinc-600 text-justify">
              {data.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 border-b-2 border-zinc-100 pb-2 mb-5">
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-zinc-900">{exp.title}</h3>
                    <span className="text-xs font-medium text-zinc-500 shrink-0 ml-2">
                      {exp.dates}
                    </span>
                  </div>
                  {(exp.company || exp.location) && (
                    <div className="text-sm font-medium text-zinc-600 mb-2">
                      {exp.company}{exp.location ? ` • ${exp.location}` : ""}
                    </div>
                  )}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="text-sm text-zinc-600 leading-relaxed space-y-1.5 ml-4 list-disc marker:text-zinc-300">
                      {exp.bullets.map((bullet, idx) => (
                        <li key={idx} className="pl-1 text-justify">{bullet}</li>
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
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 border-b-2 border-zinc-100 pb-2 mb-5">
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-zinc-900">{edu.degree}</h3>
                    <span className="text-xs font-medium text-zinc-500 shrink-0 ml-2">
                      {edu.dates}
                    </span>
                  </div>
                  <div className="text-sm text-zinc-600">
                    {edu.school}{edu.location ? `, ${edu.location}` : ""}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

    </div>
  );
}
