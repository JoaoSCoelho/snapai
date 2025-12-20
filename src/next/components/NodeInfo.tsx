import { Divider, Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSimulationContext } from "../contexts/SimulationContext";
import { NodeAttributes } from "@/simulator/modules/Graph";
import { FaInbox, FaRegCheckCircle, FaRoute } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { BiSolidRename } from "react-icons/bi";
import { PiHighlighter, PiPlugsConnectedFill } from "react-icons/pi";
import GppGoodIcon from "@mui/icons-material/GppGood";
import LeakRemoveIcon from "@mui/icons-material/LeakRemove";
import { TbAxisX, TbAxisY } from "react-icons/tb";
import { LuAxis3D } from "react-icons/lu";
import { TbCircuitChangeover } from "react-icons/tb";
import { PiGraphFill } from "react-icons/pi";
import {
  MdCallMade,
  MdCallReceived,
  MdLabel,
  MdOutlineLabelOff,
  MdOutlinePinch,
  MdPinch,
} from "react-icons/md";
import { Position } from "@/simulator/tools/Position";
import { PiHighlighterFill } from "react-icons/pi";
import Image from "next/image";
import { IoColorFill } from "react-icons/io5";
import { RxSize } from "react-icons/rx";
import { RiPushpin2Fill } from "react-icons/ri";
import { RiPushpin2Line } from "react-icons/ri";
import { FaAddressCard } from "react-icons/fa6";
import { useGraphVisualizationContext } from "../contexts/GraphVisualizationContext";
import clsx from "clsx";
import { throttle } from "../utils/debounce";
import { TbColorFilter } from "react-icons/tb";
import { RiCustomSize } from "react-icons/ri";
import { MdOutlineColorLens } from "react-icons/md";
import { FaHighlighter } from "react-icons/fa";

export type NodeInfoProps = {
  node?: string;
};

