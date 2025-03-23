-- CreateTable
CREATE TABLE "user_activity_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_activity_logs_user_id_createdAt_idx" ON "user_activity_logs"("user_id", "createdAt");

-- AddForeignKey
ALTER TABLE "user_activity_logs" ADD CONSTRAINT "user_activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
