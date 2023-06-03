-- CreateTable
CREATE TABLE "news" (
    "id" SERIAL NOT NULL,
    "nid" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "url" TEXT,
    "publisher" TEXT,
    "published_at" TIMESTAMP(3),
    "writer" TEXT,
    "category" TEXT NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "news_nid_key" ON "news"("nid");
