import { RuntimeFormSchema } from "@/next/components/ControlBar";
import { prisma } from "@/prisma/client";
import { RuntimeContext } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const runtimeContextRequestedId = searchParams.get("id");

  if (
    runtimeContextRequestedId &&
    Number.isNaN(Number(runtimeContextRequestedId))
  ) {
    return new Response("Invalid id", { status: 400 });
  }

  const runtimeContext = runtimeContextRequestedId
    ? await prisma.runtimeContext.findUnique({
        where: {
          id: Number(runtimeContextRequestedId),
        },
      })
    : ((
        await prisma.runtimeContext.findMany({
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        })
      )[0] ?? null);

  return Response.json(runtimeContext);
}

export async function POST(request: Request) {
  const { rounds, frameRate, refreshRate }: RuntimeFormSchema =
    await request.json();
  const runtimeContext = await prisma.runtimeContext.create({
    data: {
      rounds,
      frameRate,
      refreshRate,
    },
  });
  return Response.json(runtimeContext);
}
