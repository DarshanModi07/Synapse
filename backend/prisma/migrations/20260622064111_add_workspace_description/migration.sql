/*
  Warnings:

  - Added the required column `description` to the `workspaces` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "workspaces" ADD COLUMN     "description" TEXT NOT NULL;
