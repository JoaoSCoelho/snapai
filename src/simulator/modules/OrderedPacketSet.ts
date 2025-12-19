import { OrderedSet } from "js-sdsl";
import { initContainer } from "js-sdsl/dist/esm/container/ContainerBase";
import { Packet } from "../models/Packet";

export class OrderedPacketSet extends OrderedSet<Packet> {
  constructor(container?: initContainer<Packet>, enableIndex?: boolean) {
    super(
      container,
      (a, b) => (a.arrivingTime! - b.arrivingTime! < 0 ? -1 : 1),
      enableIndex,
    );
  }
}
