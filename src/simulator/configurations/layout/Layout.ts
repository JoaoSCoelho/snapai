import { Global } from "@/simulator/Global";
import { Section } from "./Section";

export class Layout {
  public constructor(
    public readonly sections: Section[],
    public readonly id = ++Global.lastId,
  ) {}
}
