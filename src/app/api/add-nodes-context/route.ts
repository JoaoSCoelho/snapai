import { prisma } from "@/prisma/client";

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
  const data = await request.json();
  const addNodesContext = await prisma.nodesFormContext.create({
    data: {
      ...data,
    },
  });
  return Response.json(addNodesContext);
}
