import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import type { TFunction } from "i18next";
import type { CvPreviewDerivedData } from "../types";
import { buildSkillRows } from "../lib/utils";

type CvPdfDocumentProps = {
  utilsData: CvPreviewDerivedData;
  t: TFunction;
};

type DetailItemProps = {
  label: string;
  children: ReactNode;
};

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1F1F1F",
    backgroundColor: "#FFFFFF",
    lineHeight: 1.3,
  },
  headerSection: {
    marginBottom: 8,
  },
  headerName: {
    fontSize: 24,
    fontWeight: 700,
    color: "#1F1F1F",
  },
  headerRole: {
    fontSize: 10,
    textTransform: "uppercase",
    color: "#1F1F1F",
    letterSpacing: 0.5,
    marginTop: 20,
  },
  contentSection: {
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    gap: 30,
  },
  sidebar: {
    width: 200,
    gap: 8,
    marginTop: 4,
  },
  mainContent: {
    flex: 1,
    borderLeftWidth: 2,
    borderLeftColor: "#EF4444",
    paddingLeft: 16,
    paddingTop: 4,
    paddingBottom: 4,
    gap: 8,
  },
  detailItem: {
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#1F1F1F",
    marginBottom: 1,
  },
  detailValueContainer: {
    marginTop: 1,
  },
  detailValueText: {
    fontSize: 10,
    color: "#3D3D3D",
    lineHeight: 1.3,
  },
  mainName: {
    fontSize: 13,
    fontWeight: 700,
    color: "#1F1F1F",
    marginBottom: 3,
  },
  summary: {
    fontSize: 10,
    color: "#3D3D3D",
    lineHeight: 1.3,
    marginBottom: 8,
  },
  languageItem: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 1,
  },
  skillsByCategory: {
    gap: 8,
  },
  projectsSection: {
    marginTop: 12,
    marginBottom: 10,
  },
  projectsTitle: {
    fontSize: 19,
    fontWeight: 500,
    color: "#1F1F1F",
    marginBottom: 8,
  },
  projectArticle: {
    marginBottom: 10,
  },
  projectGrid: {
    flexDirection: "row",
    gap: 30,
    marginTop: 8,
  },
  projectSidebar: {
    width: 200,
    marginTop: 4,
  },
  projectName: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    color: "#DC2626",
    marginBottom: 3,
  },
  projectDescription: {
    fontSize: 10,
    color: "#3D3D3D",
    lineHeight: 1.3,
  },
  projectMain: {
    flex: 1,
    borderLeftWidth: 2,
    borderLeftColor: "#EF4444",
    paddingLeft: 16,
    paddingTop: 4,
    paddingBottom: 4,
    gap: 8,
  },
  professionalSkillsSection: {
    marginTop: 12,
    marginBottom: 10,
  },
  professionalSkillsTitle: {
    fontSize: 19,
    fontWeight: 500,
    color: "#1F1F1F",
    marginBottom: 8,
  },
  skillTable: {
    width: "100%",
  },
  skillTableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#DC2626",
    paddingBottom: 6,
    marginBottom: 2,
  },
  skillTableHeaderCell: {
    fontSize: 10,
    textTransform: "uppercase",
    color: "#1F1F1F",
    fontWeight: 400,
    flex: 1,
  },
  skillTableHeaderCellExperience: {
    fontSize: 10,
    textTransform: "uppercase",
    color: "#1F1F1F",
    fontWeight: 400,
    flex: 1,
    textAlign: "center",
  },
  skillTableHeaderCellLast: {
    fontSize: 10,
    textTransform: "uppercase",
    color: "#1F1F1F",
    fontWeight: 400,
    flex: 1,
    textAlign: "right",
  },
  skillTableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 12,
  },
  skillTableCell: {
    flex: 1,
    fontSize: 10,
    color: "#1F1F1F",
  },
  skillTableCellExperience: {
    flex: 1,
    fontSize: 10,
    color: "#1F1F1F",
    textAlign: "center",
  },
  skillTableCellNameContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 30,
    alignItems: "center",
  },
  skillCategoryLabelInCell: {
    fontSize: 10,
    fontWeight: 600,
    color: "#DC2626",
  },
  skillTableCellLast: {
    flex: 1,
    fontSize: 10,
    color: "#1F1F1F",
    textAlign: "right",
  },
  placeholder: {
    fontSize: 10,
    color: "#A1A1A1",
    fontStyle: "italic",
  },
});

const DetailItem = ({ label, children }: DetailItemProps) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}</Text>
    <View style={styles.detailValueContainer}>{children}</View>
  </View>
);

