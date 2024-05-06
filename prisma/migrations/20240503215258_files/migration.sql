-- CreateTable
CREATE TABLE "ArticleFile" (
    "id" SERIAL NOT NULL,
    "articleId" INTEGER,

    CONSTRAINT "ArticleFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArticleFile" ADD CONSTRAINT "ArticleFile_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;
