"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { downloadAsPNG } from "@sigma/export-image";
import { Sigma } from "sigma";
import { createEdgeArrowProgram } from "sigma/rendering";
import { useSimulationContext } from "../contexts/SimulationContext";
import {
  EdgeAttributes,
  Graph,
  NodeAttributes,
} from "@/simulator/modules/Graph";
import { useGraphVisualizationContext } from "../contexts/GraphVisualizationContext";

export type GraphViewerProps = {
  arrowHeadSize?: number;
};

export type GraphViewerRef = {
  resetCam: () => void;
  getSigma: () => Sigma<NodeAttributes, EdgeAttributes>;
  toImage: () => void;
};

export const GraphViewer = forwardRef<GraphViewerRef, GraphViewerProps>(
  ({ arrowHeadSize }, ref) => {
    // Contexts
    const { simulation } = useSimulationContext();
    const { cameraState, setCameraState, shouldShowIds, shouldShowArrows } =
      useGraphVisualizationContext();

    const containerRef = useRef<HTMLDivElement>(null);
    const sigmaRef = useRef<Sigma<NodeAttributes, EdgeAttributes> | null>(null);

    useEffect(() => {
      console.log(containerRef.current, sigmaRef.current?.getContainer());
      if (!containerRef.current || !simulation) return;

      const current = sigmaRef.current;

      if (current) {
        current.kill(); // @ts-ignore
        delete sigmaRef.current;
        sigmaRef.current = null;
      }
      console.log("setting new sigmaRef");
      sigmaRef.current = new Sigma(
        simulation.graph,
        current?.getContainer() ?? containerRef.current,
        {
          renderEdgeLabels: true, // TODO : review its configurations
          autoCenter: false,
          renderLabels: shouldShowIds ?? true,
          allowInvalidContainer: true,
          edgeProgramClasses: {
            arrow: createEdgeArrowProgram({
              lengthToThicknessRatio: 2.5 * (arrowHeadSize ?? 1),
              widenessToThicknessRatio: 2 * (arrowHeadSize ?? 1),
            }),
          },
        },
      );

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
    }, [shouldShowIds, arrowHeadSize, simulation, containerRef]);

    useEffect(() => {
      if (!simulation) return;
      createBoundary(simulation.graph);
    }, [simulation]);

    useImperativeHandle(ref, () => ({
      resetCam,
      toImage,
      getSigma: () => sigmaRef.current!,
    }));

    const initCamera = () => {
      if (!sigmaRef.current || !simulation) return;
      if (cameraState) sigmaRef.current.getCamera().setState(cameraState);

      sigmaRef.current
        .getCamera()
        .on("updated", (state) => setCameraState(state));
    };

    const resetCam = () => {
      if (sigmaRef.current) {
        sigmaRef.current.getCamera().animatedReset({
          duration: 300,
        });
      }
    };

    const toImage = () => {
      if (!sigmaRef.current) return;

      downloadAsPNG(sigmaRef.current as any, {
        fileName: "graph", // nome do arquivo sem extensão
        backgroundColor: "#fff", // cor de fundo (ou transparente)
        width: null, // usa largura do container
        height: null, // usa altura do container
        layers: null, // exporta todos os layers
        cameraState: null, // estado atual da câmera
      });
    };

    const createBoundary = (g: Graph) => {
      console.log("createBoundary");
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
      console.log("creating");
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
          ref={containerRef}
          style={{ width: "100%", height: "100%", border: "1px solid #ccc" }}
        />
      </>
    );
  },
);
