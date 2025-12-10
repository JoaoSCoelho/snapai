import { Global } from "@/simulator/Global";
import { Section, SectionOptions } from "./Section";
import { Subsection } from "./Subsection";

export type DependentSectionOptions = SectionOptions & {
  dependencies: string[];
  builders: Map<string, (value: any) => Subsection[]>;
  subsections?: Subsection[];
};

export class DependentSection extends Section {
  protected constructor(
    public readonly dependencies: string[],
    public readonly builders: Map<string, (value: any) => Subsection[]>,
    public subsections: Subsection[],
    public readonly title?: string,
    public readonly disabled: boolean = false,
    public readonly id = ++Global.lastId,
  ) {
    super(subsections, title, disabled, id);
  }

  public static create(data: DependentSectionOptions): Section {
    return new DependentSection(
      data.dependencies,
      data.builders,
      data.subsections ?? [],
      data.title,
      data.disabled,
      data.id,
    );
  }

  public onChange(dependency: string, value: any): void {
    this.subsections = this.builders.get(dependency)?.(value) ?? [];
  }
}
