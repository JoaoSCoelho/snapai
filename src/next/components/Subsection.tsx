import { Control, UseFormRegister } from "react-hook-form";
import clsx from "clsx";
import Line from "./Line";
import { Section } from "@/simulator/configurations/layout/Section";
import { Subsection as SubsectionCls } from "@/simulator/configurations/layout/Subsection";

export type SubsectionProps = {
  section: Section;
  subsection: SubsectionCls;
  subsectionIndex: number;
  control: Control<any>;
  register: UseFormRegister<any>;
  onParameterizedSelectChange?: (
    name: string,
    fullName: string,
    value: string,
  ) => void;
};

export default function Subsection({
  control,
  register,
  section,
  subsection,
  subsectionIndex,
  ...props
}: SubsectionProps) {
  return (
    <fieldset
      className={clsx(
        `subsection_${subsection.title}`,
        "flex",
        "flex-col",
        "gap-3",
      )}
    >
      {subsection.title && <legend>{subsection.title}</legend>}

      {subsection.lines.map((line, lineIndex) => {
        return (
          <Line
            control={control}
            line={line}
            lineIndex={lineIndex}
            register={register}
            section={section}
            subsection={subsection}
            disabled={subsection.disabled || section.disabled}
            key={line.id}
            {...props}
          />
        );
      })}
    </fieldset>
  );
}
