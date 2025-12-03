import { prisma } from "@/prisma/client";
import { NodesFormContext } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const addNodesContextRequestedId = searchParams.get("id");

  if (
    addNodesContextRequestedId &&
    Number.isNaN(Number(addNodesContextRequestedId))
  ) {
    return new Response("Invalid id", { status: 400 });
  }

  const addNodesContext = addNodesContextRequestedId
    ? await prisma.nodesFormContext.findUnique({
        where: {
          id: Number(addNodesContextRequestedId),
        },
      })
    : ((
        await prisma.nodesFormContext.findMany({
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        })
      )[0] ?? null);

  return Response.json(addNodesContext);
}

export async function POST(request: Request) {
  const data: Partial<NodesFormContext> = await request.json();
  const addNodesContext = await prisma.nodesFormContext.create({
    data: {
      addedToSimulation: data.addedToSimulation,
      numberOfNodes: data.numberOfNodes ?? 0,
      node: data.node ?? "",
      nodeParameters: data.nodeParameters ?? {},
      mobilityModel: data.mobilityModel ?? "",
      mobilityModelParameters: data.mobilityModelParameters ?? {},
      connectivityModel: data.connectivityModel ?? "",
      connectivityModelParameters: data.connectivityModelParameters ?? {},
      distributionModel: data.distributionModel ?? "",
      distributionModelParameters: data.distributionModelParameters ?? {},
      interferenceModel: data.interferenceModel ?? "",
      interferenceModelParameters: data.interferenceModelParameters ?? {},
      reliabilityModel: data.reliabilityModel ?? "",
      reliabilityModelParameters: data.reliabilityModelParameters ?? {},
    },
  });
  return Response.json(addNodesContext);
}
