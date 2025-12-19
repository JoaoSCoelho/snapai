import { ReactNode } from "react";

export type CopiableTextProps = {
  children: ReactNode | string;
  copiable?: string;
  showTitle?: boolean;
};

export function CopyableText({
  children,
  copiable,
  showTitle,
}: CopiableTextProps) {
  const handleClick = () => {
    navigator.clipboard.writeText(
      copiable ??
        (typeof children === "string"
          ? children
          : children instanceof Node
            ? (children.textContent ?? "")
            : (children?.toString() ?? "")),
    );
  };

  return (
    <span
      onClick={handleClick}
      className="cursor-pointer select-all hover:underline"
      title={showTitle ? "Click to copy" : undefined}
    >
      {children}
    </span>
  );
}
