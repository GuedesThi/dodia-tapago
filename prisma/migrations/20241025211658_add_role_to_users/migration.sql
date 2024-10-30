-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MEMBER');

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'MEMBER';
