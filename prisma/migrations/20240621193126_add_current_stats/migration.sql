-- AlterTable
ALTER TABLE "NpcInstance" ADD COLUMN     "currentHealth" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "currentMood" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "currentHealth" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "currentMood" INTEGER NOT NULL DEFAULT 0;
