import { Subsection } from "./Subsection";

export type SectionOptions = {
  title: string;
  nestedIn?: string[];
  subsections: Subsection[];
};

export class Section {
  protected constructor(
    public readonly title: string,
    public readonly nestedIn: string[] = [],
    public readonly subsections: Subsection[],
  ) {}

  public static create(data: SectionOptions): Section {
    return new Section(data.title, data.nestedIn, data.subsections);
  }
}
