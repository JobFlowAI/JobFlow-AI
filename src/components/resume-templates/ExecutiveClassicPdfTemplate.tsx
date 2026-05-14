import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "./AtsTemplate";

const styles = StyleSheet.create({
  page: { fontFamily: "Times-Roman", fontSize: 10, backgroundColor: "#ffffff", paddingHorizontal: 45, paddingVertical: 40 },
  headerCenter: { alignItems: "center", marginBottom: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "#9ca3af" },
  name: { fontSize: 22, fontFamily: "Times-Bold", color: "#111827", marginBottom: 4 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 6 },
  contactItem: { fontSize: 8.5, color: "#4b5563" },
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 9, fontFamily: "Times-Bold", textTransform: "uppercase", color: "#1f2937", borderBottomWidth: 1, borderBottomColor: "#9ca3af", paddingBottom: 3, marginBottom: 7 },
  summary: { fontSize: 9.5, color: "#374151", textAlign: "justify", lineHeight: 1.6 },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  skillItem: { fontSize: 9, color: "#374151", flexDirection: "row", alignItems: "center", gap: 4 },
  skillDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: "#6b7280" },
  itemBlock: { marginBottom: 11 },
  itemHeaderRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  itemTitle: { fontFamily: "Times-Bold", fontSize: 10, color: "#111827" },
  itemDates: { fontSize: 9, color: "#6b7280", fontFamily: "Times-Roman" },
  itemCompany: { fontSize: 9, color: "#374151", fontFamily: "Times-Italic", marginBottom: 4 },
  bulletRow: { flexDirection: "row", marginBottom: 3, marginLeft: 10 },
  bulletDot: { fontSize: 7, color: "#4b5563", marginTop: 2, marginRight: 4 },
  bulletText: { flex: 1, fontSize: 9.5, color: "#374151", textAlign: "justify", fontFamily: "Times-Roman" },
});

interface ExecutiveClassicPdfTemplateProps { data: ResumeData; }

export const ExecutiveClassicPdfTemplate = ({ data }: ExecutiveClassicPdfTemplateProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerCenter}>
        <Text style={styles.name}>{data.personalInfo?.name || "YOUR NAME"}</Text>
        <View style={styles.contactRow}>
          {data.personalInfo?.email && <Text style={styles.contactItem}>{data.personalInfo.email}</Text>}
          {data.personalInfo?.phone && <Text style={styles.contactItem}>| {data.personalInfo.phone}</Text>}
          {data.personalInfo?.location && <Text style={styles.contactItem}>| {data.personalInfo.location}</Text>}
          {data.personalInfo?.linkedin && <Text style={styles.contactItem}>| {data.personalInfo.linkedin}</Text>}
        </View>
      </View>
      {data.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <Text style={styles.summary}>{data.summary}</Text>
        </View>
      )}
      {data.skills && data.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Core Competencies</Text>
          <View style={styles.skillsRow}>
            {data.skills.map((s, i) => (
              <View key={i} style={styles.skillItem}>
                <View style={styles.skillDot} />
                <Text>{s}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      {data.experience && data.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Experience</Text>
          {data.experience.map((exp, i) => (
            <View key={i} style={styles.itemBlock}>
              <View style={styles.itemHeaderRow}>
                <Text style={styles.itemTitle}>{exp.title}</Text>
                <Text style={styles.itemDates}>{exp.dates}</Text>
              </View>
              <Text style={styles.itemCompany}>{exp.company}{exp.location ? `, ${exp.location}` : ""}</Text>
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
    </Page>
  </Document>
);