const NodeInfo = ({ node: nodeId }: NodeInfoProps) => {
  const { isRunning } = useGraphVisualizationContext();
  const { simulation } = useSimulationContext();

  const [refresh, setRefresh] = useState(0);
  const [node, setNode] = useState<NodeAttributes | null>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const borderColorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!simulation) return;
    if (!nodeId || !simulation.hasNode(Number(nodeId))) {
      setNode(null);
      return;
    }
    const node = simulation.graph.getNodeAttributes(nodeId);
    if (!node || !node.implementation) {
      setNode(null);
      return;
    }
    setNode(node);
    const repositionListener = throttle((_: any, newPos: Position) => {
      setNode((old) => ({
        ...old,
        x: newPos.x,
        y: newPos.y,
        z: newPos.z,
        size: node.size,
        originalSize: node.size,
        draggable: node.draggable,
        forceLabel: node.forceLabel,
        bound: node.bound,
        highlighted: node.highlighted,
        forceHighlight: node.forceHighlight,
      }));
    }, 100);
    node.implementation.on("reposition", repositionListener);

    return () => {
      node.implementation?.off("reposition", repositionListener);
    };
  }, [nodeId, simulation, refresh]);

  if (!node || !simulation || !node.implementation) return null;

  const highlightNode = () => {
    if (!node) return;
    simulation.highlightNode(node.implementation!.id);
    setRefresh((_) => _ + 1);
  };

  const resetHighlight = () => {
    if (!node || node.forceHighlight) return;
    simulation.unhighlightNode(node.implementation!.id);
    setRefresh((_) => _ + 1);
  };

  // TODO: add more info
  return (
    <div
      className="font-mono bg-amber-50 w-fit rounded-md border border-amber-200 text-slate-700 px-3 py-2"
      onMouseOver={() => {
        highlightNode();
      }}
      onMouseOut={() => {
        resetHighlight();
      }}
    >
      <div className="flex gap-2 justify-between">
        <div className="font-mono flex items-center gap-2">
          <span className="flex items-center">
            <Image
              src="/assets/id-dark.svg"
              alt="ID symbol"
              width={20}
              height={20}
            />
            :
          </span>
          <span className="font-extrabold">
            {node.implementation!.id ?? "----"}
          </span>
        </div>
        <Divider flexItem orientation="vertical" variant="fullWidth" />

        <div className="font-mono flex items-center gap-2">
          <span className="flex items-center gap-2">
            <FaAddressCard />
            Name:
          </span>
          <span className="font-extrabold">
            {node.implementation!.name ?? "----"}
          </span>
        </div>
        <Divider flexItem orientation="vertical" variant="fullWidth" />
        <div
          className="font-mono flex items-center gap-2"
          title={node.label ?? "----"}
        >
          <span className="flex items-center gap-2">
            <BiSolidRename />
            Label:
          </span>
          {!isRunning ? (
            <Tooltip arrow title="Edit label">
              <input
                aria-label="label input"
                key={node.implementation!.id}
                onChange={(e) => {
                  simulation.graph.setNodeAttribute(
                    node.implementation!.id,
                    "label",
                    e.target.value,
                  );
                }}
                type="text"
                className="font-extrabold not-focus:cursor-pointer not-focus:hover:underline"
                style={{ width: "15ch", textOverflow: "ellipsis" }}
                defaultValue={node.label ?? "----"}
              />
            </Tooltip>
          ) : (
            <span
              className="font-extrabold"
              style={{
                width: "15ch",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {node.label ?? "----"}
            </span>
          )}
        </div>
        <Divider flexItem orientation="vertical" variant="fullWidth" />
        <div className="font-mono flex items-center gap-2">
          <Tooltip
            arrow
            title={node.highlighted ? "Highlighted" : "Unhighlighted"}
          >
            <span className="font-extrabold">
              {node.highlighted ? (
                <PiHighlighterFill className="text-lg" />
              ) : (
                <PiHighlighter className="text-lg" />
              )}
            </span>
          </Tooltip>
        </div>
        <Divider flexItem orientation="vertical" variant="fullWidth" />
        <div className="font-mono flex items-center gap-2">
          <Tooltip
            arrow
            title={node.implementation!.arePinned() ? "Unpin" : "Pin"}
          >
            <span
              className="font-extrabold cursor-pointer"
              onClick={() => {
                node.implementation!.arePinned()
                  ? simulation.unpinNode(node.implementation!.id)
                  : simulation.pinNode(node.implementation!.id);
                setRefresh((_) => _ + 1);
              }}
            >
              {node.implementation.arePinned() ? (
                <RiPushpin2Fill className="text-2xl" />
              ) : (
                <RiPushpin2Line className="text-2xl" />
              )}
            </span>
          </Tooltip>
        </div>
      </div>
      <div
        className="grid gap-2 grid-cols-5"
        style={{ gridTemplateColumns: "1fr 1px 1fr 1px 1fr" }}
      >
        <Tooltip
          title={
            <>
              <p>
                Coordinate <b>X</b> of the node position.
              </p>
              <p className="text-center font-black text-xs">{node.x}</p>
              {!isRunning && (
                <p className="opacity-80 text-center">(Click to edit)</p>
              )}
            </>
          }
          arrow
        >
          <div className="font-mono flex items-center gap-2">
            <span className="flex items-center gap-2">
              <TbAxisX />
              X:
            </span>
            <span className="font-extrabold text-sm ">
              {isRunning ? (
                <span
                  className="font-extrabold block"
                  style={{
                    width: "15ch",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {node.x}
                </span>
              ) : (
                <input
                  aria-label="Coordinate X"
                  type="number"
                  lang="en"
                  step="0.0000000001"
                  className="no-spinner not-focus:cursor-pointer not-focus:hover:underline"
                  style={{ width: "15ch", textOverflow: "ellipsis" }}
                  value={node.x}
                  onChange={(e) => {
                    simulation.updateNodePosition(
                      node.implementation!.id,
                      new Position(Number(e.target.value), node.y, node.z),
                    );
                  }}
                />
              )}
            </span>
          </div>
        </Tooltip>
        <Divider flexItem orientation="vertical" variant="fullWidth" />
        <Tooltip
          title={
            <>
              <p>
                Coordinate <b>Y</b> of the node position.
              </p>
              <p className="text-center font-black text-xs">{node.y}</p>
              {!isRunning && (
                <p className="opacity-80 text-center">(Click to edit)</p>
              )}
            </>
          }
          arrow
        >
          <div className="font-mono flex items-center gap-2">
            <span className="flex items-center gap-2">
              <TbAxisY />
              Y:
            </span>
            <span className="font-extrabold text-sm">
              {isRunning ? (
                <span
                  className="font-extrabold block"
                  style={{
                    width: "15ch",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {node.y}
                </span>
              ) : (
                <input
                  aria-label="Coordinate Y"
                  type="number"
                  lang="en"
                  step="0.0000000001"
                  className="no-spinner not-focus:cursor-pointer not-focus:hover:underline"
                  value={node.y}
                  style={{ width: "15ch", textOverflow: "ellipsis" }}
                  onChange={(e) => {
                    simulation.updateNodePosition(
                      node.implementation!.id,
                      new Position(node.x, Number(e.target.value), node.z),
                    );
                  }}
                />
              )}
            </span>
          </div>
        </Tooltip>
        <Divider flexItem orientation="vertical" variant="fullWidth" />
        <Tooltip
          title={
            <>
              <p>
                Coordinate <b>Z</b> of the node position.
              </p>
              <p className="text-center font-black text-xs">{node.z}</p>
              {!isRunning && (
                <p className="opacity-80 text-center">(Click to edit)</p>
              )}
            </>
          }
          arrow
        >
          <div className="font-mono flex items-center gap-2">
            <span className="flex items-center gap-2">
              <LuAxis3D />
              Z:
            </span>
            <span className="font-extrabold text-sm">
              {isRunning ? (
                <span
                  className="font-extrabold block"
                  style={{
                    width: "15ch",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {node.z}
                </span>
              ) : (
                <input
                  aria-label="Coordinate Z"
                  type="number"
                  lang="en"
                  step="0.0000000001"
                  className="no-spinner not-focus:cursor-pointer not-focus:hover:underline"
                  value={node.z}
                  style={{ width: "15ch", textOverflow: "ellipsis" }}
                  onChange={(e) => {
                    simulation.updateNodePosition(
                      node.implementation!.id,
                      new Position(node.x, node.y, Number(e.target.value)),
                    );
                  }}
                />
              )}
            </span>
          </div>
        </Tooltip>
      </div>
      <div className="font-mono flex items-center">
        <span className="flex items-center gap-2">
          <FaRoute />
          Mobility model
        </span>
        <Divider className="flex-1" variant="middle" />
        <span className="font-extrabold">
          {node.implementation!.mobilityModel.name ?? "----"}
        </span>
      </div>
      <div className="font-mono flex items-center">
        <span className="flex items-center gap-2">
          <PiPlugsConnectedFill />
          Connectivity model
        </span>
        <Divider className="flex-1" variant="middle" />
        <span className="font-extrabold">
          {node.implementation!.connectivityModel.name ?? "----"}
        </span>
      </div>
      <div className="font-mono flex items-center">
        <span className="flex items-center gap-2">
          <GppGoodIcon fontSize="small" />
          Reliability model
        </span>
        <Divider className="flex-1" variant="middle" />
        <span className="font-extrabold">
          {node.implementation!.reliabilityModel.name ?? "----"}
        </span>
      </div>
      <div className="font-mono flex items-center">
        <span className="flex items-center gap-2">
          <LeakRemoveIcon fontSize="small" />
          Interference model
        </span>
        <Divider className="flex-1" variant="middle" />
        <span className="font-extrabold">
          {node.implementation!.interferenceModel.name ?? "----"}
        </span>
      </div>

      <div className="flex gap-2 justify-between">
        <Tooltip
          title="Number of messages in the inbox of the node for the current time."
          arrow
        >
          <div className="font-mono flex items-center gap-2">
            <span className="flex items-center gap-2">
              <FaInbox />
              Inbox:
            </span>
            <span className="font-extrabold">
              {node.implementation!.getInbox().size() ?? "----"}
            </span>
          </div>
        </Tooltip>
        <Divider flexItem orientation="vertical" variant="fullWidth" />
        <div className="font-mono flex items-center gap-2">
          <span className="flex items-center gap-2">
            <TbCircuitChangeover />
            Neighborhood changed:
          </span>
          <span className="font-extrabold">
            {node.implementation!.hasNeighborhoodChanges ? (
              <span className="flex items-center gap-2">
                <FaRegCheckCircle />
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <GiCancel />
              </span>
            )}
          </span>
        </div>
      </div>
      <div className="flex gap-2 justify-between">
        <div
          className="font-mono flex items-center gap-2 cursor-pointer hover:underline"
          onClick={() => {
            simulation.graph.setNodeAttribute(
              node.implementation!.id,
              "forceHighlight",
              !node.forceHighlight,
            );
            setRefresh((r) => r + 1);
          }}
        >
          <span className="flex items-center gap-2">
            {!node.forceHighlight ? <PiHighlighter /> : <PiHighlighterFill />}
            Highlighted:
          </span>
          <span className="font-extrabold">
            {node.forceHighlight ? (
              <span className="flex items-center gap-2">
                <FaRegCheckCircle />
              </span>
            ) : node.forceHighlight === false ? (
              <span className="flex items-center gap-2">
                <GiCancel />
              </span>
            ) : (
              "----"
            )}
          </span>
        </div>
        <Divider flexItem orientation="vertical" variant="fullWidth" />
        <Tooltip
          arrow
          title={`Click to ${node.forceLabel ? "disable" : "enable"} force label.`}
        >
          <div
            onClick={() => {
              simulation.graph.setNodeAttribute(
                node.implementation!.id,
                "forceLabel",
                !node.forceLabel,
              );
              setRefresh((r) => r + 1);
            }}
            className="font-mono flex items-center gap-2 cursor-pointer hover:underline"
          >
            <span className="flex items-center gap-2">
              {node.forceLabel ? <MdLabel /> : <MdOutlineLabelOff />}
              Force show label:
            </span>

            <span className="font-extrabold ">
              {node.forceLabel ? (
                <span className="flex items-center gap-2">
                  <FaRegCheckCircle />
                </span>
              ) : node.forceLabel === false ? (
                <span className="flex items-center gap-2">
                  <GiCancel />
                </span>
              ) : (
                "----"
              )}
            </span>
          </div>
        </Tooltip>
        <Divider flexItem orientation="vertical" variant="fullWidth" />

        <Tooltip
          arrow
          title={`Click to ${node.draggable ? "disable" : "enable"} drag.`}
        >
          <div
            onClick={() => {
              simulation.graph.setNodeAttribute(
                node.implementation!.id,
                "draggable",
                !node.draggable,
              );
              setRefresh((r) => r + 1);
            }}
            className="font-mono flex items-center gap-2 cursor-pointer hover:underline"
          >
            <span className="flex items-center gap-2">
              {!node.draggable ? <MdOutlinePinch /> : <MdPinch />}
              Draggable:
            </span>

            <span className="font-extrabold ">
              {node.draggable ? (
                <span className="flex items-center gap-2">
                  <FaRegCheckCircle />
                </span>
              ) : node.draggable === false ? (
                <span className="flex items-center gap-2">
                  <GiCancel />
                </span>
              ) : (
                "----"
              )}
            </span>
          </div>
        </Tooltip>
      </div>
      <div className="flex gap-2 justify-between">
        <div className="font-mono flex items-center gap-2">
          <span className="flex items-center gap-2">
            <MdCallReceived />
            In degree:
          </span>

          <span className="font-extrabold">
            {simulation.graph.hasNode(nodeId) &&
              simulation!.graph.inDegree(nodeId)}
          </span>
        </div>
        <Divider flexItem orientation="vertical" variant="fullWidth" />
        <div className="font-mono flex items-center gap-2">
          <span className="flex items-center gap-2">
            <PiGraphFill />
            Degree:
          </span>

          <span className="font-extrabold">
            {simulation.graph.hasNode(nodeId) &&
              simulation!.graph.degree(nodeId)}
          </span>
        </div>
        <Divider flexItem orientation="vertical" variant="fullWidth" />
        <div className="font-mono flex items-center gap-2">
          <span className="flex items-center gap-2">
            <MdCallMade />
            Out degree:
          </span>

          <span className="font-extrabold">
            {simulation.graph.hasNode(nodeId) &&
              simulation!.graph.outDegree(nodeId)}
          </span>
        </div>
      </div>

      <div className="flex gap-2 justify-between">
        <div className="font-mono flex items-center gap-2">
          <span className="flex items-center gap-2">
            <IoColorFill />
            Color:
          </span>
          <Tooltip
            arrow={!isRunning}
            title={!isRunning && "Click to change color"}
          >
            <span
              className={clsx(
                "font-extrabold flex items-center ",
                !isRunning && "hover:underline cursor-pointer",
              )}
              onClick={() => {
                !isRunning && colorInputRef.current?.click();
              }}
            >
              {node.color ? (
                <>
                  <span
                    className="inline-block w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: node.color }}
                  ></span>
                  {node.color}
                  {!isRunning && (
                    <input
                      aria-label="change color"
                      ref={colorInputRef}
                      type="color"
                      value={node.color ?? "#000000"}
                      onChange={(e) => {
                        simulation.graph.setNodeAttribute(
                          node.implementation!.id,
                          "color",
                          e.target.value,
                        );
                      }}
                      className="absolute opacity-0 pointer-events-none"
                    />
                  )}
                </>
              ) : (
                "----"
              )}
            </span>
          </Tooltip>
        </div>
        <Divider flexItem orientation="vertical" variant="fullWidth" />
        <div className="font-mono flex items-center gap-2">
          <span className="flex items-center gap-2">
            <RxSize />
            Size:
          </span>
          <span className="font-extrabold">{node.originalSize ?? "----"}</span>
        </div>
        <Divider flexItem orientation="vertical" variant="fullWidth" />
        <div className="font-mono flex items-center gap-2">
          <span className="flex items-center gap-2">
            <RxSize />
            Rendered size:
          </span>
          <span className="font-extrabold">{node.size ?? "----"}</span>
        </div>
      </div>
      <div className="flex gap-2 justify-between">
        <div className="font-mono flex items-center gap-2">
          <span className="flex items-center gap-2">
            <TbColorFilter />
            Border color:
          </span>
          <Tooltip
            arrow={!isRunning}
            title={!isRunning && "Click to change border color"}
          >
            <span
              className={clsx(
                "font-extrabold flex items-center",
                !isRunning && "cursor-pointer hover:underline",
              )}
              onClick={() => {
                !isRunning && borderColorInputRef.current?.click();
              }}
            >
              {
                <>
                  <span
                    className="inline-block w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: node.borderColor ?? "#00000000" }}
                  ></span>
                  {node.borderColor ?? "----"}
                  {!isRunning && (
                    <input
                      aria-label="change border color"
                      ref={borderColorInputRef}
                      type="color"
                      value={node.borderColor ?? "#ffffff"}
                      onChange={(e) => {
                        simulation.graph.setNodeAttribute(
                          node.implementation!.id,
                          "borderColor",
                          e.target.value,
                        );
                      }}
                      className="absolute opacity-0 pointer-events-none"
                    />
                  )}
                </>
              }
            </span>
          </Tooltip>
        </div>
        <Divider flexItem orientation="vertical" variant="fullWidth" />
        <div className="font-mono flex items-center gap-2">
          <span className="flex items-center gap-2">
            <RiCustomSize />
            Border size:
          </span>
          <Tooltip arrow={!isRunning} title={!isRunning && "Edit border size"}>
            {isRunning ? (
              <span
                className="font-extrabold block text-ellipsis"
                style={{
                  width: "7ch",
                }}
              >
                {node.borderSize ?? 0}
              </span>
            ) : (
              <input
                aria-label="borderSize"
                className="font-extrabold no-spinner not-focus:cursor-pointer not-focus:hover:underline text-ellipsis"
                defaultValue={node.borderSize ?? 0}
                key={node.implementation.id}
                type="number"
                step={0.01}
                style={{
                  width: "7ch",
                }}
                onChange={(e) => {
                  simulation.graph.setNodeAttribute(
                    node.implementation!.id,
                    "borderSize",
                    Number(e.target.value),
                  );
                }}
              />
            )}
          </Tooltip>
        </div>
      </div>
      <div className="flex gap-2 justify-between">
        <div className="font-mono flex items-center gap-2">
          <span className="flex items-center gap-2">
            <FaHighlighter />
            Highlight border color:
          </span>
          <span className="font-extrabold flex items-center">
            {
              <>
                <span
                  className="inline-block w-4 h-4 rounded-full mr-2"
                  style={{
                    backgroundColor: node.highlightColor ?? "#00000000",
                  }}
                ></span>
                {node.highlightColor ?? "----"}
              </>
            }
          </span>
        </div>
        <Divider flexItem orientation="vertical" variant="fullWidth" />
        <div className="font-mono flex items-center gap-2">
          <span className="flex items-center gap-2">
            <RiCustomSize />
            Highlight border size:
          </span>
          <span className="font-extrabold">{node.highlightSize ?? "----"}</span>
        </div>
      </div>
      <div className="flex gap-2 justify-between">
        <div className="font-mono flex items-center gap-2">
          <span className="flex items-center gap-2">
            <FaHighlighter />
            Highlight base color:
          </span>
          <span className="font-extrabold flex items-center">
            {
              <>
                <span
                  className="inline-block w-4 h-4 rounded-full mr-2"
                  style={{
                    backgroundColor: node.highlightBaseColor ?? "#00000000",
                  }}
                ></span>
                {node.highlightBaseColor ?? "----"}
              </>
            }
          </span>
        </div>
        <Divider flexItem orientation="vertical" variant="fullWidth" />

        <div className="font-mono flex items-center gap-2">
          <span className="flex items-center gap-2">
            <RiCustomSize />
            Highlight base size:
          </span>
          <span className="font-extrabold">
            {node.highlightBaseSize ?? "----"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NodeInfo;
