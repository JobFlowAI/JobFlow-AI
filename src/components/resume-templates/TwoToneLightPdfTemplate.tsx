import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "./AtsTemplate";

const AMBER = "#b45309";
const WARM_GRAY = "#f5f0eb";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, flexDirection: "row", backgroundColor: "#ffffff" },
  sidebar: { width: 165, backgroundColor: WARM_GRAY, paddingHorizontal: 16, paddingVertical: 30 },
  nameBlock: { marginBottom: 20 },
  name: { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#1f2937", marginBottom: 4 },
  jobTitle: { fontSize: 7.5, color: AMBER, textTransform: "uppercase" },
  sideSection: { marginBottom: 16 },
  sideSectionTitle: { fontSize: 7, fontFamily: "Helvetica-Bold", textTransform: "uppercase", color: AMBER, borderBottomWidth: 1, borderBottomColor: "#fde68a", paddingBottom: 3, marginBottom: 6 },
  contactItem: { fontSize: 8, color: "#4b5563", marginBottom: 4 },
  skillRow: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  skillDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: "#f59e0b", marginRight: 6 },
  skillText: { fontSize: 8, color: "#374151" },
  certItem: { fontSize: 8, color: "#4b5563", marginBottom: 4 },
  main: { flex: 1, paddingHorizontal: 24, paddingVertical: 28 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", textTransform: "uppercase", color: AMBER, borderBottomWidth: 1, borderBottomColor: "#f3f4f6", paddingBottom: 3, marginBottom: 8 },
  summary: { fontSize: 9.5, color: "#4b5563", textAlign: "justify", lineHeight: 1.5 },
  itemBlock: { marginBottom: 11 },
  itemHeaderRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  itemTitle: { fontFamily: "Helvetica-Bold", fontSize: 10, color: "#111827" },
  itemDates: { fontSize: 7.5, color: "#9ca3af" },
  itemCompany: { fontSize: 8.5, color: AMBER, marginBottom: 4 },
  bulletRow: { flexDirection: "row", marginBottom: 3 },
  bulletDot: { fontSize: 6, color: "#fcd34d", marginTop: 3, marginRight: 4 },
  bulletText: { flex: 1, fontSize: 9, color: "#4b5563", textAlign: "justify" },
});

interface TwoToneLightPdfTemplateProps { data: ResumeData; }

export const TwoToneLightPdfTemplate = ({ data }: TwoToneLightPdfTemplateProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.sidebar}>
        <View style={styles.nameBlock}>
          <Text style={styles.name}>{data.personalInfo?.name || "YOUR NAME"}</Text>
          {data.experience?.[0]?.title && <Text style={styles.jobTitle}>{data.experience[0].title}</Text>}
        </View>
        <View style={styles.sideSection}>
          <Text style={styles.sideSectionTitle}>Contact</Text>
          {data.personalInfo?.email && <Text style={styles.contactItem}>{data.personalInfo.email}</Text>}
          {data.personalInfo?.phone && <Text style={styles.contactItem}>{data.personalInfo.phone}</Text>}
          {data.personalInfo?.location && <Text style={styles.contactItem}>{data.personalInfo.location}</Text>}
          {data.personalInfo?.linkedin && <Text style={styles.contactItem}>{data.personalInfo.linkedin}</Text>}
          {data.personalInfo?.github && <Text style={styles.contactItem}>{data.personalInfo.github}</Text>}
        </View>
        {data.skills && data.skills.length > 0 && (
          <View style={styles.sideSection}>
            <Text style={styles.sideSectionTitle}>Skills</Text>
            {data.skills.map((s, i) => (
              <View key={i} style={styles.skillRow}>
                <View style={styles.skillDot} />
                <Text style={styles.skillText}>{s}</Text>
              </View>
            ))}
          </View>
        )}
        {data.certifications && data.certifications.length > 0 && (
          <View style={styles.sideSection}>
            <Text style={styles.sideSectionTitle}>Certifications</Text>
            {data.certifications.map((c, i) => <Text key={i} style={styles.certItem}>{c}</Text>)}
          </View>
        )}
      </View>
      <View style={styles.main}>
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
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
      </View>
    </Page>
  </Document>
);
