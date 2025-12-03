"use client";
import AddNodesFormDialog from "@/next/components/AddNodesFormDialog";
import ControlBar from "@/next/components/ControlBar";
import { useAddNodesContext } from "@/next/contexts/AddNodesContext";

export default function DashboardControls() {
  const { dialogOpen: addNodesDialogOpen, closeDialog: closeAddNodesDialog } =
    useAddNodesContext();

  return (
    <>
      <div className="flex gap-2 flex-col w-full justify-center min-h-dvh max-h-dvh px-4">
        <ControlBar />
      </div>
      <AddNodesFormDialog
        onClose={closeAddNodesDialog}
        onSubmit={closeAddNodesDialog}
        open={addNodesDialogOpen}
      />
    </>
  );
}
