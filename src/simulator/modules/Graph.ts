import { DirectedGraph } from "graphology";
import { Edge } from "../models/Edge";
import { Node } from "../models/Node";

export type NodeAttributes = {
  implementation?: Node;
  x: number;
  y: number;
  z: number;
  size: number;
  originalSize: number;
  color?: string;
  draggable: boolean;
  forceLabel: boolean;
  highlighted: boolean;
  forceHighlight: boolean;
  highlightColor?: string;
  highlightBaseColor?: string;
  highlightSize?: number;
  highlightBaseSize?: number;
  bound: boolean;
  label?: string;
  borderColor?: string;
  type?: "circle" | "bordered";
  borderSize?: number;
};

export type EdgeAttributes = {
  implementation?: Edge;
  color?: string;
  label?: string;
  type?: "line" | "arrow";
  width?: number;
  highlighted?: boolean;
  bound?: boolean;
  forceLabel?: boolean; // TODO: review it
  dragable?: boolean;
};

export class Graph extends DirectedGraph<NodeAttributes, EdgeAttributes> {
  // TODO: turn it a multi directed graph
}
