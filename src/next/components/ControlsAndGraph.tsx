import { GraphViewer, GraphViewerRef } from "./GraphViewer";
import { SimulationSideInfoBar } from "./SimulationSideInfoBar";

export type ControlsAndGraphProps = {
  graphViewerRef?: React.RefObject<GraphViewerRef>;
};

export function ControlsAndGraph({ graphViewerRef }: ControlsAndGraphProps) {
  return (
    <div className="grid grid-cols-2 gap-2 controls-and-graph">
      <div
        className="flex flex-col gap-2 p-4 bg-gray-50 w-full overflow-y-auto"
        style={{ height: "90dvh" }}
      >
        <SimulationSideInfoBar />
      </div>

      <div
        className="graph-container"
        style={{ minWidth: "90dvh", width: "90dvh", height: "90dvh" }}
      >
        <GraphViewer
          ref={graphViewerRef}
          arrowHeadSize={1.5} // Put it as a configuration
        />
      </div>
    </div>
  );
}
