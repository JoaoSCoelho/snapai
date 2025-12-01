/*
  Warnings:

  - You are about to alter the column `simulationId` on the `SimulationLog` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SimulationLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "simulationId" INTEGER NOT NULL,
    "project" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SimulationLog" ("content", "createdAt", "id", "project", "simulationId", "updatedAt") SELECT "content", "createdAt", "id", "project", "simulationId", "updatedAt" FROM "SimulationLog";
DROP TABLE "SimulationLog";
ALTER TABLE "new_SimulationLog" RENAME TO "SimulationLog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
