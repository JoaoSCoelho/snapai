import { OrderedSet } from "js-sdsl";
import { initContainer } from "js-sdsl/dist/esm/container/ContainerBase";
import { Packet } from "../models/Packet";
import { Simulation } from "../models/Simulation";

export class OrderedPacketSet extends OrderedSet<Packet> {
  constructor(container?: initContainer<Packet>, enableIndex?: boolean) {
    super(container, (a, b) => a.arrivingTime! - b.arrivingTime!, enableIndex);
  }
}
