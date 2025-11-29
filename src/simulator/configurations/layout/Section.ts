import { Subsection } from "./Subsection";

export type SectionOptions = {
  title?: string;
  subsections: Subsection[];
};

export class Section {
  protected constructor(
    public readonly subsections: Subsection[],
    public readonly title?: string,
  ) {}

  public static create(data: SectionOptions): Section {
    return new Section(data.subsections, data.title);
  }
}
