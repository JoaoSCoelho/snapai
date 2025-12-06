import { Graph } from "@/simulator/modules/Graph";

/**
 * Render a graph as an SVG element.
 * @param {Graph} graph - The graph to be rendered.
 * @returns {SVGElement} - The rendered SVG element.
 */
export async function renderGraphAsSvg(
  graph: Graph,
  callback?: (percentage: number) => void,
): Promise<SVGElement> {
  let dimX: number[] = [];
  let dimY: number[] = [];
  try {
    dimX = [
      graph.getNodeAttribute("b-lb", "x"),
      graph.getNodeAttribute("b-rt", "x"),
    ];
    dimY = [
      graph.getNodeAttribute("b-lb", "y"),
      graph.getNodeAttribute("b-rt", "y"),
    ];
  } catch (error) {
    console.error(error);
  }

  const svgns = "http://www.w3.org/2000/svg";
  const graphSvg = document.createElementNS(svgns, "svg");
  graphSvg.setAttribute(
    "viewBox",
    `${dimX[0]} ${dimY[0]} ${dimX[1] - dimX[0]} ${dimY[1] - dimY[0]}`,
  );
  const defs = document.createElementNS(svgns, "defs");
  const marker = document.createElementNS(svgns, "marker");
  marker.setAttribute("id", "arrowhead");
  marker.setAttribute("markerWidth", "6");
  marker.setAttribute("markerHeight", "6");
  marker.setAttribute("refX", "6");
  marker.setAttribute("refY", "3");
  marker.setAttribute("orient", "auto");
  marker.setAttribute("markerUnits", "strokeWidth");

  // Forma da seta
  const arrowPath = document.createElementNS(svgns, "path");
  arrowPath.setAttribute("d", "M0,0 L6,3 L0,6 Z");
  arrowPath.setAttribute(
    "fill",
    graph.mapEdges((e, a) => a.color)[graph.edges().length - 1] || "#AAA",
  );
  const markerStart = marker.cloneNode(true) as SVGMarkerElement;
  markerStart.setAttribute("id", "arrowhead-start");
  markerStart.setAttribute("orient", "auto-start-reverse");

  marker.appendChild(arrowPath);
  markerStart.appendChild(arrowPath.cloneNode(true));
  defs.appendChild(marker);
  defs.appendChild(markerStart);
  graphSvg.appendChild(defs);

  const total = graph.nodes().length + graph.edges().length;

  let startTime = Date.now();
  let current = 0;
  const addedEdges = new Map<string, SVGLineElement>();
  for (const [
    edge,
    attrs,
    source,
    target,
    sourceNode,
    targetNode,
  ] of graph.mapEdges(
    (edge, attrs, source, target, sourceNode, targetNode) =>
      [edge, attrs, source, target, sourceNode, targetNode] as const,
  )) {
    // Throttle
    if (Date.now() - startTime > 500) {
      await new Promise((r) => setTimeout(r));
      callback?.(current / total);
      startTime = Date.now();
    }

    current++;
    const id = `link-${source}-${target}`;
    const link = document.createElementNS(svgns, "line");

    // Coordenadas
    const x1 = sourceNode.x;
    const y1 = dimY[1] - sourceNode.y;
    const x2 = targetNode.x;
    const y2 = dimY[1] - targetNode.y;

    // Raio do nó alvo
    const r = targetNode.size ?? 10;

    // Vetor direção (do source → target)
    let dx = x2 - x1;
    let dy = y2 - y1;

    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) continue; // evita divisão por zero

    // Normaliza
    dx /= len;
    dy /= len;

    const oppositeEdge = addedEdges.get(`${target}:${source}`);

    if (oppositeEdge) {
      if (!source.startsWith("b-"))
        oppositeEdge.setAttribute("marker-start", "url(#arrowhead-start)");
      addedEdges.delete(`${target}:${source}`);
      continue;
    }

    const startX = x1 + dx * r;
    const startY = y1 + dy * r;
    // Move o ponto final para trás pelo raio do nó
    const endX = x2 - dx * r;
    const endY = y2 - dy * r;

    // Aresta ajustada
    link.setAttribute("x1", startX.toString());
    link.setAttribute("y1", startY.toString());
    link.setAttribute("x2", endX.toString());
    link.setAttribute("y2", endY.toString());

    link.setAttribute("id", id);
    link.setAttribute("class", "link");
    link.setAttribute("stroke-width", attrs.width?.toString() ?? "1");
    link.setAttribute("stroke", attrs.color || "#AAA");

    // Seta
    if (!source.startsWith("b-"))
      link.setAttribute("marker-end", "url(#arrowhead)");

    graphSvg.append(link);
    addedEdges.set(`${source}:${target}`, link);
  }

  const frag = document.createDocumentFragment();

  for (const [node, attrs] of graph.mapNodes(
    (node, attrs) => [node, attrs] as const,
  )) {
    if (Date.now() - startTime > 500) {
      console.log(current, total);
      await new Promise((resolve) => setTimeout(resolve));
      callback?.(current / total);
      startTime = Date.now();
    }

    current++;
    const id = `node-${node}`;
    let radius = Math.max(0, attrs.size ?? 10);

    // --- NODE CIRCLE ---
    const circle = document.createElementNS(svgns, "circle");

    circle.setAttribute("id", id);
    circle.setAttribute("class", "node");
    circle.setAttribute("cx", attrs.x.toString());
    circle.setAttribute("cy", (dimY[1] - attrs.y).toString());
    circle.setAttribute("r", radius.toString());

    circle.setAttribute("fill", attrs.color || "#666");

    // Borda fina
    circle.setAttribute("stroke", "#222");
    circle.setAttribute("stroke-width", "1");

    // --- LABEL (ID DO NÓ) ---
    const textId = `text-${node}`;
    const text = document.createElementNS(svgns, "text");

    text.setAttribute("id", textId);
    text.setAttribute("x", attrs.x.toString());
    text.setAttribute("y", (dimY[1] - attrs.y + radius / 2).toString()); // leve ajuste vertical
    text.setAttribute("class", "node-label");

    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", `${radius * 0.9}`);
    text.setAttribute("font-family", "Arial, sans-serif");

    // Cor automática dependendo do fundo
    const fill = attrs.color || "#666";
    const textColor =
      parseInt(fill.replace("#", ""), 16) > 0xffffff / 2 ? "#111" : "#fff";

    text.setAttribute("fill", textColor);
    text.textContent = node;

    new Promise(() => frag.append(circle, text));
  }

  graphSvg.append(frag);

  return graphSvg;
}

/**
 * Export a sigma graph as an SVG file.
 * @param {Graph} graph - The sigma graph to export.
 */
export async function exportSigmaToSVG(
  graph: Graph,
  callback?: (percentage: number) => void,
) {
  const svg = new XMLSerializer().serializeToString(
    await renderGraphAsSvg(graph, callback),
  );

  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "graph.svg";
  a.click();

  URL.revokeObjectURL(url);
}
