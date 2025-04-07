/*
  Warnings:

  - You are about to drop the `Album` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AlbumCredit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Track` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrackCredit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AlbumCredit" DROP CONSTRAINT "AlbumCredit_album_id_fkey";

-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_album_id_fkey";

-- DropForeignKey
ALTER TABLE "TrackCredit" DROP CONSTRAINT "TrackCredit_track_id_fkey";

-- DropTable
DROP TABLE "Album";

-- DropTable
DROP TABLE "AlbumCredit";

-- DropTable
DROP TABLE "Member";

-- DropTable
DROP TABLE "Track";

-- DropTable
DROP TABLE "TrackCredit";
