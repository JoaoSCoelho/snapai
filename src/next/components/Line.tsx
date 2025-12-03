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
  register: UseFormRegister<any>;
  control: Control;
  disabled?: boolean;
  onModelNameChange?: (name: string, fullName: string, value: string) => void;
  onNodeNameChange?: (name: string, fullName: string, value: string) => void;
};

export default function Line({
  subsection,
  lineIndex,
  section,
  line,
  control,
  register,
  ...props
}: LineProps) {
  return (
    <div
      className={clsx(
        `line_${subsection.title}_index_${lineIndex}`,
        "grid",
        "grid-cols-12",
        "gap-3",
        "items-end",
      )}
    >
      {line.fields.map((field, fieldIndex) => {
        return (
          <FormField
            control={control}
            field={field}
            register={register}
            section={section}
            nestedIn={subsection.nestedIn}
            key={field.id + "_" + fieldIndex}
            {...props}
          ></FormField>
        );
      })}
    </div>
  );
}
