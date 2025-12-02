-- CreateTable
CREATE TABLE "NodesFormContext" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "addedToSimulation" TEXT,
    "numberOfNodes" INTEGER NOT NULL,
    "node" TEXT NOT NULL,
    "nodeParameters" JSONB NOT NULL,
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
