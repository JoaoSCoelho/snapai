import { Inbox } from "../tools/Inbox";
import { InboxPacketBuffer } from "../tools/InboxPacketBuffer";
import { NackBox } from "../tools/NackBox";
import { Position } from "../tools/Position";
import { AsynchronousSimulation } from "./AsynchronousSimulation";
import { BaseNode } from "./BaseNode";
import { ConnectivityModel } from "./ConnectivityModel";
import { Edge } from "./Edge";
import { InterferenceModel } from "./InterferenceModel";
import { Message } from "./Message";
import { MobilityModel } from "./MobilityModel";
import { ConcretePacket, Packet, TransmissionType } from "./Packet";
import { PacketEvent } from "./PacketEvents";
import { ReliabilityModel } from "./ReliabilityModel";
import { Simulation } from "./Simulation";
import { Timer } from "./Timer";
import { SynchronousSimulation } from "./SynchronousSimulation";

export type NodeId = number;

export type ConcreteNode = new (
  id: NodeId,
  mobilityModel: MobilityModel,
  connectivityModel: ConnectivityModel,
  interferenceModel: InterferenceModel,
  reliabilityModel: ReliabilityModel,
  UsedPacket: ConcretePacket,
  position: Position,
  parameters: Record<string, any>,
  simulation: Simulation,
) => Node;

export abstract class Node extends BaseNode {
  public hasNeighborhoodChanges = false;
  private packetBuffer = new InboxPacketBuffer(this.simulation);
  private nackBufferOdd: Packet[] = [];
  private nackBufferEven: Packet[] = [];
  private nackBox: NackBox = new NackBox([]);
  private inbox: Inbox = new Inbox([]);
  private _radioIntensity: number = 1.0;

  public constructor(
    public readonly id: NodeId,
    public mobilityModel: MobilityModel,
    public connectivityModel: ConnectivityModel,
    public interferenceModel: InterferenceModel,
    public reliabilityModel: ReliabilityModel,
    public UsedPacket: ConcretePacket,
    public position: Position,
    public readonly parameters: Record<string, any>,
    public readonly simulation: Simulation,
  ) {
    super(
      id,
      mobilityModel,
      connectivityModel,
      interferenceModel,
      reliabilityModel,
      position,
      simulation,
    );
  }

  /**
   * Returns the current radio intensity of the node.
   * The radio intensity is a value between 0 and 1 that indicates how much a node is affected by radio signals.
   * A radio intensity of 1 means that the node is fully affected by radio signals, while a radio intensity of 0 means that the node is not affected at all.
   */
  public get radioIntensity(): number {
    return this._radioIntensity;
  }

  /**
   * Sets the current radio intensity of the node.
   * The radio intensity is a value between 0 and 1 that indicates how much a node is affected by radio signals.
   * A radio intensity of 1 means that the node is fully affected by radio signals, while a radio intensity of 0 means that the node is not affected at all.
   * @throws {Error} If the given radio intensity is less than 0 or greater than 1.
   * @param {number} radioIntensity The new radio intensity of the node.
   */
  public set radioIntensity(radioIntensity: number) {
    if (radioIntensity < 0)
      throw new Error("Radio intensity must be greater than or equal to 0");
    if (radioIntensity > 1)
      throw new Error("Radio intensity must be less than or equal to 1");

    this._radioIntensity = radioIntensity;
  }

  /**
   * Adds a packet to the NACK box of this node.
   * A packet is added to the NACK box only if it is a unicast packet.
   * In the synchronous setting, this method is called after all the messages are received.
   * In the asynchronous setting, this method is NOT called.
   * @param {Packet} packet The packet to add to the NACK box.
   */
  public addNackPacket(packet: Packet): void {
    if (packet.transmissionType !== TransmissionType.UNICAST) return;

    const simulation = this.simulation as SynchronousSimulation;

    if (simulation.isEvenRound) {
      this.nackBufferOdd.push(packet);
    } else {
      this.nackBufferEven.push(packet);
    }
  }

  /**
   * This method is invoked after all the Messages are received.\
   * **Overwrite it to specify what to do with incoming messages**.
   * @param inbox a instance of a class Inbox. It is used to traverse the incoming
   * packets and to get information about them.
   * @see Node#step() for the order of calling the methods.
   */
  public abstract handleMessages(inbox: Inbox): void;

