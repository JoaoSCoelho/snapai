import { Packet } from "./Packet";
import { RoundStatistics } from "./RoundStatistics";
import {
  SimulationStatistics,
  SimulationStatisticsOptions,
} from "./SimulationStatistics";
import { SynchronousSimulation } from "./SynchronousSimulation";

export type SynchronousSimulationStatisticsOptions =
  SimulationStatisticsOptions & {
    registerStatisticsForEveryRound: boolean;
  };

export class SynchronousSimulationStatistics extends SimulationStatistics {
  protected lastRoundSentMessages: number = 0;
  protected lastRoundReceivedMessages: number = 0;
  protected lastRoundSentBytes: number = 0;
  protected lastRoundReceivedBytes: number = 0;
  protected lastRoundSentMessageBytes: number = 0;
  protected lastRoundReceivedMessageBytes: number = 0;
  protected roundsWithMessageSending: number = 0;
  protected roundsWithMessageReceiving: number = 0;
  protected rounds: Map<number, RoundStatistics> | null = null;
  private registeredSendingRoundTimes: Set<number> = new Set();
  private registeredReceivingRoundTimes: Set<number> = new Set();
  private lastSendingRoundTime: number = 0;
  private lastReceivingRoundTime: number = 0;
  private readonly registerStatisticsForEveryRound: boolean;

  public constructor(
    private readonly simulation: SynchronousSimulation,
    options: SynchronousSimulationStatisticsOptions,
  ) {
    super(options);
    this.registerStatisticsForEveryRound =
      options.registerStatisticsForEveryRound;
    this.rounds = options.registerStatisticsForEveryRound ? new Map() : null;
  }

  public getLastRoundSentMessages(): number {
    return this.lastRoundSentMessages;
  }
  public getLastRoundReceivedMessages(): number {
    return this.lastRoundReceivedMessages;
  }
  public getLastRoundSentBytes(): number {
    return this.lastRoundSentBytes;
  }
  public getLastRoundReceivedBytes(): number {
    return this.lastRoundReceivedBytes;
  }
  public getLastRoundSentMessageBytes(): number {
    return this.lastRoundSentMessageBytes;
  }
  public getLastRoundReceivedMessageBytes(): number {
    return this.lastRoundReceivedMessageBytes;
  }
  public getRoundsWithMessageSending(): number {
    return this.roundsWithMessageSending;
  }
  public getRoundsWithMessageReceiving(): number {
    return this.roundsWithMessageReceiving;
  }
  public getRounds(): Map<number, RoundStatistics> | null {
    return this.rounds && new Map(this.rounds.entries());
  }

  /**
   * Registers a sent message for the current round.
   * If the current round is different from the last round,
   * the last round is reset and the current round is updated.
   * If the current round is not already registered, it is added to the list of rounds.
   * @param packet The packet to register.
   * @returns This object.
   */
  public registerSentMessage(packet: Packet): this {
    super.registerSentMessage(packet);
    if (this.simulation.currentTime !== this.lastSendingRoundTime) {
      // Reset last round
      this.lastRoundSentMessages = 0;
      this.lastRoundSentBytes = 0;
      this.lastRoundSentMessageBytes = 0;
      this.lastSendingRoundTime = this.simulation.currentTime;
    }

    // Update last round
    this.lastRoundSentMessages++;
    this.lastRoundSentBytes += packet.getByteSize();
    this.lastRoundSentMessageBytes += packet.message.getByteSize();
    if (!this.registeredSendingRoundTimes.has(this.simulation.currentTime)) {
      this.registeredSendingRoundTimes.add(this.simulation.currentTime);
      this.roundsWithMessageSending++;
    }

    // Update rounds
    if (this.registerStatisticsForEveryRound) {
      if (!this.rounds) this.rounds = new Map();

      let roundStatistics = this.rounds.get(this.simulation.currentTime);

      if (!roundStatistics) {
        roundStatistics = new RoundStatistics(this.simulation.currentTime);
        this.rounds.set(this.simulation.currentTime, roundStatistics);
      }

      roundStatistics!.registerSentMessage(packet);
    }

    return this;
  }

  /**
   * Registers a received message for the current round.
   * If the current round is different from the last round,
   * the last round is reset and the current round is updated.
   * If the current round is not already registered, it is added to the list of rounds.
   * @param packet The packet to register.
   * @returns This object.
   */
  public registerReceivedMessage(packet: Packet): this {
    super.registerReceivedMessage(packet);

    if (this.simulation.currentTime !== this.lastReceivingRoundTime) {
      this.lastRoundReceivedMessages = 0;
      this.lastRoundReceivedBytes = 0;
      this.lastRoundReceivedMessageBytes = 0;
      this.lastReceivingRoundTime = this.simulation.currentTime;
    }

    this.lastRoundReceivedMessages++;
    this.lastRoundReceivedBytes += packet.getByteSize();
    this.lastRoundReceivedMessageBytes += packet.message.getByteSize();

    if (!this.registeredReceivingRoundTimes.has(packet.arrivingTime!)) {
      this.registeredReceivingRoundTimes.add(packet.arrivingTime!);
      this.roundsWithMessageReceiving++;
    }

    if (this.registerStatisticsForEveryRound) {
      if (!this.rounds) this.rounds = new Map();

      let roundStatistics = this.rounds.get(this.simulation.currentTime);

      if (!roundStatistics) {
        roundStatistics = new RoundStatistics(this.simulation.currentTime);
        this.rounds.set(this.simulation.currentTime, roundStatistics);
      }

      roundStatistics!.registerReceivedMessage(packet);
    }

    return this;
  }
}
