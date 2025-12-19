-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NodesFormContext" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "addedToSimulation" TEXT,
    "numberOfNodes" INTEGER NOT NULL,
    "size" INTEGER NOT NULL DEFAULT 5,
    "color" TEXT NOT NULL DEFAULT '',
    "draggable" BOOLEAN NOT NULL DEFAULT true,
    "node" TEXT NOT NULL,
    "nodeParameters" JSONB NOT NULL,
    "usedPacket" TEXT NOT NULL,
    "usedPacketParameters" JSONB NOT NULL,
    "mobilityModel" TEXT NOT NULL,
    "mobilityModelParameters" JSONB NOT NULL,
    "connectivityModel" TEXT NOT NULL,
    "connectivityModelParameters" JSONB NOT NULL,
    "interferenceModel" TEXT NOT NULL,
    "interferenceModelParameters" JSONB NOT NULL,
    "reliabilityModel" TEXT NOT NULL,
    "reliabilityModelParameters" JSONB NOT NULL,
    "distributionModel" TEXT NOT NULL,
    "distributionModelParameters" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_NodesFormContext" ("addedToSimulation", "connectivityModel", "connectivityModelParameters", "createdAt", "distributionModel", "distributionModelParameters", "id", "interferenceModel", "interferenceModelParameters", "mobilityModel", "mobilityModelParameters", "node", "nodeParameters", "numberOfNodes", "reliabilityModel", "reliabilityModelParameters", "updatedAt", "usedPacket", "usedPacketParameters") SELECT "addedToSimulation", "connectivityModel", "connectivityModelParameters", "createdAt", "distributionModel", "distributionModelParameters", "id", "interferenceModel", "interferenceModelParameters", "mobilityModel", "mobilityModelParameters", "node", "nodeParameters", "numberOfNodes", "reliabilityModel", "reliabilityModelParameters", "updatedAt", "usedPacket", "usedPacketParameters" FROM "NodesFormContext";
DROP TABLE "NodesFormContext";
ALTER TABLE "new_NodesFormContext" RENAME TO "NodesFormContext";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