  /**
   * Handle all messages sent by this node that were scheduled to arrive
   * in the previous round, but were dropped.
   * Overwrite this method in your subclass if you wish to perform
   * an action upon dropped messages.
   *
   * The framework calls (and stores the dropped messages) only if
   * `nackMessagesEnabled` is enabled in the project configuration.
   * @param nackBox The NackBox, an object that contains the set of dropped messages.
   */
  public handleNackMessages(nackBox: NackBox): void {
    // no code here! The user may overwrite this method in the subclass
  }

  /**
   * This method is invoked at the beginning of each step.
   * Add actions to this method that this node should perform in every step.
   * @see Node#step() for the calling sequence of the node methods.
   */
  public abstract preStep(): void;

  /**
   * This method is called exactly once upon creation of this node
   * and allows the subclasses to perform some node-specific initialization.
   *
   * When a set of nodes is generated, this method may be called before all nodes
   * are added to the framework. Therefore, this method should not depend on other
   * nodes of the framework.
   */
  public abstract init(): void;

  /**
   * This method is invoked when the neighborhood of this node has changed.
   * @see Node#step() for the calling sequence of the node methods.
   */
  public abstract onNeighborhoodChange(): void;

  /**
   * The node calls this method at the end of its step.
   */
  public abstract postStep(): void;

  /**
   * This method checks if the configuration meets the specification of the node. This
   * function is called exactly once just after the initialization of a node but before
   * the first usage.
   * @returns {boolean} True if the configuration is valid, false otherwise
   */
  public abstract checkRequirements(): boolean; // TODO: Call it when adding a node

  /**
   * This method sends a Message to a specified target with the given intensity.
   * @param message The Message to send.
   * @param target The ID of the target node or the node itself.
   * @param radioIntensity The intensity to send the message with.
   * @throws {Error} Thrown when not found the target node.
   */
  public send(
    message: Message,
    target: Node | NodeId,
    radioIntensity: number = this.radioIntensity,
  ) {
    if (!(target instanceof Node))
      target = this.simulation.getCertainNode(target);

    const edge = this.simulation.getEdge(this.id, target.id) ?? null;

    const packet = this.sendMessage(
      message,
      edge,
      this,
      target,
      radioIntensity,
      TransmissionType.UNICAST,
    );

    if (this.simulation.project.simulationConfig.getInterferenceEnabled()) {
      this.simulation.packetsInTheAir.add(packet, false);
    }
  }

  /**
   * Directly sends a message to another node of the framework.
   * * This send message does not require a link between the sender and the receiver.
   * * Does not create interference, and cannot be dropped due to interference.
   * * Is not dropped by the reliability model.
   * * However, the delivery time depends on the messageTransmissionModel.
   * This send method may be interesting to implement P2P situations.
   * @param message The message to send
   * @param target The destination node of the message
   */
  public sendDirect(message: Message, target: Node) {
    const clonedMessage = message.clone();

    const packet = new this.UsedPacket(
      clonedMessage,
      this.id,
      target.id,
      TransmissionType.UNICAST,
    );

    const transmissionTime =
      this.simulation.messageTransmissionModel.timeToReach(packet);

    packet.arrivingTime = this.simulation.currentTime + transmissionTime;
    packet.sendingTime = this.simulation.currentTime;
    packet.setEdge(null);
    packet.intensity = this.radioIntensity;

    this.simulation.statistics.registerSentMessage(packet);

    if (this.simulation.isAsyncMode) {
      const simulation = this.simulation as AsynchronousSimulation;
      (simulation as AsynchronousSimulation).eventQueue.enqueue(
        new PacketEvent(packet, packet.arrivingTime, simulation),
      );
    } else {
      if (!this.simulation.isRunning) {
        throw new Error("Simulation is not running");
      }
      target.packetBuffer.addPacket(packet);
    }
  }

