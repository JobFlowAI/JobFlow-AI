import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { ResumeData } from "./AtsTemplate";

// No extra font registration needed if we stick to standard fonts for now
// Standard PDF fonts: Helvetica, Helvetica-Bold, Helvetica-Oblique
// We will use Helvetica to give the Modern San-Serif creative look

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
  },
  leftColumn: {
    width: "32%",
    backgroundColor: "#18181b", // zinc-900
    color: "#f4f4f5", // zinc-100
    padding: 30,
    paddingTop: 40,
    height: "100%",
  },
  rightColumn: {
    width: "68%",
    backgroundColor: "#ffffff",
    color: "#3f3f46", // zinc-700
    padding: 35,
    paddingTop: 45,
    height: "100%",
  },
  // --- Left Column Styles ---
  leftSection: {
    marginBottom: 25,
  },
  sidebarTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    color: "#a1a1aa", // zinc-400
    borderBottomWidth: 1,
    borderBottomColor: "#3f3f46", // zinc-700
    paddingBottom: 4,
    marginBottom: 10,
  },
  contactItem: {
    marginBottom: 6,
    fontSize: 9,
    color: "#d4d4d8", // zinc-300
  },
  skillRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  skillBullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#71717a", // zinc-500
    marginTop: 4,
    marginRight: 6,
  },
  skillText: {
    flex: 1,
    fontSize: 9,
    color: "#d4d4d8",
  },
  certText: {
    marginBottom: 6,
    fontSize: 9,
    color: "#d4d4d8",
  },
  
  // --- Right Column Styles ---
  name: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    color: "#18181b",
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  titleLine: {
    fontSize: 12,
    fontFamily: "Helvetica",
    color: "#71717a",
    marginBottom: 16,
  },
  summary: {
    fontSize: 10,
    color: "#52525b", // zinc-600
    textAlign: "justify",
    marginBottom: 20,
  },
  rightSectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    color: "#18181b",
    borderBottomWidth: 2,
    borderBottomColor: "#f4f4f5", // zinc-100
    paddingBottom: 4,
    marginBottom: 15,
  },
  itemBlock: {
    marginBottom: 15,
  },
  itemHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 2,
  },
  itemTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: "#18181b",
  },
  itemDates: {
    fontSize: 9,
    color: "#71717a",
  },
  itemCompanyRow: {
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#52525b",
    marginBottom: 6,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 4,
    marginLeft: 8,
  },
  bulletPointContainer: {
    width: 8,
    marginTop: 5,
    marginRight: 4,
  },
  bulletPoint: {
    fontSize: 6,
    color: "#d4d4d8",
  },
  bulletContent: {
    flex: 1,
    fontSize: 10,
    color: "#52525b",
    textAlign: "justify",
  },
});

interface ModernSplitPdfTemplateProps {
  data: ResumeData;
}

export const ModernSplitPdfTemplate = ({ data }: ModernSplitPdfTemplateProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* LEFT COLUMN */}
        <View style={styles.leftColumn}>
          {/* Contact */}
          <View style={styles.leftSection}>
            <Text style={styles.sidebarTitle}>Contact</Text>
            {data.personalInfo?.email && <Text style={styles.contactItem}>{data.personalInfo.email}</Text>}
            {data.personalInfo?.phone && <Text style={styles.contactItem}>{data.personalInfo.phone}</Text>}
            {data.personalInfo?.location && <Text style={styles.contactItem}>{data.personalInfo.location}</Text>}
            {data.personalInfo?.linkedin && <Text style={styles.contactItem}>{data.personalInfo.linkedin}</Text>}
            {data.personalInfo?.github && <Text style={styles.contactItem}>{data.personalInfo.github}</Text>}
          </View>

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <View style={styles.leftSection}>
              <Text style={styles.sidebarTitle}>Expertise</Text>
              {data.skills.map((skill, index) => (
                <View key={index} style={styles.skillRow}>
                  <View style={styles.skillBullet} />
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <View style={styles.leftSection}>
              <Text style={styles.sidebarTitle}>Certifications</Text>
              {data.certifications.map((cert, index) => (
                <Text key={index} style={styles.certText}>{cert}</Text>
              ))}
            </View>
          )}
        </View>

        {/* RIGHT COLUMN */}
        <View style={styles.rightColumn}>
          
          <Text style={styles.name}>{data.personalInfo?.name || "YOUR NAME"}</Text>
          {data.experience && data.experience.length > 0 && data.experience[0].title && (
             <Text style={styles.titleLine}>{data.experience[0].title}</Text>
          )}

          {/* Summary */}
          {data.summary && (
            <Text style={styles.summary}>{data.summary}</Text>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <View>
              <Text style={styles.rightSectionTitle}>Experience</Text>
              {data.experience.map((exp, index) => (
                <View key={index} style={styles.itemBlock}>
                  <View style={styles.itemHeaderRow}>
                    <Text style={styles.itemTitle}>{exp.title}</Text>
                    <Text style={styles.itemDates}>{exp.dates}</Text>
                  </View>
                  {(exp.company || exp.location) && (
                    <Text style={styles.itemCompanyRow}>
                      {exp.company}{exp.location ? ` • ${exp.location}` : ""}
                    </Text>
                  )}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <View>
                      {exp.bullets.map((bullet, bIndex) => (
                        <View key={bIndex} style={styles.bulletRow}>
                          <View style={styles.bulletPointContainer}>
                            <Text style={styles.bulletPoint}>•</Text>
                          </View>
                          <Text style={styles.bulletContent}>{bullet}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <View>
              <Text style={styles.rightSectionTitle}>Education</Text>
              {data.education.map((edu, index) => (
                <View key={index} style={styles.itemBlock}>
                  <View style={styles.itemHeaderRow}>
                    <Text style={styles.itemTitle}>{edu.degree}</Text>
                    <Text style={styles.itemDates}>{edu.dates}</Text>
                  </View>
                  <Text style={styles.itemCompanyRow}>
                    {edu.school}{edu.location ? `, ${edu.location}` : ""}
                  </Text>
                </View>
              ))}
            </View>
          )}

        </View>
      </Page>
    </Document>
  );
};
