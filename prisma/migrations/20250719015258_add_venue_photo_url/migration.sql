-- AlterTable
ALTER TABLE "artists" ADD COLUMN     "needsLodging" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "hosts" ADD COLUMN     "venueDescription" TEXT,
ADD COLUMN     "venuePhotoUrl" TEXT;
