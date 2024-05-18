/*
  Warnings:

  - You are about to drop the `ArticleFile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ArticleFile" DROP CONSTRAINT "ArticleFile_articleId_fkey";

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "reference" TEXT[];

-- DropTable
DROP TABLE "ArticleFile";
