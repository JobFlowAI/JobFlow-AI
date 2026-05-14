import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "./AtsTemplate";

const SKY = "#0284c7";
const SKY_LIGHT = "#e0f2fe";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, backgroundColor: "#ffffff" },
  header: { backgroundColor: "#1e3a5f", paddingHorizontal: 40, paddingVertical: 30 },
  name: { fontSize: 24, fontFamily: "Helvetica-Bold", color: "#ffffff", marginBottom: 3 },
  jobTitle: { fontSize: 12, color: "#bae6fd", marginBottom: 10 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  contactItem: { fontSize: 8, color: "#bae6fd" },
  body: { paddingHorizontal: 40, paddingVertical: 22 },
  section: { marginBottom: 16 },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  sectionLine: { width: 20, height: 1.5, backgroundColor: SKY, marginRight: 6 },
  sectionTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", textTransform: "uppercase", color: SKY },
  summary: { fontSize: 9.5, color: "#4b5563", textAlign: "justify", lineHeight: 1.5 },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
  skillChip: { fontSize: 8, color: SKY, backgroundColor: SKY_LIGHT, borderWidth: 1, borderColor: "#bae6fd", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 2 },
  itemBlock: { marginBottom: 12 },
  itemHeaderRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  itemTitle: { fontFamily: "Helvetica-Bold", fontSize: 10, color: "#111827" },
  itemDates: { fontSize: 8, color: "#6b7280" },
  itemCompany: { fontSize: 9, color: SKY, marginBottom: 4 },
  bulletRow: { flexDirection: "row", marginBottom: 3, marginLeft: 8 },
  bulletDot: { fontSize: 6, color: "#7dd3fc", marginTop: 3, marginRight: 4 },
  bulletText: { flex: 1, fontSize: 9, color: "#4b5563", textAlign: "justify" },
});

interface GradientProPdfTemplateProps { data: ResumeData; }

export const GradientProPdfTemplate = ({ data }: GradientProPdfTemplateProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{data.personalInfo?.name || "YOUR NAME"}</Text>
        {data.experience?.[0]?.title && <Text style={styles.jobTitle}>{data.experience[0].title}</Text>}
        <View style={styles.contactRow}>
          {data.personalInfo?.email && <Text style={styles.contactItem}>{data.personalInfo.email}</Text>}
          {data.personalInfo?.phone && <Text style={styles.contactItem}>· {data.personalInfo.phone}</Text>}
          {data.personalInfo?.location && <Text style={styles.contactItem}>· {data.personalInfo.location}</Text>}
          {data.personalInfo?.linkedin && <Text style={styles.contactItem}>· {data.personalInfo.linkedin}</Text>}
        </View>
      </View>
      <View style={styles.body}>
        {data.summary && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionLine} />
              <Text style={styles.sectionTitle}>Professional Summary</Text>
            </View>
            <Text style={styles.summary}>{data.summary}</Text>
          </View>
        )}
        {data.skills && data.skills.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionLine} />
              <Text style={styles.sectionTitle}>Skills</Text>
            </View>
            <View style={styles.skillsRow}>
              {data.skills.map((s, i) => <Text key={i} style={styles.skillChip}>{s}</Text>)}
            </View>
          </View>
        )}
        {data.experience && data.experience.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionLine} />
              <Text style={styles.sectionTitle}>Experience</Text>
            </View>
            {data.experience.map((exp, i) => (
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
        )}
        {data.education && data.education.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionLine} />
              <Text style={styles.sectionTitle}>Education</Text>
            </View>
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
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionLine} />
              <Text style={styles.sectionTitle}>Certifications</Text>
            </View>
            {data.certifications.map((c, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{c}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Page>
  </Document>
);
