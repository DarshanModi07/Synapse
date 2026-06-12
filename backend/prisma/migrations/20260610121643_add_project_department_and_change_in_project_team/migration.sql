/*
  Warnings:

  - You are about to drop the column `projectId` on the `ProjectTeam` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectDepartmentId,teamId]` on the table `ProjectTeam` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ProjectTeam" DROP CONSTRAINT "ProjectTeam_projectId_fkey";

-- DropIndex
DROP INDEX "ProjectTeam_projectId_idx";

-- DropIndex
DROP INDEX "ProjectTeam_projectId_teamId_key";

-- AlterTable
ALTER TABLE "ProjectTeam" DROP COLUMN "projectId",
ADD COLUMN     "assignedById" TEXT,
ADD COLUMN     "projectDepartmentId" TEXT;

-- CreateTable
CREATE TABLE "ProjectDepartment" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectDepartment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectDepartment_projectId_idx" ON "ProjectDepartment"("projectId");

-- CreateIndex
CREATE INDEX "ProjectDepartment_departmentId_idx" ON "ProjectDepartment"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectDepartment_projectId_departmentId_key" ON "ProjectDepartment"("projectId", "departmentId");

-- CreateIndex
CREATE INDEX "ProjectTeam_projectDepartmentId_idx" ON "ProjectTeam"("projectDepartmentId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTeam_projectDepartmentId_teamId_key" ON "ProjectTeam"("projectDepartmentId", "teamId");

-- AddForeignKey
ALTER TABLE "ProjectTeam" ADD CONSTRAINT "ProjectTeam_projectDepartmentId_fkey" FOREIGN KEY ("projectDepartmentId") REFERENCES "ProjectDepartment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTeam" ADD CONSTRAINT "ProjectTeam_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectDepartment" ADD CONSTRAINT "ProjectDepartment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectDepartment" ADD CONSTRAINT "ProjectDepartment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
