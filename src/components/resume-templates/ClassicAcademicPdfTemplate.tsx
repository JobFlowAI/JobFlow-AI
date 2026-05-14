import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "./AtsTemplate";

const styles = StyleSheet.create({
  page: { fontFamily: "Times-Roman", fontSize: 10, backgroundColor: "#ffffff", paddingHorizontal: 50, paddingVertical: 38 },
  topRule: { borderBottomWidth: 2, borderBottomColor: "#1f2937", marginBottom: 14 },
  headerCenter: { alignItems: "center", marginBottom: 12 },
  name: { fontSize: 24, fontFamily: "Times-Bold", color: "#111827", marginBottom: 4 },
  jobTitleItalic: { fontSize: 11, fontFamily: "Times-Italic", color: "#4b5563", marginBottom: 5 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 5 },
  contactItem: { fontSize: 8.5, color: "#4b5563" },
  dividerThick: { borderBottomWidth: 2, borderBottomColor: "#1f2937", marginBottom: 12 },
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 9, fontFamily: "Times-Bold", textTransform: "uppercase", letterSpacing: 1.5, color: "#111827", marginBottom: 4 },
  sectionDivider: { borderBottomWidth: 1, borderBottomColor: "#9ca3af", marginBottom: 8 },
  summary: { fontSize: 9.5, color: "#374151", textAlign: "justify", lineHeight: 1.6, fontFamily: "Times-Roman" },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  skillItem: { fontSize: 9.5, color: "#374151", flexDirection: "row", alignItems: "center", gap: 4 },
  skillDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: "#6b7280" },
  itemBlock: { marginBottom: 11 },
  itemHeaderRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  itemTitle: { fontFamily: "Times-Bold", fontSize: 10.5, color: "#111827" },
  itemDates: { fontSize: 9, color: "#6b7280", fontFamily: "Times-Italic" },
  itemCompany: { fontSize: 9.5, fontFamily: "Times-Italic", color: "#374151", marginBottom: 4 },
  bulletRow: { flexDirection: "row", marginBottom: 3, marginLeft: 10 },
  bulletDot: { fontSize: 7, color: "#6b7280", marginTop: 2, marginRight: 5 },
  bulletText: { flex: 1, fontSize: 9.5, color: "#374151", textAlign: "justify", fontFamily: "Times-Roman", lineHeight: 1.5 },
  bottomRule: { borderBottomWidth: 1, borderBottomColor: "#9ca3af", marginTop: 16 },
});

interface ClassicAcademicPdfTemplateProps { data: ResumeData; }

export const ClassicAcademicPdfTemplate = ({ data }: ClassicAcademicPdfTemplateProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerCenter}>
        <Text style={styles.name}>{data.personalInfo?.name || "YOUR NAME"}</Text>
        {data.experience?.[0]?.title && <Text style={styles.jobTitleItalic}>{data.experience[0].title}</Text>}
        <View style={styles.contactRow}>
          {data.personalInfo?.email && <Text style={styles.contactItem}>{data.personalInfo.email}</Text>}
          {data.personalInfo?.phone && <Text style={styles.contactItem}>|  {data.personalInfo.phone}</Text>}
          {data.personalInfo?.location && <Text style={styles.contactItem}>|  {data.personalInfo.location}</Text>}
          {data.personalInfo?.linkedin && <Text style={styles.contactItem}>|  {data.personalInfo.linkedin}</Text>}
        </View>
      </View>
      <View style={styles.dividerThick} />
      {data.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Research &amp; Professional Summary</Text>
          <View style={styles.sectionDivider} />
          <Text style={styles.summary}>{data.summary}</Text>
        </View>
      )}
      {data.skills && data.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Areas of Expertise</Text>
          <View style={styles.sectionDivider} />
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
          <Text style={styles.sectionTitle}>Academic &amp; Professional Experience</Text>
          <View style={styles.sectionDivider} />
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
          <View style={styles.sectionDivider} />
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
          <Text style={styles.sectionTitle}>Honors &amp; Certifications</Text>
          <View style={styles.sectionDivider} />
          {data.certifications.map((c, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{c}</Text>
            </View>
          ))}
        </View>
      )}
      <View style={styles.bottomRule} />
    </Page>
  </Document>
);
