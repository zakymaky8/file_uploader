-- CreateTable
CREATE TABLE "Users" (
    "users_id" TEXT NOT NULL,
    "firstname" TEXT,
    "lastname" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("users_id")
);

-- CreateTable
CREATE TABLE "Folder" (
    "folders_id" TEXT NOT NULL,
    "folder_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("folders_id")
);

-- CreateTable
CREATE TABLE "File" (
    "files_id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploadTime" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("files_id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FileToFolder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_folder_name_key" ON "Folder"("folder_name");

-- CreateIndex
CREATE UNIQUE INDEX "File_filename_key" ON "File"("filename");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sid_key" ON "Session"("sid");

-- CreateIndex
CREATE UNIQUE INDEX "_FileToFolder_AB_unique" ON "_FileToFolder"("A", "B");

-- CreateIndex
CREATE INDEX "_FileToFolder_B_index" ON "_FileToFolder"("B");

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("users_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Folder"("folders_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("users_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileToFolder" ADD CONSTRAINT "_FileToFolder_A_fkey" FOREIGN KEY ("A") REFERENCES "File"("files_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileToFolder" ADD CONSTRAINT "_FileToFolder_B_fkey" FOREIGN KEY ("B") REFERENCES "Folder"("folders_id") ON DELETE CASCADE ON UPDATE CASCADE;
