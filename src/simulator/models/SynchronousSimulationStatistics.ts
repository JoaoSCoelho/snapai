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
  public lastRoundSentMessages: number = 0;
  public lastRoundReceivedMessages: number = 0;
  public lastRoundSentBytes: number = 0;
  public lastRoundReceivedBytes: number = 0;
  public lastRoundSentMessageBytes: number = 0;
  public lastRoundReceivedMessageBytes: number = 0;
  public roundsWithMessageSending: number = 0;
  public roundsWithMessageReceiving: number = 0;
  public rounds: Map<number, RoundStatistics> | null = null;
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

  public registerSentMessage(packet: Packet): this {
    // Update totals
    this.sentMessages++;
    this.sentBytes += packet.getByteSize();
    this.sentMessageBytes += packet.message.getByteSize();

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

  public registerReceivedMessage(packet: Packet): this {
    this.receivedMessages++;
    this.receivedBytes += packet.getByteSize();
    this.receivedMessageBytes += packet.message.getByteSize();

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
