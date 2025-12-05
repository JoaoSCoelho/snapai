import { OrderedSet } from "js-sdsl";
import { Timer } from "../models/Timer";
import { initContainer } from "js-sdsl/dist/esm/container/ContainerBase";

export class OrderedTimerSet extends OrderedSet<Timer<true>> {
  constructor(container?: initContainer<Timer<true>>, enableIndex?: boolean) {
    super(container, (a, b) => a.getFireTime() - b.getFireTime(), enableIndex);
  }
}
