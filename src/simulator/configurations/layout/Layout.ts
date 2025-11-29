import { Global } from "@/index";
import { Section } from "./Section";

export class Layout {
  public constructor(
    public readonly sections: Section[],
    public readonly id = ++Global.lastId,
  ) {}
}
