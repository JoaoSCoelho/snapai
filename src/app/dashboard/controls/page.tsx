"use client";
import AddNodesFormDialog from "@/next/components/AddNodesFormDialog";
import ControlBar from "@/next/components/ControlBar";
import { ControlsAndGraph } from "@/next/components/ControlsAndGraph";
import { useAddNodesContext } from "@/next/contexts/AddNodesContext";
import { useConfigContext } from "@/next/contexts/ConfigContext";
import { Divider } from "@mui/material";
import Link from "next/link";

export default function DashboardControls() {
  const { dialogOpen: addNodesDialogOpen, closeDialog: closeAddNodesDialog } =
    useAddNodesContext();
  const { selectedProject } = useConfigContext();

  if (!selectedProject) {
    return (
      <div className="w-full">
        <div style={{ height: "40dvh" }} className="y-spacer"></div>
        <main className="mx-auto max-w-5xl flex flex-col items-center justify-center px-4 ">
          <div className="text-9xl mb-10 -mt-32">⚠️</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-8 text-center">
            Go to{" "}
            <Link
              href="/dashboard/configuration/simulation"
              className="text-blue-600 underline"
            >
              Simulation configurations
            </Link>{" "}
            page to select a project
          </h1>
        </main>
      </div>
    );
  }
  return (
    <>
      <div className="flex gap-2 flex-col w-full justify-center min-h-dvh max-h-dvh px-4">
        <ControlBar />
        <Divider variant="middle" />
        <ControlsAndGraph />
      </div>
      <AddNodesFormDialog
        onClose={closeAddNodesDialog}
        onSubmit={closeAddNodesDialog}
        open={addNodesDialogOpen}
      />
    </>
  );
}
