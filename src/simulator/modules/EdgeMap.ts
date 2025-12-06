import { Edge } from "../models/Edge";

export class EdgeMap extends Map<string, Edge> {
  public copy(): EdgeMap {
    const copy = new EdgeMap();
    this.forEach((value, key) => copy.set(key, value));
    return copy;
  }
}
