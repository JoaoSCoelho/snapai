import { redirect } from "next/navigation";

export default function DashboardConfiguration() {
  redirect("/dashboard/configuration/simulation");
  return (
    <main className="flex flex-col w-full items-center justify-center min-h-screen px-4 col-start-3 col-end-13 text-xl">
      <h1>Redirecting you to the simulation configuration...</h1>
    </main>
  );
}
