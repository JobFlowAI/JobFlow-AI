import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "./AtsTemplate";

const ROSE = "#f43f5e";
const ROSE_LIGHT = "#fff1f2";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, backgroundColor: "#ffffff" },
  topStripe: { height: 5, backgroundColor: ROSE },
  header: { paddingHorizontal: 40, paddingTop: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  name: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "#111827", marginBottom: 3 },
  jobTitle: { fontSize: 11, color: ROSE, marginBottom: 8 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  contactItem: { fontSize: 8, color: "#6b7280" },
  body: { paddingHorizontal: 40, paddingVertical: 22 },
  section: { marginBottom: 18 },
  sectionTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", textTransform: "uppercase", color: "#fb7185", marginBottom: 8 },
  summary: { fontSize: 9.5, color: "#4b5563", textAlign: "justify", lineHeight: 1.5 },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
  skillChip: { fontSize: 8, color: "#be123c", backgroundColor: ROSE_LIGHT, borderWidth: 1, borderColor: "#fecdd3", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 20 },
  timelineItem: { flexDirection: "row", marginBottom: 12 },
  timelineLeft: { width: 14, alignItems: "center" },
  timelineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: ROSE, marginTop: 3 },
  timelineLine: { width: 1, backgroundColor: "#fecdd3", flex: 1, marginTop: 2 },
  timelineContent: { flex: 1, paddingLeft: 8 },
  itemHeaderRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  itemTitle: { fontFamily: "Helvetica-Bold", fontSize: 10, color: "#111827" },
  itemDates: { fontSize: 8, color: "#9ca3af" },
  itemCompany: { fontSize: 9, color: ROSE, marginBottom: 4 },
  bulletRow: { flexDirection: "row", marginBottom: 3 },
  bulletDot: { fontSize: 6, color: "#fda4af", marginTop: 3, marginRight: 4 },
  bulletText: { flex: 1, fontSize: 9, color: "#4b5563", textAlign: "justify" },
  eduItem: { flexDirection: "row", gap: 8, marginBottom: 8 },
  eduDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: ROSE, marginTop: 4 },
  eduContent: { flex: 1 },
  eduDegree: { fontFamily: "Helvetica-Bold", fontSize: 10, color: "#111827" },
  eduSchool: { fontSize: 9, color: "#6b7280" },
  eduDates: { fontSize: 8, color: "#9ca3af" },
});

interface ElegantTimelinePdfTemplateProps { data: ResumeData; }

export const ElegantTimelinePdfTemplate = ({ data }: ElegantTimelinePdfTemplateProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.topStripe} />
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
            <Text style={styles.sectionTitle}>About</Text>
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
              <View key={i} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={styles.timelineDot} />
                  {i < (data.experience?.length ?? 0) - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineContent}>
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
              </View>
            ))}
          </View>
        )}
        {data.education && data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu, i) => (
              <View key={i} style={styles.eduItem}>
                <View style={styles.eduDot} />
                <View style={styles.eduContent}>
                  <View style={styles.itemHeaderRow}>
                    <Text style={styles.eduDegree}>{edu.degree}</Text>
                    <Text style={styles.eduDates}>{edu.dates}</Text>
                  </View>
                  <Text style={styles.eduSchool}>{edu.school}{edu.location ? `, ${edu.location}` : ""}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        {data.certifications && data.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {data.certifications.map((c, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>·</Text>
                <Text style={styles.bulletText}>{c}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Page>
  </Document>
);
