import { Simulation } from "@/simulator/models/Simulation";
import { SimulationInfoChipUpdater } from "../components/SimulationInfoChip";
import { ReactNode } from "react";
import prettyBytes from "pretty-bytes";
import { NumberUtils } from "@/simulator/utils/NumberUtils";
import { AsynchronousSimulation } from "@/simulator/models/AsynchronousSimulation";
import { SynchronousThread } from "@/simulator/models/SynchronousThread";
import { SynchronousSimulationStatistics } from "@/simulator/models/SynchronousSimulationStatistics";
import { AsynchronousThread } from "@/simulator/models/AsynchronousThread";

export class SimulationInfoChipHelper {
  public static updateForTime(
    updater: SimulationInfoChipUpdater,
    simulation: Simulation,
  ) {
    const text = simulation.currentTime.toString();
    let hoverBoxContent: ReactNode | undefined;

    if (simulation.currentThread) {
      if (!simulation.isAsyncMode) {
        const thread = simulation.currentThread as SynchronousThread;
        hoverBoxContent = (
          <p>
            Round: {thread.currentRound} of {thread.rounds}
          </p>
        );
      } else {
        const thread = simulation.currentThread as AsynchronousThread;
        hoverBoxContent = (
          <p>
            Event: {thread.currentEvent} of {thread.events}
          </p>
        );
      }
    } else {
      hoverBoxContent = null;
    }

    updater({
      text,
      hoverBoxFullContent: hoverBoxContent,
    });
  }

  public static updateForTotalMessagesSent(
    updater: SimulationInfoChipUpdater,
    simulation: Simulation,
  ) {
    const statistics = simulation.statistics;

    return updater({
      text: NumberUtils.prettyNumber(statistics.getSentMessages()),
      hoverBoxShortContent: this.makeShortGenericInfo({
        Bytes: prettyBytes(statistics.getSentBytes()),
        "Message bytes": prettyBytes(statistics.getSentMessageBytes()),
      }),
      hoverBoxFullContent: this.makeFullGenericInfo("Totals", {
        Messages: statistics.getSentMessages(),
        Bytes: statistics.getSentBytes(),
        "Message bytes": statistics.getSentMessageBytes(),
      }),
    });
  }

  public static updateForTotalReceivedMessages(
    updater: SimulationInfoChipUpdater,
    simulation: Simulation,
  ) {
    const statistics = simulation.statistics;
    return updater({
      text: NumberUtils.prettyNumber(statistics.getReceivedMessages()),
      hoverBoxShortContent: this.makeShortGenericInfo({
        Bytes: prettyBytes(statistics.getReceivedBytes()),
        "Message bytes": prettyBytes(statistics.getReceivedMessageBytes()),
      }),
      hoverBoxFullContent: this.makeFullGenericInfo(
        "Totals",

        {
          Messages: statistics.getReceivedMessages(),
          Bytes: statistics.getReceivedBytes(),
          "Message bytes": statistics.getReceivedMessageBytes(),
        },
      ),
    });
  }

  public static updateForFramingRate(
    updater: SimulationInfoChipUpdater,
    simulation: Simulation,
  ) {
    const currentThread = simulation.currentThread;
    return updater({
      text: currentThread ? currentThread.framingRate.toFixed(0) : null,
      hoverBoxFullContent: currentThread ? (
        <p>{currentThread.framingRate.toFixed(3)} fps</p>
      ) : null,
    });
  }

  public static updateForRefreshingRate(
    updater: SimulationInfoChipUpdater,
    simulation: Simulation,
  ) {
    const currentThread = simulation.currentThread;
    return updater({
      text: currentThread ? currentThread.refreshingRate.toFixed(0) : null,
      hoverBoxFullContent: currentThread ? (
        <p>
          {currentThread.refreshingRate.toFixed(3)}{" "}
          {simulation.isAsyncMode ? "eps" : "rps"}
        </p>
      ) : null,
    });
  }

  public static updateForNodes(
    updater: SimulationInfoChipUpdater,
    simulation: Simulation,
  ) {
    // TODO: add number of nodes of each type in statistics
    return updater({ text: simulation.nodeSize().toString() });
  }

  public static updateForEdges(
    updater: SimulationInfoChipUpdater,
    simulation: Simulation,
  ) {
    // TODO: add number of unidirectional and bidirectional edges
    return updater({ text: simulation.edgeSize().toString() });
  }

  public static updateForRemainingEvents(
    updater: SimulationInfoChipUpdater,
    simulation: Simulation,
  ) {
    if (!simulation.isAsyncMode) return updater({ text: null });
    return updater({
      text: (simulation as AsynchronousSimulation).eventQueue.size().toString(),
    });
  }

  public static updateForMessagesSentOnRound(
    updater: SimulationInfoChipUpdater,
    simulation: Simulation,
  ) {
    if (simulation.isAsyncMode) return updater({ text: null });
    const statistics = simulation.statistics as SynchronousSimulationStatistics;
    return updater({
      text: NumberUtils.prettyNumber(statistics.getLastRoundSentMessages()),
      hoverBoxShortContent: this.makeShortGenericInfo({
        Bytes: prettyBytes(statistics.getLastRoundSentBytes()),
        "Message bytes": prettyBytes(statistics.getLastRoundSentMessageBytes()),
      }),
      hoverBoxFullContent: this.makeFullGenericInfo(
        "Totals",

        {
          Messages: statistics.getLastRoundSentMessages(),
          Bytes: statistics.getLastRoundSentBytes(),
          "Message bytes": statistics.getLastRoundSentMessageBytes(),
        },
      ),
    });
  }

  public static updateForMessagesReceivedOnRound(
    updater: SimulationInfoChipUpdater,
    simulation: Simulation,
  ) {
    if (simulation.isAsyncMode) return updater({ text: null });
    const statistics = simulation.statistics as SynchronousSimulationStatistics;
    return updater({
      text: NumberUtils.prettyNumber(statistics.getLastRoundReceivedMessages()),
      hoverBoxShortContent: this.makeShortGenericInfo({
        Bytes: prettyBytes(statistics.getLastRoundReceivedBytes()),
        "Message bytes": prettyBytes(
          statistics.getLastRoundReceivedMessageBytes(),
        ),
      }),
      hoverBoxFullContent: this.makeFullGenericInfo(
        "Totals",

        {
          Messages: statistics.getLastRoundReceivedMessages(),
          Bytes: statistics.getLastRoundReceivedBytes(),
          "Message bytes": statistics.getLastRoundReceivedMessageBytes(),
        },
      ),
    });
  }

  protected static makeShortGenericInfo(data: Record<string, any>) {
    return (
      <>
        {Object.entries(data).map(([key, value]) => (
          <p key={key}>
            {key}: {value}
          </p>
        ))}
      </>
    );
  }

  protected static makeFullGenericInfo(
    title: string = "",
    fullData: Record<string, any>,
  ) {
    return (
      <>
        {title && (
          <p className="text-xs text-right">
            <strong>{title}</strong>
          </p>
        )}
        {this.makeShortGenericInfo(fullData)}
      </>
    );
  }
}
