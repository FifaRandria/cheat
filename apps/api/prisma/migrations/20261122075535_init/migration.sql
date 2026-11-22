-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "passwordHash" TEXT,
    "githubId" TEXT,
    "avatarUrl" TEXT,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "bestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActiveOn" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "notions" TEXT[],
    "phase" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Level" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "runtime" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "xp" INTEGER NOT NULL,
    "blackout" BOOLEAN NOT NULL DEFAULT false,
    "hintCost" INTEGER NOT NULL DEFAULT 0,
    "hintsCount" INTEGER NOT NULL DEFAULT 0,
    "bugType" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,
    "files" JSONB NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "testsPassed" INTEGER NOT NULL,
    "testsTotal" INTEGER NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "hintsUsed" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progress" (
    "userId" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in-progress',
    "hintsUsed" INTEGER NOT NULL DEFAULT 0,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "lastCode" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "solvedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("userId","levelId")
);

-- CreateTable
CREATE TABLE "Badge" (
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "UserBadge" (
    "userId" TEXT NOT NULL,
    "badgeSlug" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("userId","badgeSlug")
);

-- CreateTable
CREATE TABLE "BugMuseumEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,
    "bugType" TEXT NOT NULL,
    "occurrences" INTEGER NOT NULL DEFAULT 1,
    "box" INTEGER NOT NULL DEFAULT 0,
    "nextReviewAt" TIMESTAMP(3) NOT NULL,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BugMuseumEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_githubId_key" ON "User"("githubId");

-- CreateIndex
CREATE INDEX "Level_moduleId_order_idx" ON "Level"("moduleId", "order");

-- CreateIndex
CREATE INDEX "Attempt_userId_levelId_idx" ON "Attempt"("userId", "levelId");

-- CreateIndex
CREATE INDEX "Attempt_userId_createdAt_idx" ON "Attempt"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "BugMuseumEntry_userId_nextReviewAt_idx" ON "BugMuseumEntry"("userId", "nextReviewAt");

-- CreateIndex
CREATE UNIQUE INDEX "BugMuseumEntry_userId_levelId_key" ON "BugMuseumEntry"("userId", "levelId");

-- AddForeignKey
ALTER TABLE "Level" ADD CONSTRAINT "Level_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_badgeSlug_fkey" FOREIGN KEY ("badgeSlug") REFERENCES "Badge"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BugMuseumEntry" ADD CONSTRAINT "BugMuseumEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BugMuseumEntry" ADD CONSTRAINT "BugMuseumEntry_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
