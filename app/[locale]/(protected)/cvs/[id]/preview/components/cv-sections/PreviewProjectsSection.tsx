import { useTranslation } from "react-i18next";
import { DetailItem } from "../DetailItem";
import { useCvPreview } from "../../lib/utils";

export default function PreviewProjectsSection() {
  const { t } = useTranslation();
  const { projects, roleTitle, formatDateRangeLabel } = useCvPreview();

  return (
    <section>
      <h2 className="text-3xl font-medium">{t("cvs.preview.projectsHeading")}</h2>
      {projects.map((project) => (
        <article key={project.id} className="mt-5 grid gap-10 lg:grid-cols-[240px,1fr]">
          <div className="mt-4">
            <span className="text-red-600 font-semibold uppercase">{project.name}</span>
            <p className="mt-2">{project.description}</p>
          </div>

          <div className="border-l border-red-500">
            <div className="my-4 pl-6 space-y-4">
              <DetailItem label={t("cvs.preview.projectRole")}>
                <span>{roleTitle}</span>
              </DetailItem>
              <DetailItem label={t("cvs.preview.period")}>
                <span>{formatDateRangeLabel(project.start_date, project.end_date)}</span>
              </DetailItem>
              <DetailItem label={t("cvs.preview.responsibilities")}>
                <ul className="list-disc marker:text-red-500 ml-4">
                  <li>{project.responsibilities}</li>
                </ul>
              </DetailItem>
              <DetailItem label={t("cvs.preview.environment")}>
                <span>{project.environment.join(", ")}.</span>
              </DetailItem>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
