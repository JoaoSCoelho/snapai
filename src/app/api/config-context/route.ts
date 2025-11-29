import { prisma } from "@/prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const configContextRequestedId = searchParams.get("id");

  if (
    configContextRequestedId &&
    Number.isNaN(Number(configContextRequestedId))
  ) {
    return new Response("Invalid id", { status: 400 });
  }

  const configContext = configContextRequestedId
    ? await prisma.configContext.findUnique({
        where: {
          id: Number(configContextRequestedId),
        },
      })
    : ((
        await prisma.configContext.findMany({
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        })
      )[0] ?? null);

  return Response.json(configContext);
}

export async function POST(request: Request) {
  const { selectedProject } = await request.json();
  const configContext = await prisma.configContext.create({
    data: {
      selectedProject: selectedProject,
    },
  });
  return Response.json(configContext);
}
