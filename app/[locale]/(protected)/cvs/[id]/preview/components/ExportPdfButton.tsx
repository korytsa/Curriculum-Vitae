import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { pdf } from "@react-pdf/renderer";
import { Button, Loader } from "@/shared/ui";
import { useCv } from "@/features/cvs";
import { CvPdfDocument } from "./CvPdfDocument";
import { useCvPreview } from "../lib/utils";

const getPdfFileName = (value: string) => {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const safeValue = normalized || "cv-preview";
  return `${safeValue}.pdf`;
};

export function ExportPdfButton() {
  const { t } = useTranslation();
  const params = useParams();
  const id = params?.id as string | undefined;
  const { cv } = useCv(id || "");
  const utilsData = useCvPreview();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = () => {
    if (!cv || isExporting) {
      return;
    }
    setIsExporting(true);
    pdf(<CvPdfDocument utilsData={utilsData} t={t} />)
      .toBlob()
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = getPdfFileName(utilsData.profileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      })
      .finally(() => {
        setIsExporting(false);
      });
  };

  return (
    <Button
      type="button"
      iconPosition="right"
      onClick={handleExportPdf}
      disabled={!cv || isExporting}
      className="bg-transparent font-medium border border-red-500 text-red-500 hover:bg-[#413535]"
    >
      {t("cvs.preview.exportPdf")}
    </Button>
  );
}
