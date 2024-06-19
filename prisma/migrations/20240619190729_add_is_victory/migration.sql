-- AlterTable
ALTER TABLE "PveBattle" ADD COLUMN     "isVictory" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "isActive" SET DEFAULT true;
