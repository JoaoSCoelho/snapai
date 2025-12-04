import clsx from "clsx";
import Subsection from "./Subsection";
import { Control, UseFormRegister } from "react-hook-form";
import { Section as SectionCls } from "@/simulator/configurations/layout/Section";

export type SectionProps = {
  section: SectionCls;
  control: Control<any>;
  register: UseFormRegister<any>;
  onParameterizedSelectChange?: (
    name: string,
    fullName: string,
    value: string,
  ) => void;
};

export default function Section({
  section,
  control,
  register,
  ...props
}: SectionProps) {
  return (
    <div
      className={clsx(
        `section_${section.title}`,
        "rounded-md",
        "bg-white",
        "shadow-md",
        "px-2 py-4",
        "mb-2",
        "flex",
        "flex-col",
        "gap-6",
      )}
    >
      {section.title && (
        <h3 className={clsx("text-2xl", "mb-2")}>{section.title}</h3>
      )}

      {section.subsections.map((subsection, subsectionIndex) => {
        return (
          <Subsection
            control={control}
            register={register}
            section={section}
            subsection={subsection}
            subsectionIndex={subsectionIndex}
            key={subsection.id + "_" + subsectionIndex}
            {...props}
          />
        );
      })}
    </div>
  );
}
