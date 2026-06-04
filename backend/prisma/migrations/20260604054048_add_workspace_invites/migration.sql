-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('pending', 'accepted', 'expired', 'rejected');

-- CreateTable
CREATE TABLE "WorkspaceInvite" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sys_role" "SysRole" NOT NULL,
    "work_role" TEXT,
    "token" TEXT NOT NULL,
    "invitedBy" TEXT NOT NULL,
    "status" "InviteStatus" NOT NULL DEFAULT 'pending',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkspaceInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceInvite_token_key" ON "WorkspaceInvite"("token");

-- CreateIndex
CREATE INDEX "WorkspaceInvite_email_idx" ON "WorkspaceInvite"("email");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceInvite_workspaceId_email_key" ON "WorkspaceInvite"("workspaceId", "email");

-- AddForeignKey
ALTER TABLE "WorkspaceInvite" ADD CONSTRAINT "WorkspaceInvite_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceInvite" ADD CONSTRAINT "WorkspaceInvite_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
