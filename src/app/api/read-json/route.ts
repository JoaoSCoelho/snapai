import fs from "node:fs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const path = searchParams.get("path");
  if (!path || !path.endsWith(".json"))
    return new Response("Invalid path, must be .json", { status: 400 });

  const file = fs.readFileSync(path, { encoding: "utf-8", flag: "r" });
  return new Response(file, {
    headers: { "Content-Type": "application/json" },
  });
}
