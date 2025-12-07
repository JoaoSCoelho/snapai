-- CreateTable
CREATE TABLE "RunContext" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rounds" INTEGER NOT NULL,
    "refreshRate" INTEGER,
    "frameRate" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
