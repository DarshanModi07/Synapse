-- AlterTable
ALTER TABLE "SubTask" ADD COLUMN     "assignedToId" TEXT;

-- CreateIndex
CREATE INDEX "SubTask_assignedToId_idx" ON "SubTask"("assignedToId");

-- AddForeignKey
ALTER TABLE "SubTask" ADD CONSTRAINT "SubTask_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
