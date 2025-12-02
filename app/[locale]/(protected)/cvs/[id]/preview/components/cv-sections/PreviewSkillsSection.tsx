import { useTranslation } from "react-i18next";
import { buildSkillRows, useCvPreview } from "../../lib/utils";

export default function PreviewSkillsSection() {
  const { t } = useTranslation();
  const { sortedSkills, skillsByCategory, latestSkillUsage, emptyValueLabel } = useCvPreview();
  const skillRows = buildSkillRows(skillsByCategory, sortedSkills, t);

  return (
    <section>
      <h2 className="mb-4 text-3xl font-medium">{t("cvs.preview.professionalSkills")}</h2>
      <table className="w-full text-left">
        <thead className="uppercase border-b border-red-600">
          <tr>
            <th className="px-4 py-4 font-normal">{t("skills.heading")}</th>
            <th className="px-4 py-4 font-normal">{t("cvs.preview.experienceColumn")}</th>
            <th className="px-4 py-4 text-right font-normal">{t("cvs.preview.lastUsedColumn")}</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {skillRows.map((row) => (
            <tr key={row.key} className="border-b border-white/80">
              <td className="px-4 py-5">
                <div className="flex items-center gap-10">
                  {row.showCategoryLabel && <span className="font-semibold text-red-600">{row.categoryLabel}</span>}
                  <span className="text-white">{row.skill.name}</span>
                </div>
              </td>
              <td className="px-4 py-5">{t(`skills.mastery.${row.skill.mastery.toLowerCase()}`)}</td>
              <td className="px-4 py-5 text-right">{latestSkillUsage ?? emptyValueLabel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
