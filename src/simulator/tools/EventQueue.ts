import { MinPriorityQueue } from "@datastructures-js/priority-queue";
import { Event } from "../models/Event";
import { EventQueueListener } from "./EventQueueListener";
import { Node } from "../models/Node";
import { PacketEvent } from "../models/PacketEvents";
import { Simulation } from "../models/Simulation";
import { Edge } from "../models/Edge";
import { AsynchronousSimulation } from "../models/AsynchronousSimulation";

export class EventQueue extends MinPriorityQueue<Event> {
  private readonly listeners: Set<EventQueueListener> = new Set();

  public constructor(private readonly simulation: AsynchronousSimulation) {
    super({
      compare: (a, b) => {
        if (a.time < b.time) return -1;
        else if (a.time > b.time) return 1;
        else if (a.id < b.id) return -1;
        else if (a.id > b.id) return 1;
        else return 0;
      },
    });
  }

  /**
   * Enqueues the given event to the end of the queue.
   * After enqueuing the event, it notifies all the listeners.
   * @param event - The event to enqueue.
   * @returns This EventQueue.
   */
  public enqueue(event: Event): this {
    super.enqueue(event);
    this.notifyListeners();
    return this;
  }

  /**
   * Removes and returns the next event in the queue.
   * If the queue is empty, it throws an error.
   * @returns The next event in the queue.
   * @throws {Error} If the queue is empty.
   */
  public certainlyDequeue(): Event {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    return this.dequeue()!;
  }

  /**
   * Removes and returns the next event in the queue.
   * If the queue is empty, it returns null.
   * Notifies all listeners after dequeuing the event.
   * @returns The next event in the queue, or null if the queue is empty.
   */
  public dequeue(): Event | null {
    const event = super.dequeue();
    this.notifyListeners();
    return event;
  }

  /**
   * Removes the given event from the event queue.
   * @param event - The event to be removed from the queue.
   */
  private removeEvent(event: Event): Event | null {
    return this.remove((ev) => ev.id === event.id)[0] ?? null;
  }

  /**
   * Returns the next event in the queue without removing it.
   * If the queue is empty, it returns null.
   * @returns The next event in the queue, or null if the queue is empty.
   */
  peek(): Event | null {
    return this.front();
  }

  /**
   * Removes all the Events for this node. This method is used when a node is removed
   * from the system, all events in the system that are in the queue have to be removed
   * too.
   *
   * Messages sent by this node are invalidated.
   *
   * @param n The node for which all events are deleted
   */
  public removeAllEventsForThisNode(node: Node) {
    let changed = false;

    for (const event of this) {
      if (
        event.isNodeEvent() &&
        event.getEventNode() &&
        node.isEqual(event.getEventNode()!)
      ) {
        this.removeEvent(event);
        changed = true;
      } else {
        if (event instanceof PacketEvent) {
          const packetOrigin = this.simulation.getCertainNode(
            event.packet.originId,
          );
          if (packetOrigin.isEqual(node)) {
            event.packet.denyDelivery();
          }
        }
      }
    }

    if (changed) {
      this.notifyListeners();
    }
  }

  /**
   * Invalidates all PacketEvents for that Edge. This method
   * does not remove the packet events, but only invalidates
   * them. This way, the packets are removed from the 'packetsInTheAir'
   * buffer at the right time.
   *
   * @param edge The edge to remove all the events for.
   */
  public invalidatePacketEventsForThisEdge(edge: Edge) {
    let changed = false;

    for (const event of this) {
      if (event instanceof PacketEvent) {
        if (event.packet.edge && event.packet.edge === edge) {
          event.packet.denyDelivery();
          event.packet.setEdge(null);
          changed = true;
        }
      }
    }

    if (changed) {
      this.notifyListeners();
    }
  }

  /**
   * Removes all events related with a node (packet events and node-timer events).
   */
  public pruneAllNodeEvents() {
    for (const event of this) {
      if (event.isNodeEvent()) {
        this.removeEvent(event);
      }
    }

    this.notifyListeners();
  }

  /**
   * Removes all events without executing them
   */
  public dropAllEvents() {
    for (const event of this) {
      event.drop();
    }
    super.clear(); // remove all events

    this.notifyListeners();
  }

  /**
   * Removes a single event from this queue without executing it
   * @param e The event to remove
   */
  public dropEvent(event: Event) {
    if (this.removeEvent(event)) {
      event.drop();
    }

    this.notifyListeners();
  }

  /**
   * Triggers an notification to all the registered listeners. Normally this is used internally only, but
   * there are some special cases, where the eventQueue and the queue does not notify it (interference)
   */
  public notifyListeners() {
    for (const listener of this.listeners) {
      listener.onChange();
    }
  }

  /**
   * Adds the specified eventQueueListener to the listeners
   *
   * @param listener The EventQueueListener to add
   */
  public addEventQueueListener(listener: EventQueueListener) {
    this.listeners.add(listener);
  }

  /**
   * Removes the specified eventQueueListener to the listeners
   *
   * @param listener The EventQueueListener to remove
   */
  public removeEventQueueListener(listener: EventQueueListener) {
    this.listeners.delete(listener);
  }
}
