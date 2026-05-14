import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "./AtsTemplate";

const NAVY = "#1a2f4e";
const GOLD = "#c9a84c";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, backgroundColor: "#ffffff" },
  header: { backgroundColor: NAVY, paddingHorizontal: 40, paddingVertical: 26 },
  name: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "#ffffff", marginBottom: 3 },
  jobTitle: { fontSize: 11, color: GOLD, marginBottom: 10 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  contactItem: { fontSize: 8, color: "#a8c0d6" },
  goldBar: { height: 3, backgroundColor: GOLD },
  body: { paddingHorizontal: 40, paddingVertical: 22 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 9, fontFamily: "Helvetica-Bold", textTransform: "uppercase", color: NAVY, borderBottomWidth: 2, borderBottomColor: GOLD, paddingBottom: 3, marginBottom: 8 },
  summary: { fontSize: 9.5, color: "#4b5563", textAlign: "justify", lineHeight: 1.5 },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
  skillChip: { fontSize: 8, color: "#374151", backgroundColor: "#fdf9ef", borderWidth: 1, borderColor: GOLD, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 2 },
  itemBlock: { marginBottom: 12 },
  itemHeaderRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  itemTitle: { fontFamily: "Helvetica-Bold", fontSize: 10, color: NAVY },
  itemDates: { fontSize: 8, color: "#6b7280" },
  itemCompany: { fontSize: 9, color: GOLD, marginBottom: 4 },
  bulletRow: { flexDirection: "row", marginBottom: 3, marginLeft: 8 },
  bulletDot: { fontSize: 6, color: "#9ca3af", marginTop: 3, marginRight: 4 },
  bulletText: { flex: 1, fontSize: 9, color: "#4b5563", textAlign: "justify" },
});

interface NavyCorporatePdfTemplateProps { data: ResumeData; }

export const NavyCorporatePdfTemplate = ({ data }: NavyCorporatePdfTemplateProps) => (
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
      <View style={styles.goldBar} />
      <View style={styles.body}>
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summary}>{data.summary}</Text>
          </View>
        )}
        {data.skills && data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Core Skills</Text>
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
