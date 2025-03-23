-- CreateTable
CREATE TABLE "long_weekends" (
    "id" TEXT NOT NULL,
    "holidayId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalDaysOff" INTEGER NOT NULL,
    "paidLeavesUsed" INTEGER NOT NULL,
    "unpaidLeavesUsed" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "long_weekends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suggested_leaves" (
    "id" TEXT NOT NULL,
    "longWeekendId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "day" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "suggested_leaves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "total_days" (
    "id" TEXT NOT NULL,
    "longWeekendId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "day" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "total_days_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "long_weekends" ADD CONSTRAINT "long_weekends_holidayId_fkey" FOREIGN KEY ("holidayId") REFERENCES "Holiday"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "long_weekends" ADD CONSTRAINT "long_weekends_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggested_leaves" ADD CONSTRAINT "suggested_leaves_longWeekendId_fkey" FOREIGN KEY ("longWeekendId") REFERENCES "long_weekends"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "total_days" ADD CONSTRAINT "total_days_longWeekendId_fkey" FOREIGN KEY ("longWeekendId") REFERENCES "long_weekends"("id") ON DELETE CASCADE ON UPDATE CASCADE;
