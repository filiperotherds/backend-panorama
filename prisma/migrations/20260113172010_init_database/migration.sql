/*
  Warnings:

  - You are about to drop the column `organization_id` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `user_profile_id` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `pro_profile_id` on the `estimate` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `invite` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `organization` table. All the data in the column will be lost.
  - You are about to drop the column `client_profile_id` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `pro_profile_id` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `service_id` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `user_profile_id` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `accountType` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `_ProviderProfileToService` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `client_profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pro_profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_profile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[project_id]` on the table `address` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[project_id]` on the table `estimate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `project_id` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `estimate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ProviderProfileToService" DROP CONSTRAINT "_ProviderProfileToService_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProviderProfileToService" DROP CONSTRAINT "_ProviderProfileToService_B_fkey";

-- DropForeignKey
ALTER TABLE "address" DROP CONSTRAINT "address_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "address" DROP CONSTRAINT "address_user_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "client_profile" DROP CONSTRAINT "client_profile_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "estimate" DROP CONSTRAINT "estimate_pro_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "pro_profile" DROP CONSTRAINT "pro_profile_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "project" DROP CONSTRAINT "project_client_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "project" DROP CONSTRAINT "project_pro_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "project" DROP CONSTRAINT "project_service_id_fkey";

-- DropForeignKey
ALTER TABLE "project" DROP CONSTRAINT "project_user_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "user_profile" DROP CONSTRAINT "user_profile_user_id_fkey";

-- AlterTable
ALTER TABLE "address" DROP COLUMN "organization_id",
DROP COLUMN "user_profile_id",
ADD COLUMN     "project_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "estimate" DROP COLUMN "pro_profile_id",
ADD COLUMN     "organization_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "invite" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "organization" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "project" DROP COLUMN "client_profile_id",
DROP COLUMN "pro_profile_id",
DROP COLUMN "service_id",
DROP COLUMN "status",
DROP COLUMN "user_profile_id",
ADD COLUMN     "concluded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "organization_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "accountType";

-- DropTable
DROP TABLE "_ProviderProfileToService";

-- DropTable
DROP TABLE "client_profile";

-- DropTable
DROP TABLE "pro_profile";

-- DropTable
DROP TABLE "service";

-- DropTable
DROP TABLE "user_profile";

-- DropEnum
DROP TYPE "AccountType";

-- DropEnum
DROP TYPE "OrgType";

-- DropEnum
DROP TYPE "ProjectStatus";

-- CreateTable
CREATE TABLE "clockin_register" (
    "id" TEXT NOT NULL,
    "clock_in" TIMESTAMP(3) NOT NULL,
    "clock_out" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "member_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "clockin_register_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "address_project_id_key" ON "address"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "estimate_project_id_key" ON "estimate"("project_id");

-- AddForeignKey
ALTER TABLE "clockin_register" ADD CONSTRAINT "clockin_register_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clockin_register" ADD CONSTRAINT "clockin_register_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clockin_register" ADD CONSTRAINT "clockin_register_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estimate" ADD CONSTRAINT "estimate_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
