import { Control, UseFormRegister } from "react-hook-form";
import { SuperSection } from "./ConfigForm";
import clsx from "clsx";
import Line from "./Line";
import { Section } from "@/simulator/configurations/layout/Section";
import { Subsection as SubsectionCls } from "@/simulator/configurations/layout/Subsection";

export type SubsectionProps = {
  superSection?: SuperSection;
  section: Section;
  subsection: SubsectionCls;
  subsectionIndex: number;
  control: Control<any>;
  register: UseFormRegister<any>;
  nestedIn?: string[];
};

export default function Subsection({
  superSection,
  control,
  register,
  section,
  subsection,
  subsectionIndex,
  nestedIn,
  ...props
}: SubsectionProps) {
  return (
    <fieldset
      className={clsx(
        `${superSection?.prefix ?? ""}_subsection_${subsection.title}`,
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
            superSection={superSection}
            nestedIn={(nestedIn ?? []).concat(subsection.nestedIn)}
            key={`subsection_${subsection.title ?? "" + subsectionIndex}_line${lineIndex}`}
            {...props}
          />
        );
      })}
    </fieldset>
  );
}