export function CvPdfDocument({ utilsData, t }: CvPdfDocumentProps) {
  const {
    name,
    profileName,
    roleTitle,
    summaryText,
    educationValue,
    languagesList,
    domainList,
    projects,
    sortedSkills,
    skillsByCategory,
    latestSkillUsage,
    formatDateRangeLabel,
    emptyValueLabel,
  } = utilsData;

  const skillRows = buildSkillRows(skillsByCategory, sortedSkills, t);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerSection}>
          <Text style={styles.headerName}>{profileName}</Text>
          <Text style={styles.headerRole}>{roleTitle}</Text>
        </View>

        <View style={styles.contentSection}>
          <View style={styles.grid}>
            <View style={styles.sidebar}>
              <DetailItem label={t("cvs.createModal.labels.education")}>
                <Text style={styles.detailValueText}>{educationValue}</Text>
              </DetailItem>

              {languagesList && languagesList.length > 0 && (
                <DetailItem label={t("cvs.preview.languagesHeading")}>
                  <View>
                    {languagesList.map((language) => (
                      <View key={`${language.name}-${language.proficiency}`} style={styles.languageItem}>
                        <Text style={styles.detailValueText}>{language.name}</Text>
                        <Text style={styles.detailValueText}>-</Text>
                        <Text style={styles.detailValueText}>{language.proficiency}</Text>
                      </View>
                    ))}
                  </View>
                </DetailItem>
              )}

              {domainList && domainList.length > 0 && (
                <DetailItem label={t("cvs.preview.domainsHeading")}>
                  <View>
                    {domainList.map((domain) => (
                      <Text key={domain} style={styles.detailValueText}>
                        {domain}
                      </Text>
                    ))}
                  </View>
                </DetailItem>
              )}
            </View>

            <View style={styles.mainContent}>
              <Text style={styles.mainName}>{name}</Text>
              <Text style={styles.summary}>{summaryText}</Text>
              {skillsByCategory.length > 0 && (
                <View style={styles.skillsByCategory}>
                  {skillsByCategory.map((categoryGroup) => (
                    <DetailItem key={categoryGroup.categoryName} label={categoryGroup.categoryName}>
                      <Text style={styles.detailValueText}>
                        {categoryGroup.skills.map((skill, index) => (
                          <Text key={skill.name}>
                            {skill.name}
                            {index < categoryGroup.skills.length - 1 && ", "}
                          </Text>
                        ))}
                      </Text>
                    </DetailItem>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {projects.length > 0 && (
          <View style={styles.projectsSection}>
            <Text style={styles.projectsTitle}>{t("cvs.preview.projectsHeading")}</Text>
            {projects.map((project) => (
              <View key={project.id} style={styles.projectArticle}>
                <View style={styles.projectGrid}>
                  <View style={styles.projectSidebar}>
                    <Text style={styles.projectName}>{project.name}</Text>
                    <Text style={styles.projectDescription}>{project.description}</Text>
                  </View>

                  <View style={styles.projectMain}>
                    <DetailItem label={t("cvs.preview.projectRole")}>
                      <Text style={styles.detailValueText}>{roleTitle}</Text>
                    </DetailItem>
                    <DetailItem label={t("cvs.preview.period")}>
                      <Text style={styles.detailValueText}>{formatDateRangeLabel(project.start_date, project.end_date)}</Text>
                    </DetailItem>
                    {project.responsibilities && project.responsibilities.length > 0 && (
                      <DetailItem label={t("cvs.preview.responsibilities")}>
                        <View>
                          {project.responsibilities.map((responsibility, index) => (
                            <Text key={`${project.id}-resp-${index}`} style={styles.detailValueText}>
                              • {responsibility}
                            </Text>
                          ))}
                        </View>
                      </DetailItem>
                    )}
                    {project.environment && project.environment.length > 0 && (
                      <DetailItem label={t("cvs.preview.environment")}>
                        <Text style={styles.detailValueText}>{project.environment.join(", ")}.</Text>
                      </DetailItem>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.professionalSkillsSection}>
          <Text style={styles.professionalSkillsTitle}>{t("cvs.preview.professionalSkills")}</Text>
          {skillRows.length > 0 ? (
            <View style={styles.skillTable}>
              <View style={styles.skillTableHeader}>
                <Text style={styles.skillTableHeaderCell}>{t("skills.heading")}</Text>
                <Text style={styles.skillTableHeaderCellExperience}>{t("cvs.preview.experienceColumn")}</Text>
                <Text style={styles.skillTableHeaderCellLast}>{t("cvs.preview.lastUsedColumn")}</Text>
              </View>
              {skillRows.map((row) => (
                <View key={row.key} style={styles.skillTableRow}>
                  <View style={styles.skillTableCellNameContainer}>
                    {row.showCategoryLabel && <Text style={styles.skillCategoryLabelInCell}>{row.categoryLabel}</Text>}
                    <Text style={styles.skillTableCell}>{row.skill.name}</Text>
                  </View>
                  <Text style={styles.skillTableCellExperience}>{t(`skills.mastery.${row.skill.mastery.toLowerCase()}`)}</Text>
                  <Text style={styles.skillTableCellLast}>{latestSkillUsage ?? emptyValueLabel}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.placeholder}>{t("cvs.preview.emptySkills")}</Text>
          )}
        </View>
      </Page>
    </Document>
  );
}
