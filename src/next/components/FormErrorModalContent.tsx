import dynamic from "next/dynamic";
import { flattenFormErrors } from "../utils/objectUtils";
import { FieldErrors } from "react-hook-form";

const ReactJson = dynamic(() => import("@microlink/react-json-view"), {
  ssr: false,
});

export type FormErrorModalContentProps = {
  formErrors: FieldErrors<Record<string, any>>;
};

export default function FormErrorModalContent({
  formErrors,
}: FormErrorModalContentProps) {
  return (
    <ReactJson
      src={flattenFormErrors(formErrors)}
      name={"errors"}
      collapsed={false}
      enableClipboard={true}
      displayDataTypes={false}
      quotesOnKeys={false}
      theme="rjv-default"
    />
  );
}
