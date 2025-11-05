import fs from "node:fs";

export async function POST(request: Request) {
  const { path, data } = await request.json();
  const file = JSON.stringify(data, null, 2);
  fs.writeFileSync(path, file, { encoding: "utf-8", flag: "w" });
  return new Response(null, { status: 200 });
}
