/*
  Warnings:

  - Added the required column `baseHealth` to the `Species` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseMood` to the `Species` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Species" ADD COLUMN     "baseHealth" INTEGER NOT NULL,
ADD COLUMN     "baseMood" INTEGER NOT NULL;
