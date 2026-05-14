import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "./AtsTemplate";

const VIOLET = "#7c3aed";
const VIOLET_LIGHT = "#ede9fe";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, flexDirection: "row" },
  colorStrip: { width: 5, backgroundColor: VIOLET },
  sidebar: { width: 150, backgroundColor: "#f8f7ff", paddingHorizontal: 14, paddingVertical: 28 },
  nameBlock: { marginBottom: 20 },
  name: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#111827", marginBottom: 4 },
  jobTitle: { fontSize: 8, color: VIOLET, textTransform: "uppercase" },
  sidebarSectionTitle: { fontSize: 7, fontFamily: "Helvetica-Bold", textTransform: "uppercase", color: VIOLET, marginBottom: 6 },
  sidebarSection: { marginBottom: 16 },
  contactItem: { fontSize: 8, color: "#4b5563", marginBottom: 4 },
  skillChip: { fontSize: 7, color: VIOLET, backgroundColor: VIOLET_LIGHT, paddingHorizontal: 5, paddingVertical: 1.5, borderRadius: 20, marginBottom: 3, marginRight: 3 },
  skillsWrap: { flexDirection: "row", flexWrap: "wrap" },
  main: { flex: 1, paddingHorizontal: 24, paddingVertical: 28 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", textTransform: "uppercase", color: VIOLET, marginBottom: 6 },
  summary: { fontSize: 9.5, color: "#4b5563", textAlign: "justify", lineHeight: 1.5 },
  itemBlock: { marginBottom: 10, paddingLeft: 8, borderLeftWidth: 2, borderLeftColor: "#ddd6fe" },
  itemHeaderRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  itemTitle: { fontFamily: "Helvetica-Bold", fontSize: 9.5, color: "#111827" },
  itemDates: { fontSize: 7.5, color: "#9ca3af" },
  itemCompany: { fontSize: 8, color: VIOLET, marginBottom: 3 },
  bulletRow: { flexDirection: "row", marginBottom: 2.5 },
  bulletDot: { fontSize: 6, color: "#c4b5fd", marginTop: 2.5, marginRight: 4 },
  bulletText: { flex: 1, fontSize: 9, color: "#4b5563", textAlign: "justify" },
});

interface CreativePortfolioPdfTemplateProps { data: ResumeData; }

export const CreativePortfolioPdfTemplate = ({ data }: CreativePortfolioPdfTemplateProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.colorStrip} />
      <View style={styles.sidebar}>
        <View style={styles.nameBlock}>
          <Text style={styles.name}>{data.personalInfo?.name || "YOUR NAME"}</Text>
          {data.experience?.[0]?.title && <Text style={styles.jobTitle}>{data.experience[0].title}</Text>}
        </View>
        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarSectionTitle}>Contact</Text>
          {data.personalInfo?.email && <Text style={styles.contactItem}>{data.personalInfo.email}</Text>}
          {data.personalInfo?.phone && <Text style={styles.contactItem}>{data.personalInfo.phone}</Text>}
          {data.personalInfo?.location && <Text style={styles.contactItem}>{data.personalInfo.location}</Text>}
          {data.personalInfo?.linkedin && <Text style={styles.contactItem}>{data.personalInfo.linkedin}</Text>}
          {data.personalInfo?.github && <Text style={styles.contactItem}>{data.personalInfo.github}</Text>}
        </View>
        {data.skills && data.skills.length > 0 && (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Skills</Text>
            <View style={styles.skillsWrap}>
              {data.skills.map((s, i) => <Text key={i} style={styles.skillChip}>{s}</Text>)}
            </View>
          </View>
        )}
        {data.certifications && data.certifications.length > 0 && (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Certifications</Text>
            {data.certifications.map((c, i) => <Text key={i} style={styles.contactItem}>{c}</Text>)}
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
