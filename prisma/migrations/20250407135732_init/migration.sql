-- CreateTable
CREATE TABLE "Album" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "release_date" TIMESTAMP(3),
    "cover_art" TEXT,
    "description" TEXT,
    "youtube_id" TEXT,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "duration" TEXT,
    "track_number" INTEGER NOT NULL,
    "lyrics" TEXT,
    "album_id" INTEGER NOT NULL,
    "youtube_id" TEXT,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlbumCredit" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "album_id" INTEGER NOT NULL,

    CONSTRAINT "AlbumCredit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackCredit" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "track_id" INTEGER NOT NULL,

    CONSTRAINT "TrackCredit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "profileImageUrl" TEXT,
    "bio" TEXT,
    "joinDate" TIMESTAMP(3) NOT NULL,
    "facebook" TEXT,
    "twitter" TEXT,
    "instagram" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "venue" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumCredit" ADD CONSTRAINT "AlbumCredit_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackCredit" ADD CONSTRAINT "TrackCredit_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
