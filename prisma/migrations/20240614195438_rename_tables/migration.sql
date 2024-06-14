/*
  Warnings:

  - You are about to drop the `NPCInstance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NPCTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PVEBattle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "NPCInstance" DROP CONSTRAINT "NPCInstance_battleId_fkey";

-- DropForeignKey
ALTER TABLE "NPCInstance" DROP CONSTRAINT "NPCInstance_templateId_fkey";

-- DropForeignKey
ALTER TABLE "NPCTemplate" DROP CONSTRAINT "NPCTemplate_colorId_fkey";

-- DropForeignKey
ALTER TABLE "NPCTemplate" DROP CONSTRAINT "NPCTemplate_speciesId_fkey";

-- DropForeignKey
ALTER TABLE "PVEBattle" DROP CONSTRAINT "PVEBattle_userId_fkey";

-- DropTable
DROP TABLE "NPCInstance";

-- DropTable
DROP TABLE "NPCTemplate";

-- DropTable
DROP TABLE "PVEBattle";

-- CreateTable
CREATE TABLE "NpcTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "speciesId" INTEGER NOT NULL,
    "colorId" INTEGER NOT NULL,
    "health" INTEGER NOT NULL,
    "mood" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NpcTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NpcInstance" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "templateId" INTEGER NOT NULL,
    "health" INTEGER NOT NULL,
    "mood" INTEGER NOT NULL,
    "battleId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NpcInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PveBattle" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PveBattle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NpcTemplate_name_key" ON "NpcTemplate"("name");

-- AddForeignKey
ALTER TABLE "NpcTemplate" ADD CONSTRAINT "NpcTemplate_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NpcTemplate" ADD CONSTRAINT "NpcTemplate_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NpcInstance" ADD CONSTRAINT "NpcInstance_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "NpcTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NpcInstance" ADD CONSTRAINT "NpcInstance_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "PveBattle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PveBattle" ADD CONSTRAINT "PveBattle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
