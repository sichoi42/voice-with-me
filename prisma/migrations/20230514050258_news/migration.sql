-- CreateTable
CREATE TABLE "News" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "url" TEXT,
    "publisher" TEXT,
    "publishedAt" TIMESTAMP(3),
    "writer" TEXT,
    "category" TEXT NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);
