/*
  Warnings:

  - Added the required column `name` to the `ArticleFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `ArticleFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ArticleFile" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "path" TEXT NOT NULL;
