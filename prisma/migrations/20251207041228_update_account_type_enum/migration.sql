/*
  Warnings:

  - The values [BUSINESS] on the enum `AccountType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AccountType_new" AS ENUM ('INDIVIDUAL', 'ORGANIZATION');
ALTER TABLE "public"."user" ALTER COLUMN "accountType" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "accountType" TYPE "AccountType_new" USING ("accountType"::text::"AccountType_new");
ALTER TYPE "AccountType" RENAME TO "AccountType_old";
ALTER TYPE "AccountType_new" RENAME TO "AccountType";
DROP TYPE "public"."AccountType_old";
ALTER TABLE "user" ALTER COLUMN "accountType" SET DEFAULT 'INDIVIDUAL';
COMMIT;
