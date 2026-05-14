import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "./AtsTemplate";

const TEAL = "#0f766e";
const TEAL_LIGHT = "#f0fdfa";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, backgroundColor: "#ffffff" },
  header: { backgroundColor: TEAL, paddingHorizontal: 36, paddingVertical: 22, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  nameBlock: { flex: 1 },
  name: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#ffffff", marginBottom: 2 },
  jobTitle: { fontSize: 9, color: "#99f6e4" },
  contactBlock: { alignItems: "flex-end" },
  contactItem: { fontSize: 7.5, color: "#99f6e4", marginBottom: 2 },
  skillsBar: { backgroundColor: TEAL_LIGHT, borderBottomWidth: 1, borderBottomColor: "#ccfbf1", paddingHorizontal: 36, paddingVertical: 8, flexDirection: "row", flexWrap: "wrap", gap: 4 },
  skillChip: { fontSize: 7.5, color: TEAL, backgroundColor: "#ccfbf1", borderWidth: 1, borderColor: "#5eead4", paddingHorizontal: 5, paddingVertical: 1.5, borderRadius: 20 },
  body: { paddingHorizontal: 36, paddingVertical: 18 },
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", textTransform: "uppercase", color: TEAL, borderBottomWidth: 1, borderBottomColor: "#ccfbf1", paddingBottom: 2, marginBottom: 7 },
  summary: { fontSize: 9, color: "#4b5563", textAlign: "justify", lineHeight: 1.5 },
  twoColRow: { flexDirection: "row", gap: 16 },
  col: { flex: 1 },
  itemBlock: { marginBottom: 9 },
  itemHeaderRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
  itemTitle: { fontFamily: "Helvetica-Bold", fontSize: 9, color: "#111827" },
  itemDates: { fontSize: 7, color: "#9ca3af" },
  itemCompany: { fontSize: 8, color: TEAL, marginBottom: 2 },
  bulletRow: { flexDirection: "row", marginBottom: 2 },
  bulletDot: { fontSize: 5.5, color: "#5eead4", marginTop: 2.5, marginRight: 3 },
  bulletText: { flex: 1, fontSize: 8, color: "#4b5563" },
});

interface CompactInfographicPdfTemplateProps { data: ResumeData; }

export const CompactInfographicPdfTemplate = ({ data }: CompactInfographicPdfTemplateProps) => {
  const halfExp = data.experience ? Math.ceil(data.experience.length / 2) : 0;
  const leftExp = data.experience ? data.experience.slice(0, halfExp) : [];
  const rightExp = data.experience ? data.experience.slice(halfExp) : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.nameBlock}>
            <Text style={styles.name}>{data.personalInfo?.name || "YOUR NAME"}</Text>
            {data.experience?.[0]?.title && <Text style={styles.jobTitle}>{data.experience[0].title}</Text>}
          </View>
          <View style={styles.contactBlock}>
            {data.personalInfo?.email && <Text style={styles.contactItem}>{data.personalInfo.email}</Text>}
            {data.personalInfo?.phone && <Text style={styles.contactItem}>{data.personalInfo.phone}</Text>}
            {data.personalInfo?.location && <Text style={styles.contactItem}>{data.personalInfo.location}</Text>}
            {data.personalInfo?.linkedin && <Text style={styles.contactItem}>{data.personalInfo.linkedin}</Text>}
          </View>
        </View>
        {data.skills && data.skills.length > 0 && (
          <View style={styles.skillsBar}>
            {data.skills.map((s, i) => <Text key={i} style={styles.skillChip}>{s}</Text>)}
          </View>
        )}
        <View style={styles.body}>
          {data.summary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Summary</Text>
              <Text style={styles.summary}>{data.summary}</Text>
            </View>
          )}
          {data.experience && data.experience.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience</Text>
              <View style={styles.twoColRow}>
                <View style={styles.col}>
                  {leftExp.map((exp, i) => (
                    <View key={i} style={styles.itemBlock}>
                      <View style={styles.itemHeaderRow}>
                        <Text style={styles.itemTitle}>{exp.title}</Text>
                        <Text style={styles.itemDates}>{exp.dates}</Text>
                      </View>
                      <Text style={styles.itemCompany}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</Text>
                      {exp.bullets?.map((b, j) => (
                        <View key={j} style={styles.bulletRow}>
                          <Text style={styles.bulletDot}>•</Text>
                          <Text style={styles.bulletText}>{b}</Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
                <View style={styles.col}>
                  {rightExp.map((exp, i) => (
                    <View key={i} style={styles.itemBlock}>
                      <View style={styles.itemHeaderRow}>
                        <Text style={styles.itemTitle}>{exp.title}</Text>
                        <Text style={styles.itemDates}>{exp.dates}</Text>
                      </View>
                      <Text style={styles.itemCompany}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</Text>
                      {exp.bullets?.map((b, j) => (
                        <View key={j} style={styles.bulletRow}>
                          <Text style={styles.bulletDot}>•</Text>
                          <Text style={styles.bulletText}>{b}</Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
          <View style={styles.twoColRow}>
            {data.education && data.education.length > 0 && (
              <View style={[styles.col, styles.section]}>
                <Text style={styles.sectionTitle}>Education</Text>
                {data.education.map((edu, i) => (
                  <View key={i} style={styles.itemBlock}>
                    <View style={styles.itemHeaderRow}>
                      <Text style={styles.itemTitle}>{edu.degree}</Text>
                      <Text style={styles.itemDates}>{edu.dates}</Text>
                    </View>
                    <Text style={styles.itemCompany}>{edu.school}{edu.location ? `, ${edu.location}` : ""}</Text>
                  </View>
                ))}
              </View>
            )}
            {data.certifications && data.certifications.length > 0 && (
              <View style={[styles.col, styles.section]}>
                <Text style={styles.sectionTitle}>Certifications</Text>
                {data.certifications.map((c, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{c}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};