  /**
   * Starts the send-process to deliver a message to a target node.
   *
   * This method sends a clone of the message, such that the sender does not need to
   * worry what the receiving node does with the message. This copy is obtained using the
   * `clone` method of the message, which the user must implement.
   * @param message The message to be sent.
   * @param edge The edge over which the message is sent, may be null, if there is no edge,
   * in which case the packet is dropped immediately
   * @param sender The sender node who sends the message
   * @param target The destination node who should receive the message
   * @param radioIntensity The radio-intensity of the sender node
   * @param transmissionType The type of the transmission (unicast, broadcast, multicast)
   * @return The packet that has been transmitted.
   */
  private sendMessage(
    message: Message,
    edge: Edge | null,
    sender: Node,
    target: Node,
    radioIntensity: number,
    transmissionType: TransmissionType,
  ): Packet {
    if (this.simulation.isAsyncMode) {
      return this.asynchronousSending(
        message,
        edge,
        sender,
        target,
        radioIntensity,
        transmissionType,
      );
    } else {
      return this.synchronousSending(
        message,
        edge,
        sender,
        target,
        radioIntensity,
        transmissionType,
      );
    }
  }

  /**
   * This method broadcasts a Message.
   * Note that this message is more efficient
   * concerning the memory usage than the sendPacket
   * message, but note also that with this method
   * the user sends a message and receives a packet
   * (as there are always packets received).
   * If that disturbes you use  the broadcastPacket
   * method instead.
   *
   * @param message The message to be sent to all the neighbors.
   * @param radioIntensity The intensity at which the message is sent
   */
  public broadcast(
    message: Message,
    radioIntensity: number = this.radioIntensity,
  ): void {
    this.broadcastMessage(message, radioIntensity);
  }

  /**
   * **This method is framework internal and should not be used by the project developer.**
   * This method is called in each round on each node **(Only in the synchronous simulation mode)**
   * by the system. It specifies the order in which the behavior methods are called. Study this
   * method carefully to understand the simulation.
   * @throws WrongConfigurationException
   */
  public step(): void {
    const simulation = this.simulation as SynchronousSimulation;

    this.packetBuffer.updateMessageBuffer();

    this.preStep();

    // check, if some connections have changed in the last step
    if (this.hasNeighborhoodChanges) {
      this.onNeighborhoodChange();
    }

    const timersToHandle: Timer<true>[] = [];

    // Fire all timers which are going off in this round
    if (this.timers.size() > 0) {
      for (const timer of this.timers) {
        if (timer.getFireTime() > simulation.currentTime) break; // We can stop because the timers are sorted by fire time

        this.timers.eraseElementByKey(timer);

        // we may not call fire() while iterating over the list of timers of this node,
        // as the timer could reschedule itself and require to be added again to the
        // timers list of this node. Therefore, store all timers that fire in a separate
        // list and call them afterwards.
        timersToHandle.push(timer);
      }

      timersToHandle.forEach((timer) => timer.fire());
    }

    // Handle dropped messages (messages that were sent by this node, but that do not arrive.
    if (simulation.project.simulationConfig.getNackMessagesEnabled()) {
      const nackBuffer = simulation.isEvenRound
        ? this.nackBufferEven
        : this.nackBufferOdd;

      this.nackBox.resetForPackets(nackBuffer);

      this.handleNackMessages(this.nackBox);
    }

    //call the 'handleMessages' ALWAYS, and pass the appropriate Inbox.
    this.inbox = this.packetBuffer.getInbox();
    this.handleMessages(this.inbox);

    // a custom method that may do something at the end of the step
    this.postStep();

    //all the packets in the inbox and nackBox are not used anymore and can be freed.
    this.inbox = new Inbox([]);
    this.nackBox = new NackBox([]); // this resets the nackBuffer
  }

  /**
   * Sends a message in the asynchronous simulation mode
   * @param message The message to be sent
   * @param edge The edge over which the message is sent, may be null, if there is no edge,
   * in which case the packet is dropped immediately
   * @param sender The sender node who sends the message
   * @param target The destination node who should receive the message
   * @param radioIntensity The intensity at which the message is sent
   * @param transmissionType The type of the transmission
   * @return The packet encapsulating the message
   */
  private asynchronousSending(
    message: Message,
    edge: Edge | null,
    sender: Node,
    target: Node,
    radioIntensity: number,
    transmissionType: TransmissionType,
  ): Packet {
    if (!this.simulation.isAsyncMode)
      throw new Error("Simulation is not async");

    const clonedMsg = message.clone();
    const simulation = this.simulation as AsynchronousSimulation;
    const packet = new this.UsedPacket(
      clonedMsg,
      sender.id,
      target.id,
      transmissionType,
    );

    const transmissionTime =
      simulation.messageTransmissionModel.timeToReach(packet);

    packet.arrivingTime = simulation.currentTime + transmissionTime;
    packet.sendingTime = simulation.currentTime;
    packet.setEdge(edge);
    packet.intensity = radioIntensity;

    if (!edge) {
      packet.denyDelivery();
    } else {
      if (!this.reliabilityModel.reachesDestination(packet)) {
        packet.denyDelivery();
      }
      edge.addPacket(packet);
    }

    simulation.statistics.registerSentMessage(packet);

    simulation.eventQueue.enqueue(
      new PacketEvent(
        packet,
        this.simulation.currentTime + transmissionTime,
        simulation,
      ),
    );

    return packet;
  }

