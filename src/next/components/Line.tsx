import { ConfigFormSchema, SuperSection } from "./ConfigForm";
import clsx from "clsx";
import { Control, UseFormRegister } from "react-hook-form";
import { Subsection } from "@/simulator/configurations/layout/Subsection";
import { Line as LineCls } from "@/simulator/configurations/layout/Line";
import { Section } from "@/simulator/configurations/layout/Section";
import FormField from "./FormField";

export type LineProps = {
  subsection: Subsection;
  line: LineCls;
  lineIndex: number;
  section: Section;
  superSection?: SuperSection;
  register: UseFormRegister<ConfigFormSchema>;
  control: Control<ConfigFormSchema>;
  nestedIn?: string[];
};

export default function Line({
  subsection,
  lineIndex,
  superSection,
  section,
  line,
  control,
  register,
  nestedIn,
  ...props
}: LineProps) {
  return (
    <div
      className={clsx(
        `${superSection?.prefix ?? ""}_line_${subsection.title}_index_${lineIndex}`,
        "grid",
        "grid-cols-12",
        "gap-3",
        "items-end",
      )}
    >
      {line.fields.map((field, fieldIndex) => {
        return (
          <FormField
            nestedIn={nestedIn}
            control={control}
            field={field}
            register={register}
            key={field.name + fieldIndex}
            {...props}
          ></FormField>
        );
      })}
    </div>
  );
}
