"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Sigma } from "sigma";
import { createEdgeArrowProgram, EdgeRectangleProgram } from "sigma/rendering";
import { useSimulationContext } from "../contexts/SimulationContext";
import {
  EdgeAttributes,
  Graph,
  NodeAttributes,
} from "@/simulator/modules/Graph";
import { useGraphVisualizationContext } from "../contexts/GraphVisualizationContext";
import { NoEdgeProgram } from "../utils/NoEdgeProgram";

export type GraphViewerProps = {
  arrowHeadSize?: number;
};

export type GraphViewerRef = {
  getSigma: () => Sigma<NodeAttributes, EdgeAttributes> | null;
};

export const GraphViewer = forwardRef<GraphViewerRef, GraphViewerProps>(
  ({ arrowHeadSize }, ref) => {
    // Contexts
    const { simulation } = useSimulationContext();
    const {
      cameraState,
      setCameraState,
      shouldShowIds,
      shouldShowArrows,
      shouldShowEdges,
      sigmaRef,
      onUpdateSigma,
    } = useGraphVisualizationContext();

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!containerRef.current || !simulation) return;

      if (sigmaRef.current) {
        sigmaRef.current.kill(); // @ts-ignore
        delete sigmaRef.current;
      }

      containerRef.current = document.getElementById(
        "graph-container",
      ) as HTMLDivElement;

      sigmaRef.current = new Sigma<NodeAttributes, EdgeAttributes>(
        simulation.graph,
        containerRef.current!,
        {
          renderEdgeLabels: true, // TODO : review its configurations
          autoCenter: false,
          renderLabels: shouldShowIds ?? true,
          defaultEdgeType: shouldShowArrows ? "arrow" : "line",
          edgeProgramClasses: {
            line: shouldShowEdges ? EdgeRectangleProgram : NoEdgeProgram,
            arrow: shouldShowEdges
              ? createEdgeArrowProgram({
                  lengthToThicknessRatio: 2.5 * (arrowHeadSize ?? 1),
                  widenessToThicknessRatio: 2 * (arrowHeadSize ?? 1),
                })
              : NoEdgeProgram,
          },
        },
      );
      onUpdateSigma();

      // enableDrag(); // TODO: enable it
      // enableNodeInfo(); // TODO: enable it

      initCamera();

      // let interval: NodeJS.Timeout | null | undefined = null;
      // const animate = () => {
      //     if (graphRef.current) {
      //         graphRef.current.forEachNode((node, attr) => {
      //             if (attr.bound === true) return null;
      //             if (node === '0') return null;
      //             const coords = {
      //                 x: attr.x + Math.random() - 0.5,
      //                 y: attr.y + Math.random() - 0.5
      //             };
      //             if (coords.x < 0) coords.x = 0;
      //             if (coords.y < 0) coords.y = 0;
      //             if (coords.x > 100) coords.x = 100;
      //             if (coords.y > 100) coords.y = 100;

      //             if (node.length < 2) {

      //                 const newId = uuid();
      //                 graphRef.current!.updateNodeAttributes(node, (attr) => ({
      //                     ...attr,
      //                     ...coords,
      //                     lastTraceId: newId,
      //                     label: node
      //                 }));
      //                 graphRef.current!.addNode(newId, {
      //                     ...attr,
      //                     ...coords,
      //                     size: 1,
      //                     id: newId,
      //                     label: graphRef.current!.nodes().length
      //                 });
      //                 if (attr.lastTraceId) {
      //                     graphRef.current!.addEdge(attr.lastTraceId, newId, {
      //                         color: attr.color,
      //                         type: 'line' as const
      //                     })
      //                 }

      //                 setGraphData((prev) => ({
      //                     ...prev,
      //                     links: [
      //                         ...prev.links,
      //                         ...(attr.lastTraceId ?
      //                             [{
      //                                 source: attr.lastTraceId,
      //                                 target: newId,
      //                                 color: attr.color,
      //                                 type: 'line' as const
      //                             }] :
      //                             []
      //                         )
      //                     ],
      //                     nodes: [
      //                         ...prev.nodes.filter(n => n.id !== node),
      //                         {
      //                             ...attr,
      //                             ...coords,
      //                             lastTraceId: newId,
      //                             id: node,
      //                             label: node
      //                         },
      //                         {
      //                             ...attr,
      //                             ...coords,
      //                             size: 1,
      //                             id: newId,
      //                             label: (graphRef.current!.nodes().length - 1).toString()
      //                         }
      //                     ]
      //                 }));
      //             }
      //         });

      //     }
      // };
      // interval = isRunning ? setInterval(animate) : undefined;

      // return () => interval && clearTimeout(interval);
    }, [
      shouldShowEdges,
      shouldShowIds,
      arrowHeadSize,
      simulation,
      containerRef,
      shouldShowArrows,
    ]);

    useEffect(() => {
      if (!simulation) return;
      createBoundary(simulation.graph);
    }, [simulation]);

    useImperativeHandle(ref, () => ({
      getSigma: () => sigmaRef.current,
    }));

    const initCamera = () => {
      if (!sigmaRef.current || !simulation) return;
      if (cameraState) sigmaRef.current.getCamera().setState(cameraState);

      sigmaRef.current
        .getCamera()
        .on("updated", (state) => setCameraState(state));
    };

    const createBoundary = (g: Graph) => {
      if (!simulation) return;
      if (g.hasNode("b-lb")) return;

      const boundData = {
        nodes: [
          {
            id: "b-lb",
            x: simulation.project.simulationConfig.dimX[0],
            y: simulation.project.simulationConfig.dimY[0],
          },
          {
            id: "b-rb",
            x: simulation.project.simulationConfig.dimX[1],
            y: simulation.project.simulationConfig.dimY[0],
          },
          {
            id: "b-lt",
            x: simulation.project.simulationConfig.dimX[0],
            y: simulation.project.simulationConfig.dimY[1],
          },
          {
            id: "b-rt",
            x: simulation.project.simulationConfig.dimX[1],
            y: simulation.project.simulationConfig.dimY[1],
          },
        ],
        links: [
          { source: "b-lb", target: "b-rb" },
          { source: "b-lt", target: "b-lb" },
          { source: "b-lt", target: "b-rt" },
          { source: "b-rt", target: "b-rb" },
        ],
      };
      boundData.nodes.forEach((n) =>
        g.addNode(n.id, {
          ...n,
          z: 0,
          size: -1,
          highlighted: false,
          color: "#00000000",
          dragable: false,
          forceLabel: false,
          bound: true,
        }),
      );
      boundData.links.forEach((e) =>
        g.addEdge(e.source, e.target, {
          ...e,
          color: "#ccc",
          bound: true,
          dragable: false,
          highlighted: false,
          forceLabel: false,
          type: "line",
        }),
      );
    };

    // const enableDrag = () => {
    //   if (!graphRef.current) return;
    //   if (!sigmaRef.current) return;
    //   let draggedNode: string | null = null;

    //   sigmaRef.current.on("downNode", (e) => {
    //     if (!graphRef.current?.getNodeAttributes(e.node)?.dragable) return;
    //     draggedNode = e.node;
    //     sigmaRef.current!.getCamera().disable(); // Desativa o pan/zoom enquanto arrasta
    //   });

    //   sigmaRef.current.getMouseCaptor().on("mousemove", (e) => {
    //     if (draggedNode) {
    //       const pos = sigmaRef.current!.viewportToGraph(e);
    //       graphRef.current!.setNodeAttribute(draggedNode, "x", pos.x);
    //       graphRef.current!.setNodeAttribute(draggedNode, "y", pos.y);
    //       graphRef.current!.setNodeAttribute(
    //         draggedNode,
    //         "label",
    //         `(${pos.x.toFixed(2)},${pos.y.toFixed(2)})`,
    //       );
    //     }
    //   });

    //   sigmaRef.current.getMouseCaptor().on("mouseup", () => {
    //     if (draggedNode) {
    //       draggedNode = null;
    //       sigmaRef.current!.getCamera().enable(); // Reativa pan/zoom
    //     }
    //   });
    // };

    // const enableNodeInfo = () => {
    //   if (!graphRef.current) return;
    //   if (!sigmaRef.current) return;
    //   sigmaRef.current.on("enterNode", (e) => {
    //     if (mouseInNode) return;
    //     setMouseInNode(e.node);
    //   });
    //   sigmaRef.current.on("leaveNode", (e) => {
    //     setMouseInNode(null);
    //   });
    // };

    return (
      <>
        <div
          id="graph-container"
          ref={(el) => {
            if (el) {
              containerRef.current = el;
            }
          }}
          style={{ width: "100%", height: "100%", border: "1px solid #ccc" }}
        />
      </>
    );
  },
);
