import { Global } from "@/simulator/Global";
import { Section } from "./Section";

/**
 * **This class need to be copiable**
 */
export class Layout {
  public constructor(
    public readonly sections: Section[],
    public readonly id = ++Global.lastId,
  ) {}

  /**
   * Returns a new Layout instance with the same properties as this one.
   * The new instance is a shallow copy of this one, meaning that all the
   * sections and their nested subsections and fields are the same.
   * @returns A new Layout instance with the same properties as this one.
   */
  public copy(): Layout {
    return new Layout(this.sections, this.id);
  }
}
