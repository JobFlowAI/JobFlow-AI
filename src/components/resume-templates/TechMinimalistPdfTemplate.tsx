import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "./AtsTemplate";

const BG = "#0f1117";
const TEXT = "#e2e8f0";
const DIM = "#94a3b8";
const ACCENT = "#38bdf8";
const GREEN = "#a3e635";

const styles = StyleSheet.create({
  page: { fontFamily: "Courier", fontSize: 10, backgroundColor: BG, paddingHorizontal: 40, paddingVertical: 36 },
  headerComment: { fontSize: 8, color: ACCENT, marginBottom: 4 },
  name: { fontSize: 22, fontFamily: "Courier-Bold", color: "#ffffff", marginBottom: 3 },
  titleLine: { fontSize: 9, color: DIM, marginBottom: 8 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  contactItem: { fontSize: 7.5, color: "#64748b" },
  divider: { borderBottomWidth: 1, borderBottomColor: "#1e2d3d", marginTop: 14, marginBottom: 16 },
  section: { marginBottom: 16 },
  sectionComment: { fontSize: 8, color: ACCENT, marginBottom: 6 },
  summary: { fontSize: 9, color: DIM, lineHeight: 1.5 },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
  skillChip: { fontSize: 7.5, color: "#60a5fa", backgroundColor: "#0c1a33", borderWidth: 1, borderColor: "#1e40af", paddingHorizontal: 5, paddingVertical: 2, borderRadius: 2 },
  itemBlock: { marginBottom: 11 },
  itemHeaderRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  itemTitle: { fontFamily: "Courier-Bold", fontSize: 9.5, color: "#ffffff" },
  itemDates: { fontSize: 7.5, color: "#64748b" },
  itemCompany: { fontSize: 8.5, color: GREEN, marginBottom: 4 },
  bulletRow: { flexDirection: "row", marginBottom: 3, marginLeft: 6 },
  bulletDash: { fontSize: 8, color: ACCENT, marginRight: 5 },
  bulletText: { flex: 1, fontSize: 9, color: DIM },
});

interface TechMinimalistPdfTemplateProps { data: ResumeData; }

export const TechMinimalistPdfTemplate = ({ data }: TechMinimalistPdfTemplateProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.headerComment}>{"// developer resume"}</Text>
      <Text style={styles.name}>{data.personalInfo?.name || "YOUR NAME"}</Text>
      {data.experience?.[0]?.title && <Text style={styles.titleLine}>{`> ${data.experience[0].title}`}</Text>}
      <View style={styles.contactRow}>
        {data.personalInfo?.email && <Text style={styles.contactItem}>{data.personalInfo.email}</Text>}
        {data.personalInfo?.phone && <Text style={styles.contactItem}>| {data.personalInfo.phone}</Text>}
        {data.personalInfo?.location && <Text style={styles.contactItem}>| {data.personalInfo.location}</Text>}
        {data.personalInfo?.linkedin && <Text style={styles.contactItem}>| {data.personalInfo.linkedin}</Text>}
      </View>
      <View style={styles.divider} />
      {data.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionComment}>{"/* summary */"}</Text>
          <Text style={styles.summary}>{data.summary}</Text>
        </View>
      )}
      {data.skills && data.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionComment}>{"/* tech_stack */"}</Text>
          <View style={styles.skillsRow}>
            {data.skills.map((s, i) => <Text key={i} style={styles.skillChip}>{s}</Text>)}
          </View>
        </View>
      )}
      {data.experience && data.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionComment}>{"/* experience */"}</Text>
          {data.experience.map((exp, i) => (
            <View key={i} style={styles.itemBlock}>
              <View style={styles.itemHeaderRow}>
                <Text style={styles.itemTitle}>{`fn ${exp.title?.replace(/\s+/g, "_").toLowerCase()}()`}</Text>
                <Text style={styles.itemDates}>{exp.dates}</Text>
              </View>
              <Text style={styles.itemCompany}>{`@${exp.company?.replace(/\s+/g, "") || "company"}`}{exp.location ? ` // ${exp.location}` : ""}</Text>
              {exp.bullets?.map((b, j) => (
                <View key={j} style={styles.bulletRow}>
                  <Text style={styles.bulletDash}>-</Text>
                  <Text style={styles.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}
      {data.education && data.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionComment}>{"/* education */"}</Text>
          {data.education.map((edu, i) => (
            <View key={i} style={styles.itemBlock}>
              <View style={styles.itemHeaderRow}>
                <Text style={styles.itemTitle}>{edu.degree}</Text>
                <Text style={styles.itemDates}>{edu.dates}</Text>
              </View>
              <Text style={styles.itemCompany}>{edu.school}{edu.location ? ` // ${edu.location}` : ""}</Text>
            </View>
          ))}
        </View>
      )}
      {data.certifications && data.certifications.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionComment}>{"/* certifications */"}</Text>
          {data.certifications.map((c, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bulletDash}>-</Text>
              <Text style={styles.bulletText}>{c}</Text>
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
);
