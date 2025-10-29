"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    if (!window.electron) {
      console.warn("⚠️ Electron não disponível — talvez modo dev fora do app?");
      return;
    }

    const off = window.electron.on("ping", (msg) => {
      console.log("Mensagem recebida do main:", msg);
      window.electron!.send("pong", { hello: "from Next.js" });
    });

    return off;
  }, []);

  return (
    <main style={{ padding: 32 }}>
      <h1>Hello from Next.js + Electron ⚡</h1>
    </main>
  );
}
