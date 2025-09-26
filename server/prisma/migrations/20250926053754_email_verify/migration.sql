/*
  Warnings:

  - You are about to drop the column `userId` on the `VerificationCode` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `VerificationCode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `VerificationCode` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."VerificationCode" DROP CONSTRAINT "VerificationCode_userId_fkey";

-- AlterTable
ALTER TABLE "public"."VerificationCode" DROP COLUMN "userId",
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "VerificationCode_email_key" ON "public"."VerificationCode"("email");

-- CreateIndex
CREATE INDEX "VerificationCode_email_idx" ON "public"."VerificationCode"("email");

-- AddForeignKey
ALTER TABLE "public"."VerificationCode" ADD CONSTRAINT "VerificationCode_email_fkey" FOREIGN KEY ("email") REFERENCES "public"."User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
