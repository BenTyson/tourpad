-- AlterTable
ALTER TABLE "artists" ADD COLUMN     "tourMonthsPerYear" INTEGER,
ADD COLUMN     "tourVehicle" TEXT,
ADD COLUMN     "venueRequirements" TEXT[],
ADD COLUMN     "willingToTravel" INTEGER;

-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN     "profileImageUrl" TEXT;
