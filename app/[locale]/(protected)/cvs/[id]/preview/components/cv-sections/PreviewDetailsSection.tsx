import { useTranslation } from "react-i18next";
import { DetailItem } from "../DetailItem";
import { useCvPreview } from "../../lib/utils";

export default function PreviewDetailsSection() {
  const { t } = useTranslation();
  const { name, summaryText, educationValue, languagesList, domainList, skillsByCategory } = useCvPreview();

  return (
    <section className="mt-10 grid gap-10 lg:grid-cols-[240px,1fr]">
      <div className="mt-4 space-y-4">
        <DetailItem label={t("cvs.createModal.labels.education")}>
          <span>{educationValue}</span>
        </DetailItem>

        {languagesList && (
          <DetailItem label={t("cvs.preview.languagesHeading")}>
            <ul>
              {languagesList.map((language) => (
                <li key={`${language.name}-${language.proficiency}`} className="flex items-center gap-x-2">
                  <span>{language.name}</span>
                  <span>-</span>
                  <span>{language.proficiency}</span>
                </li>
              ))}
            </ul>
          </DetailItem>
        )}

        {domainList && (
          <DetailItem label={t("cvs.preview.domainsHeading")}>
            <div className="flex flex-col mt-1">
              {domainList.map((domain) => (
                <span key={domain}>{domain}</span>
              ))}
            </div>
          </DetailItem>
        )}
      </div>

      <div className="border-l border-red-500">
        <div className="my-4 pl-6 space-y-4">
          <div>
            <h1 className="font-bold">{name}</h1>
            <p className="mt-2 text-white/90">{summaryText}</p>
          </div>
          {skillsByCategory.length > 0 && (
            <div className="space-y-4">
              {skillsByCategory.map((categoryGroup) => (
                <DetailItem key={categoryGroup.categoryName} label={categoryGroup.categoryName}>
                  {categoryGroup.skills.map((skill, index) => (
                    <span key={skill.name}>
                      {skill.name}
                      {index < categoryGroup.skills.length - 1 && ", "}
                    </span>
                  ))}
                </DetailItem>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
