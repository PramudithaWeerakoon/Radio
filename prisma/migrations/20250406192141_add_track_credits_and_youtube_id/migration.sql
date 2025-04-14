-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "youtube_id" TEXT;

-- CreateTable
CREATE TABLE "TrackCredit" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "track_id" INTEGER NOT NULL,

    CONSTRAINT "TrackCredit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TrackCredit" ADD CONSTRAINT "TrackCredit_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
