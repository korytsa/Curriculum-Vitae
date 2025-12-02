import React from "react";
import { ExportPdfButton } from "../ExportPdfButton";
import { LanguageSelectControl } from "../LanguageSelectControl";
import { useCvPreview } from "../../lib/utils";

export default function PreviewHeaderSection() {
  const { profileName, roleTitle } = useCvPreview();

  return (
    <section className="flex flex-wrap items-start justify-between gap-6">
      <div>
        <h1 className="text-3xl text-white">{profileName}</h1>
        <p className="mt-1 uppercase">{roleTitle}</p>
      </div>
      <div className="flex w-full gap-4 sm:w-auto sm:items-end">
        <LanguageSelectControl />
        <ExportPdfButton />
      </div>
    </section>
  );
}
