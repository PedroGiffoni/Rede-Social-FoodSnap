/*
  Warnings:

  - You are about to drop the column `mediaType` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `mediaUrl` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_businessProfileId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_postId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_userId_fkey";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "mediaType",
DROP COLUMN "mediaUrl",
ADD COLUMN     "averageRating" DECIMAL(2,1),
ADD COLUMN     "flavorRating" DECIMAL(2,1),
ADD COLUMN     "presentationRating" DECIMAL(2,1),
ADD COLUMN     "priceRating" DECIMAL(2,1),
ADD COLUMN     "recommendationRating" DECIMAL(2,1);

-- DropTable
DROP TABLE "reviews";

-- CreateTable
CREATE TABLE "post_medias" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "mediaType" "MediaType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_medias_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "post_medias" ADD CONSTRAINT "post_medias_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
