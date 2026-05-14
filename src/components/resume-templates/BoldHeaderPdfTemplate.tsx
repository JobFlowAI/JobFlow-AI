import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "./AtsTemplate";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, backgroundColor: "#ffffff" },
  header: { backgroundColor: "#111827", paddingHorizontal: 40, paddingVertical: 28 },
  name: { fontSize: 24, fontFamily: "Helvetica-Bold", color: "#ffffff", marginBottom: 3 },
  jobTitle: { fontSize: 11, color: "#9ca3af", marginBottom: 10 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  contactItem: { fontSize: 8, color: "#6b7280" },
  skillsGrid: { backgroundColor: "#f9fafb", borderBottomWidth: 1, borderBottomColor: "#e5e7eb", paddingHorizontal: 40, paddingVertical: 12, flexDirection: "row", flexWrap: "wrap", gap: 5 },
  skillChip: { fontSize: 8, color: "#374151", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#d1d5db", paddingHorizontal: 6, paddingVertical: 2.5, borderRadius: 2 },
  body: { paddingHorizontal: 40, paddingVertical: 22 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 9, fontFamily: "Helvetica-Bold", textTransform: "uppercase", color: "#111827", borderBottomWidth: 2, borderBottomColor: "#111827", paddingBottom: 3, marginBottom: 8 },
  summary: { fontSize: 9.5, color: "#4b5563", textAlign: "justify", lineHeight: 1.5 },
  itemBlock: { marginBottom: 12 },
  itemHeaderRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  itemTitle: { fontFamily: "Helvetica-Bold", fontSize: 10, color: "#111827" },
  itemDates: { fontSize: 8, color: "#6b7280" },
  itemCompany: { fontSize: 9, color: "#6b7280", fontFamily: "Helvetica-Oblique", marginBottom: 4 },
  bulletRow: { flexDirection: "row", marginBottom: 3, marginLeft: 8 },
  bulletDot: { fontSize: 6, color: "#9ca3af", marginTop: 3, marginRight: 4 },
  bulletText: { flex: 1, fontSize: 9, color: "#4b5563", textAlign: "justify" },
});

interface BoldHeaderPdfTemplateProps { data: ResumeData; }

export const BoldHeaderPdfTemplate = ({ data }: BoldHeaderPdfTemplateProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{data.personalInfo?.name || "YOUR NAME"}</Text>
        {data.experience?.[0]?.title && <Text style={styles.jobTitle}>{data.experience[0].title}</Text>}
        <View style={styles.contactRow}>
          {data.personalInfo?.email && <Text style={styles.contactItem}>{data.personalInfo.email}</Text>}
          {data.personalInfo?.phone && <Text style={styles.contactItem}>{data.personalInfo.phone}</Text>}
          {data.personalInfo?.location && <Text style={styles.contactItem}>{data.personalInfo.location}</Text>}
          {data.personalInfo?.linkedin && <Text style={styles.contactItem}>{data.personalInfo.linkedin}</Text>}
        </View>
      </View>
      {data.skills && data.skills.length > 0 && (
        <View style={styles.skillsGrid}>
          {data.skills.map((s, i) => <Text key={i} style={styles.skillChip}>{s}</Text>)}
        </View>
      )}
      <View style={styles.body}>
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <Text style={styles.summary}>{data.summary}</Text>
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
