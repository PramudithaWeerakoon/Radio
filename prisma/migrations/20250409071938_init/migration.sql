-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "addedToPlayer" TIMESTAMP(3),
ADD COLUMN     "artist" TEXT,
ADD COLUMN     "audioData" BYTEA,
ADD COLUMN     "audioFileName" TEXT,
ADD COLUMN     "audioMimeType" TEXT,
ADD COLUMN     "isInPlayer" BOOLEAN NOT NULL DEFAULT false;
