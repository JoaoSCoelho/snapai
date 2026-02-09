"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Sigma } from "sigma";
import {
  createEdgeArrowProgram,
  drawDiscNodeHover,
  drawDiscNodeLabel,
  EdgeRectangleProgram,
  NodeCircleProgram,
  NodePointProgram,
  NodeProgram,
} from "sigma/rendering";
import { useSimulationContext } from "../contexts/SimulationContext";
import {
  EdgeAttributes,
  Graph,
  NodeAttributes,
} from "@/simulator/modules/Graph";
import { useGraphVisualizationContext } from "../contexts/GraphVisualizationContext";
import { NoEdgeProgram } from "../utils/NoEdgeProgram";
import { Position } from "@/simulator/tools/Position";
import { CameraState, MouseCoords, SigmaNodeEventPayload } from "sigma/types";
import { createNodeBorderProgram, NodeBorderProgram } from "@sigma/node-border";
import { debounce, throttle } from "../utils/debounce";

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
      shouldShowLabels,
      shouldShowArrows,
      shouldShowEdges,
      sigmaRef,
      isRunning,
      hoveredNode,
      setFocusedNode,
      setHoveredNode,
      onUpdateSigma,
      setNodeFocusEnabled,
      setNodeDragEnabled,
      getNodeFocusEnabled,
      getNodeDragEnabled,
      getCameraEnabled,
      cameraEnabled,
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
          renderLabels: shouldShowLabels ?? true,
          labelColor: {
            attribute: "color",
          },
          defaultNodeType: "bordered",
          nodeProgramClasses: {
            bordered: createNodeBorderProgram({
              drawHover: drawDiscNodeHover,
              drawLabel: drawDiscNodeLabel,
              borders: [
                {
                  color: {
                    attribute: "highlightColor",
                    defaultValue: "#00000000",
                    transparent: true,
                  },
                  size: {
                    mode: "relative",
                    attribute: "highlightSize",
                    defaultValue: 0,
                  },
                },
                {
                  color: {
                    attribute: "highlightBaseColor",
                    defaultValue: "#00000000",
                    transparent: true,
                  },
                  size: {
                    mode: "relative",
                    attribute: "highlightBaseSize",
                    defaultValue: 0,
                  },
                },

                {
                  color: {
                    attribute: "borderColor",
                    defaultValue: "#00000000",
                    transparent: true,
                  },
                  size: {
                    mode: "pixels",
                    attribute: "borderSize",
                    defaultValue: 0,
                  },
                },
                {
                  color: {
                    attribute: "color",
                    defaultValue: "#666",
                    transparent: true,
                  },
                  size: {
                    mode: "relative",
                    value: 1,
                  },
                },
              ],
            }),
          },
          defaultEdgeType: shouldShowArrows ? "arrow" : "line",
          edgeReducer(edge, attr) {
            if (attr.bound) return attr;
            if (attr.highlighted) {
              return {
                color: "#666666",
                size: 2,
                zIndex: 1000000,
                type: `${attr.type ?? (shouldShowArrows ? "arrow" : "line")}Highlight`,
              };
            } else {
              return {
                color: attr.color,
                size: attr.width,
              };
            }
          },
          edgeProgramClasses: {
            line: shouldShowEdges ? EdgeRectangleProgram : NoEdgeProgram,
            arrow: shouldShowEdges
              ? createEdgeArrowProgram({
                  lengthToThicknessRatio: 2.5 * (arrowHeadSize ?? 1),
                  widenessToThicknessRatio: 2 * (arrowHeadSize ?? 1),
                })
              : NoEdgeProgram,
            arrowHighlight: createEdgeArrowProgram({
              lengthToThicknessRatio: 2.5 * (arrowHeadSize ?? 1),
              widenessToThicknessRatio: 2 * (arrowHeadSize ?? 1),
            }),
            lineHighlight: EdgeRectangleProgram,
          },
        },
      );
      onUpdateSigma();

      enableNodeDrag();
      enableNodeHover();
      enableNodeFocus();

      initCamera();
    }, [
      shouldShowEdges,
      shouldShowLabels,
      arrowHeadSize,
      cameraEnabled,
      simulation,
      containerRef,
      shouldShowArrows,
    ]);

    useEffect(() => {
      if (!simulation) return;
      createBoundary(simulation.graph);
      setNodeDragEnabled(true);
      setNodeFocusEnabled(true);
    }, [simulation]);

    useEffect(() => {
      if (isRunning) {
        setNodeDragEnabled(false);
        setNodeFocusEnabled(false);
      } else {
        setNodeDragEnabled(true);
        setNodeFocusEnabled(true);
      }
    }, [isRunning]);

    useImperativeHandle(ref, () => ({
      getSigma: () => sigmaRef.current,
    }));

    const initCamera = () => {
      if (!sigmaRef.current || !simulation) return;
      if (!getCameraEnabled()) {
        sigmaRef.current.getCamera().disable();
      } else {
        sigmaRef.current.getCamera().enable();
      }
      if (cameraState) sigmaRef.current.getCamera().setState(cameraState);

      const updateCameraState = debounce((state: CameraState) => {
        setCameraState(state);
      }, 100);

      sigmaRef.current.getCamera().on("updated", updateCameraState);
    };

    /**
     * Creates boundary nodes and edges in the given graph.
     * The boundary consists of 4 nodes at the corners of the simulation
     * area, and 4 edges connecting them in a square shape.
     * The boundary nodes are fixed and not draggable.
     * The boundary edges are also not draggable, and are not highlighted.
     * @param {Graph} g - the graph to create the boundary in
     */
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
          label: "",
          size: -1,
          highlighted: false,
          color: "#00000000",
          draggable: false,
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

    /**
     * Enables node dragging on the graph.
     * When a node is dragged, the camera is disabled to prevent panning/zooming.
     * When the mouse is released, the camera is re-enabled and the node position is updated.
     */
    const enableNodeDrag = () => {
      if (!simulation) return;
      if (!sigmaRef.current) return;
      let draggedNode: string | null = null;

      sigmaRef.current.on("downNode", (e) => {
        if (!simulation.isNodeDraggable(Number(e.node))) return;
        if (!getNodeDragEnabled()) return;
        draggedNode = e.node;
        sigmaRef.current!.getCamera().disable(); // Desativa o pan/zoom enquanto arrasta
      });

      sigmaRef.current.getMouseCaptor().on("mousemove", (e: MouseCoords) => {
        if (!getNodeDragEnabled()) return;
        if (draggedNode) {
          const pos = sigmaRef.current!.viewportToGraph(e);
          simulation.updateNodePosition(
            Number(draggedNode),
            new Position(pos.x, pos.y),
          );
        }
      });

      sigmaRef.current.getMouseCaptor().on("mouseup", () => {
        if (!getNodeDragEnabled()) return;
        if (draggedNode) {
          draggedNode = null;
          if (getCameraEnabled()) sigmaRef.current!.getCamera().enable();
        }
      });
    };

    /**
     * Enables node hovering on the graph.
     * When a node is hovered, the hovered node ID is stored in the state.
     * When the mouse is moved away from the node, the hovered node ID is set to null.
     */
    const enableNodeHover = () => {
      if (!simulation) return;
      if (!sigmaRef.current) return;

      sigmaRef.current.on("enterNode", (e: SigmaNodeEventPayload) => {
        if (hoveredNode) return;
        if (!getNodeFocusEnabled()) return;
        setHoveredNode(e.node);
      });

      sigmaRef.current.on("leaveNode", () => {
        if (!getNodeFocusEnabled()) return;
        setHoveredNode(null);
      });
    };

    /**
     * Enables node focusing on the graph.
     * When a node is clicked, the focused node ID is stored in the state.
     * When the background is clicked, the focused node ID is set to null.
     */
    const enableNodeFocus = () => {
      if (!simulation) return;
      if (!sigmaRef.current) return;

      sigmaRef.current.on("clickNode", (e: SigmaNodeEventPayload) => {
        if (!getNodeFocusEnabled()) return;
        setFocusedNode(e.node);
      });

      sigmaRef.current.on("clickStage", () => {
        if (!getNodeFocusEnabled()) return;
        setFocusedNode(null);
      });
    };

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
