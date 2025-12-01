"use client";
import ControlBar from "@/next/components/ControlBar";

export default function DashboardControls() {
  return (
    <>
      <div className="flex gap-2 flex-col w-full justify-center min-h-dvh max-h-dvh px-4">
        <ControlBar />
      </div>
    </>
  );
}
