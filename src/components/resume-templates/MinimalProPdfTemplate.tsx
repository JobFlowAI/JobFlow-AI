import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "./AtsTemplate";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, backgroundColor: "#ffffff" },
  headerBand: { backgroundColor: "#eef2ff", borderBottomWidth: 2, borderBottomColor: "#a5b4fc", paddingHorizontal: 40, paddingVertical: 24 },
  name: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#312e81", marginBottom: 3 },
  jobTitle: { fontSize: 11, color: "#4f46e5", marginBottom: 8 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  contactItem: { fontSize: 8, color: "#4b5563" },
  body: { paddingHorizontal: 40, paddingVertical: 24 },
  section: { marginBottom: 18 },
  sectionTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", textTransform: "uppercase", color: "#6366f1", borderLeftWidth: 2, borderLeftColor: "#818cf8", paddingLeft: 6, marginBottom: 8 },
  summary: { fontSize: 9.5, color: "#4b5563", textAlign: "justify", lineHeight: 1.5 },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  skillChip: { fontSize: 8, color: "#4338ca", backgroundColor: "#eef2ff", borderWidth: 1, borderColor: "#c7d2fe", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 20 },
  itemBlock: { marginBottom: 12 },
  itemHeaderRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  itemTitle: { fontFamily: "Helvetica-Bold", fontSize: 10, color: "#111827" },
  itemDates: { fontSize: 8, color: "#6b7280" },
  itemCompany: { fontSize: 9, color: "#4f46e5", marginBottom: 4 },
  bulletRow: { flexDirection: "row", marginBottom: 3, marginLeft: 8 },
  bulletDot: { fontSize: 6, color: "#a5b4fc", marginTop: 3, marginRight: 4 },
  bulletText: { flex: 1, fontSize: 9, color: "#4b5563", textAlign: "justify" },
});

interface MinimalProPdfTemplateProps { data: ResumeData; }

export const MinimalProPdfTemplate = ({ data }: MinimalProPdfTemplateProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerBand}>
        <Text style={styles.name}>{data.personalInfo?.name || "YOUR NAME"}</Text>
        {data.experience?.[0]?.title && <Text style={styles.jobTitle}>{data.experience[0].title}</Text>}
        <View style={styles.contactRow}>
          {data.personalInfo?.email && <Text style={styles.contactItem}>{data.personalInfo.email}</Text>}
          {data.personalInfo?.phone && <Text style={styles.contactItem}>· {data.personalInfo.phone}</Text>}
          {data.personalInfo?.location && <Text style={styles.contactItem}>· {data.personalInfo.location}</Text>}
          {data.personalInfo?.linkedin && <Text style={styles.contactItem}>· {data.personalInfo.linkedin}</Text>}
          {data.personalInfo?.github && <Text style={styles.contactItem}>· {data.personalInfo.github}</Text>}
        </View>
      </View>
      <View style={styles.body}>
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.summary}>{data.summary}</Text>
          </View>
        )}
        {data.skills && data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsRow}>
              {data.skills.map((s, i) => <Text key={i} style={styles.skillChip}>{s}</Text>)}
            </View>
          </View>
        )}
        {data.experience && data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experience.map((exp, i) => (
              <View key={i} style={styles.itemBlock}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{exp.title}</Text>
                  <Text style={styles.itemDates}>{exp.dates}</Text>
                </View>
                <Text style={styles.itemCompany}>{exp.company}{exp.location ? ` — ${exp.location}` : ""}</Text>
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
          <View style={styles.section}>
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
    </Page>
  </Document>
);
