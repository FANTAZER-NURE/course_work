/*
  Warnings:

  - Added the required column `activationToken` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activationToken" TEXT NOT NULL;
