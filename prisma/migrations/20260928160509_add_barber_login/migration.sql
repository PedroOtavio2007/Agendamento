/*
  Warnings:

  - You are about to drop the column `userId` on the `Barber` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Barber` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Barber` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `Barber` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Barber" DROP CONSTRAINT "Barber_userId_fkey";

-- DropIndex
DROP INDEX "Barber_userId_key";

-- AlterTable
ALTER TABLE "Barber" DROP COLUMN "userId",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "passwordHash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Barber_email_key" ON "Barber"("email");
