/*
  Warnings:

  - You are about to drop the column `instagram` on the `business_profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "business_profiles" DROP COLUMN "instagram",
ADD COLUMN     "website" TEXT;
