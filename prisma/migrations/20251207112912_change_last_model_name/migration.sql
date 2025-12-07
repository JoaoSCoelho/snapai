/*
  Warnings:

  - You are about to drop the `RunContext` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "RunContext";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "RuntimeContext" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rounds" INTEGER NOT NULL,
    "refreshRate" INTEGER,
    "frameRate" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
