import { prisma } from "@/prisma/client";

export async function GET(request: Request) {
  return Response.json(await prisma.simulationLog.findMany());
}
