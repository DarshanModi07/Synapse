/*
  Warnings:

  - The values [mention,file_shared,role_change,invited_to_workspace,invited_to_team,ai_done,message_reaction] on the enum `notificationType` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `work_role` on table `WorkspaceInvite` required. This step will fail if there are existing NULL values in that column.
  - Made the column `work_role` on table `WorkspaceMember` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "notificationType_new" AS ENUM ('task_assigned', 'subtask_assigned', 'subtask_completed', 'workitem_assigned', 'workitem_in_review', 'workitem_approved', 'workitem_rejected', 'project_completed');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "notificationType_new" USING ("type"::text::"notificationType_new");
ALTER TYPE "notificationType" RENAME TO "notificationType_old";
ALTER TYPE "notificationType_new" RENAME TO "notificationType";
DROP TYPE "public"."notificationType_old";
COMMIT;

-- AlterTable
ALTER TABLE "WorkspaceInvite" ALTER COLUMN "work_role" SET NOT NULL;

-- AlterTable
ALTER TABLE "WorkspaceMember" ALTER COLUMN "work_role" SET NOT NULL;
