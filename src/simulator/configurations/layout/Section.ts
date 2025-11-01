import { Subsection } from "./Subsection";

export class Section {
  public constructor(
    public readonly title: string,
    public readonly subsections: Subsection[],
  ) {}
}
