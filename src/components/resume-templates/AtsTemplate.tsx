export interface ResumeData {
  personalInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
  };
  summary?: string;
  experience?: Array<{
    title?: string;
    company?: string;
    location?: string;
    dates?: string;
    bullets?: string[];
  }>;
  education?: Array<{
    degree?: string;
    school?: string;
    location?: string;
    dates?: string;
  }>;
  skills?: string[];
  certifications?: string[];
}

interface AtsTemplateProps {
  content: string | ResumeData;
  className?: string; // Forward ref to capture for PDF not needed if we render on screen 
}

export function AtsTemplate({ content, className = "" }: AtsTemplateProps) {
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

  // Fallback to old pure-text view if JSON parsing fails
  if (!data || rawTextFallback) {
    return (
      <div className={`whitespace-pre-wrap text-sm leading-relaxed text-foreground font-[system-ui] ${className}`}>
        {rawTextFallback || JSON.stringify(data)}
      </div>
    );
  }

  // Premium ATS Layout Styling
  // Strictly clean, bordered sections, centered header, professional serif typography
  return (
    <div className={`text-black bg-white leading-[1.4] max-w-[850px] mx-auto p-[40px] ${className}`} style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: "11pt" }}>
      
      {/* 1. Header (Centered) */}
      <header className="text-center mb-[15px]">
        <h1 className="text-[22pt] font-bold uppercase mb-1 text-black">
          {data.personalInfo?.name || "YOUR NAME"}
        </h1>
        
        <div className="flex flex-wrap justify-center items-center gap-1.5 text-[10pt] text-gray-800">
          {[
            data.personalInfo?.location,
            data.personalInfo?.email,
            data.personalInfo?.phone,
            data.personalInfo?.linkedin,
            data.personalInfo?.github
          ].filter(Boolean).map((item, i, arr) => (
            <span key={i} className="flex items-center">
              <span>{item}</span>
              {i < arr.length - 1 && <span className="mx-1.5 text-black">|</span>}
            </span>
          ))}
        </div>
      </header>

      {/* 2. Professional Summary */}
      {data.summary && (
        <section className="mb-[14px]">
          <h2 className="text-[12pt] font-bold uppercase text-black border-b border-black pb-[2px] mb-[6px]">
            Professional Summary
          </h2>
          <p className="text-justify">{data.summary}</p>
        </section>
      )}

      {/* 3. Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-[14px]">
          <h2 className="text-[12pt] font-bold uppercase text-black border-b border-black pb-[2px] mb-[6px]">
            Core Competencies
          </h2>
          <div className="flex flex-wrap">
            {data.skills.map((skill, index) => (
              <span key={index} className="flex items-center mr-2 mb-0.5">
                <span className="mr-1 text-black text-[10pt] w-[10px]">•</span> {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 4. Professional Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-[14px]">
          <h2 className="text-[12pt] font-bold uppercase text-black border-b border-black pb-[2px] mb-[6px]">
            Professional Experience
          </h2>
          <div className="space-y-[8px]">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline font-bold text-black mb-[2px]">
                  <h3 className="text-[11pt]">{exp.title}</h3>
                  <span className="text-[10pt] font-normal">{exp.dates}</span>
                </div>
                {(exp.company || exp.location) && (
                  <div className="flex justify-between items-baseline text-black italic text-[10pt] mb-[4px]">
                    <span>{exp.company}</span>
                    <span>{exp.location}</span>
                  </div>
                )}
                {exp.bullets && exp.bullets.length > 0 && (
                  <div className="ml-[10px] space-y-[2px]">
                    {exp.bullets.map((bullet, bIndex) => (
                      <div key={bIndex} className="flex text-justify text-[11pt]">
                        <span className="w-[10px] text-[10pt] shrink-0">•</span>
                        <span className="flex-1">{bullet}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-[14px]">
          <h2 className="text-[12pt] font-bold uppercase text-black border-b border-black pb-[2px] mb-[6px]">
            Education
          </h2>
          <div className="space-y-[8px]">
            {data.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline font-bold text-black mb-[2px]">
                  <h3 className="text-[11pt]">{edu.degree}</h3>
                  <span className="text-[10pt] font-normal">{edu.dates}</span>
                </div>
                <div className="flex justify-between items-baseline text-black italic text-[10pt] mb-[4px]">
                  <span>{edu.school}{edu.location ? `, ${edu.location}` : ""}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-[14px]">
          <h2 className="text-[12pt] font-bold uppercase text-black border-b border-black pb-[2px] mb-[6px]">
            Certifications
          </h2>
          <div className="space-y-[2px]">
            {data.certifications.map((cert, index) => (
              <div key={index} className="text-[11pt] flex items-start">
                <span className="w-[10px] text-[10pt] shrink-0">•</span>
                <span className="flex-1">{cert}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
