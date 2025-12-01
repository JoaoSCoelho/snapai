import { Global } from "@/simulator/Global";
import { Subsection } from "./Subsection";

export type SectionOptions = {
  title?: string;
  subsections: Subsection[];
  id?: number;
};

export class Section {
  protected constructor(
    public readonly subsections: Subsection[],
    public readonly title?: string,
    public readonly id = ++Global.lastId,
  ) {}

  public static create(data: SectionOptions): Section {
    return new Section(data.subsections, data.title, data.id);
  }
}
