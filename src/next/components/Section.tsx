import { SuperSection } from "./ConfigForm";
import clsx from "clsx";
import Subsection from "./Subsection";
import { Control, UseFormRegister } from "react-hook-form";
import { Section as SectionCls } from "@/simulator/configurations/layout/Section";

export type SectionProps = {
  section: SectionCls;
  superSection?: SuperSection;
  control: Control<any>;
  isLoadingConfig?: boolean;
  register: UseFormRegister<any>;
  nestedIn?: string[];
};

export default function Section({
  superSection,
  section,
  control,
  isLoadingConfig = false,
  register,
  nestedIn,
  ...props
}: SectionProps) {
  return (
    <div
      className={clsx(
        `${superSection?.prefix ?? ""}_section_${section.title}`,
        "rounded-md",
        "bg-white",
        "shadow-md",
        "p-2",
        "mb-2",
        "flex",
        "flex-col",
        "gap-6",
      )}
    >
      {section.title ?? (
        <h3 className={clsx("text-2xl", "mb-2")}>{section.title}</h3>
      )}

      {section.subsections.map((subsection, subsectionIndex) => {
        return (
          <Subsection
            control={control}
            isLoadingConfig={isLoadingConfig}
            register={register}
            section={section}
            subsection={subsection}
            subsectionIndex={subsectionIndex}
            superSection={superSection}
            nestedIn={nestedIn}
            key={subsection.title ?? "" + subsectionIndex}
            {...props}
          />
        );
      })}
    </div>
  );
}
