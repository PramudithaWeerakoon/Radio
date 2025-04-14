-- AlterTable for the Track model to add the music player related fields
ALTER TABLE "Track" ADD COLUMN IF NOT EXISTS "audioData" BYTEA;
ALTER TABLE "Track" ADD COLUMN IF NOT EXISTS "audioFileName" TEXT;
ALTER TABLE "Track" ADD COLUMN IF NOT EXISTS "audioMimeType" TEXT;
ALTER TABLE "Track" ADD COLUMN IF NOT EXISTS "artist" TEXT;
ALTER TABLE "Track" ADD COLUMN IF NOT EXISTS "isInPlayer" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Track" ADD COLUMN IF NOT EXISTS "addedToPlayer" TIMESTAMP(3);
