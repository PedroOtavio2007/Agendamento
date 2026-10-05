-- CreateEnum
CREATE TYPE "PasswordResetOwner" AS ENUM ('USER', 'BARBER');

-- DropIndex
DROP INDEX "PasswordResetToken_email_idx";

-- AlterTable
ALTER TABLE "PasswordResetToken" ADD COLUMN     "owner" "PasswordResetOwner" NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE INDEX "PasswordResetToken_email_owner_idx" ON "PasswordResetToken"("email", "owner");
