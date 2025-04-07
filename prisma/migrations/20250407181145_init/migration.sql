/*
  Warnings:

  - You are about to drop the column `profileImageUrl` on the `Member` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Member" DROP COLUMN "profileImageUrl",
ADD COLUMN     "imageData" BYTEA,
ADD COLUMN     "imageMimeType" TEXT,
ADD COLUMN     "imageName" TEXT;
