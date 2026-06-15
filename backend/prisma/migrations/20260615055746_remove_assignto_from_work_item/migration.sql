/*
  Warnings:

  - You are about to drop the column `assignedById` on the `WorkItem` table. All the data in the column will be lost.
  - You are about to drop the column `assignedToId` on the `WorkItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkItem" DROP CONSTRAINT "WorkItem_assignedById_fkey";

-- DropForeignKey
ALTER TABLE "WorkItem" DROP CONSTRAINT "WorkItem_assignedToId_fkey";

-- DropIndex
DROP INDEX "WorkItem_assignedById_idx";

-- DropIndex
DROP INDEX "WorkItem_assignedToId_idx";

-- AlterTable
ALTER TABLE "WorkItem" DROP COLUMN "assignedById",
DROP COLUMN "assignedToId";