  /**
   * Sends a message in the synchronous simulation mode
   * @param message The message to be sent
   * @param edge The edge over which the message is sent, may be null, if there is no edge,
   * in which case the packet is dropped immediately
   * @param sender The sender node who sends the message
   * @param target The destination node who should receive the message
   * @param radioIntensity The intensity at which the message is sent
   * @param transmissionType The type of the transmission
   * @return The packet encapsulating the message
   */
  private synchronousSending(
    message: Message,
    edge: Edge | null,
    sender: Node,
    target: Node,
    radioIntensity: number,
    transmissionType: TransmissionType,
  ): Packet {
    if (!this.simulation.isRunning)
      throw new Error("Simulation is not running");

    const clonedMsg = message.clone();
    const simulation = this.simulation as SynchronousSimulation;
    const packet = new this.UsedPacket(
      clonedMsg,
      sender.id,
      target.id,
      transmissionType,
    );

    const transmissionTime =
      simulation.messageTransmissionModel.timeToReach(packet);

    packet.arrivingTime = simulation.currentTime + transmissionTime;
    packet.sendingTime = simulation.currentTime;
    packet.setEdge(edge);
    packet.intensity = radioIntensity;

    if (edge) {
      if (!this.reliabilityModel.reachesDestination(packet)) {
        packet.denyDelivery();
      }
      edge.addPacket(packet);
    } else {
      packet.denyDelivery();
    }

    target.packetBuffer.addPacket(packet);

    simulation.statistics.registerSentMessage(packet);

    return packet;
  }

  /**
   * This method broadcasts a Message with a given intensity.
   * Note that this message is more efficient concerning the
   * memory usage than the sendPacket message, but note also
   * that with this method the user sends a message and receives
   * a packet (as there are always packets received). If that
   * disturbes you use the broadcastPacket method instead.
   *
   * @param m The message to be sent to all the neighbors.
   * @param intensity The intensity to send the messages with.
   */
  private broadcastMessage(message: Message, radioIntensity: number) {
    if (!this.simulation.isRunning && !this.simulation.isAsyncMode)
      throw new Error("Simulation is not running");

    if (this.simulation.project.simulationConfig.interferenceEnabled) {
      let longestPacket: Packet | null = null; // the packet with the longest transmission time

      for (const [, edge] of this.getOutgoingEdges()) {
        const target = this.simulation.getCertainNode(edge.target);

        const packet = this.sendMessage(
          message,
          edge,
          this,
          target,
          radioIntensity,
          TransmissionType.BROADCAST,
        );

        this.simulation.packetsInTheAir.add(packet, true);

        if (
          !longestPacket ||
          packet.arrivingTime! > longestPacket.arrivingTime!
        ) {
          longestPacket = packet;
        }
      }

      if (longestPacket) {
        this.simulation.packetsInTheAir.upgradeToActivePacket(longestPacket);
      } else {
        const selfPacket = this.sendMessage(
          message,
          null,
          this,
          this,
          radioIntensity,
          TransmissionType.BROADCAST,
        );

        selfPacket.denyDelivery();

        this.simulation.packetsInTheAir.add(selfPacket, false);
      }
    } else {
      // No Interference
      for (const [, edge] of this.getOutgoingEdges()) {
        const target = this.simulation.getCertainNode(edge.target);

        this.sendMessage(
          message,
          edge,
          this,
          target,
          radioIntensity,
          TransmissionType.BROADCAST,
        );
      }
    }
  }

  /**
   * Returns the Inbox instance associated with this Node.
   * The Inbox instance holds the packets that are currently in the inbox
   * of this Node.
   * @returns The Inbox instance associated with this Node.
   */
  getInbox(): Inbox {
    return this.packetBuffer.getInbox();
  }
}
