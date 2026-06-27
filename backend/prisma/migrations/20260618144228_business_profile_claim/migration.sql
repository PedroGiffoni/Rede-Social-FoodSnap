-- DropForeignKey
ALTER TABLE "business_profiles" DROP CONSTRAINT "business_profiles_userId_fkey";

-- AlterTable
ALTER TABLE "business_profiles" ADD COLUMN     "claimedByUserId" TEXT,
ADD COLUMN     "isClaimed" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "business_profiles" ADD CONSTRAINT "business_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
