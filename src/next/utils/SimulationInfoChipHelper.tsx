import { Simulation } from "@/simulator/models/Simulation";
import { SimulationInfoChipUpdater } from "../components/SimulationInfoChip";
import { SynchronousSimulation } from "@/simulator/models/SynchronousSimulation";
import { ReactNode } from "react";
import prettyBytes from "pretty-bytes";
import { Divider } from "@mui/material";
import { NumberUtils } from "@/simulator/utils/NumberUtils";

export class SimulationInfoChipHelper {
  public static updateForTime(
    updater: SimulationInfoChipUpdater,
    simulation: Simulation,
  ) {
    const text = simulation.currentTime.toString();
    let hoverBoxContent: ReactNode | undefined;

    if (!simulation.isAsyncMode && simulation.currentThread) {
      hoverBoxContent = (
        <p>
          Round:{" "}
          {(simulation as SynchronousSimulation).currentThread!.currentRound} of{" "}
          {(simulation as SynchronousSimulation).currentThread!.rounds}
        </p>
      );
    }

    updater({
      text,
      hoverBoxShortContent: hoverBoxContent,
      hoverBoxFullContent: hoverBoxContent,
    });
  }

  public static updateForTotalMessagesSent(
    updater: SimulationInfoChipUpdater,
    simulation: Simulation,
  ) {
    return updater({
      text: NumberUtils.prettyNumber(simulation.statistics.getSentMessages()),
      hoverBoxShortContent: (
        <>
          <p>Bytes: {prettyBytes(simulation.statistics.getSentBytes())}</p>
          <p>
            Message bytes:
            {prettyBytes(simulation.statistics.getSentMessageBytes())}
          </p>
        </>
      ),
      hoverBoxFullContent: (
        <>
          <p>Bytes: {prettyBytes(simulation.statistics.getSentBytes())}</p>
          <p>
            Message bytes:{" "}
            {prettyBytes(simulation.statistics.getSentMessageBytes())}
          </p>
          <Divider />
          <p className="text-xs text-right">
            <strong>Totals</strong>
          </p>
          <p>Messages: {simulation.statistics.getSentMessages()}</p>
          <p>Bytes: {simulation.statistics.getSentBytes()}</p>
          <p>Message bytes: {simulation.statistics.getSentMessageBytes()}</p>
        </>
      ),
    });
  }

  public static updateForTotalReceivedMessages(
    updater: SimulationInfoChipUpdater,
    simulation: Simulation,
  ) {
    return updater({
      text: NumberUtils.prettyNumber(
        simulation.statistics.getReceivedMessages(),
      ),
      hoverBoxShortContent: (
        <>
          <p>Bytes: {prettyBytes(simulation.statistics.getReceivedBytes())}</p>
          <p>
            Message bytes:
            {prettyBytes(simulation.statistics.getReceivedMessageBytes())}
          </p>
        </>
      ),
      hoverBoxFullContent: (
        <>
          <p>Bytes: {prettyBytes(simulation.statistics.getReceivedBytes())}</p>
          <p>
            Message bytes:{" "}
            {prettyBytes(simulation.statistics.getReceivedMessageBytes())}
          </p>
          <Divider />
          <p className="text-xs text-right">
            <strong>Totals</strong>
          </p>
          <p>Messages: {simulation.statistics.getReceivedMessages()}</p>
          <p>Bytes: {simulation.statistics.getReceivedBytes()}</p>
          <p>
            Message bytes: {simulation.statistics.getReceivedMessageBytes()}
          </p>
        </>
      ),
    });
  }
}
