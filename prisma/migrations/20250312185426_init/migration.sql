-- AlterTable
ALTER TABLE "users" ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "customerId" TEXT,
ADD COLUMN     "isActive" BOOLEAN DEFAULT false,
ADD COLUMN     "lastActive" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "paidLeaves" INTEGER DEFAULT 0,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "role" TEXT DEFAULT 'user',
ADD COLUMN     "salary" INTEGER DEFAULT 0,
ADD COLUMN     "unpaidLeaves" INTEGER DEFAULT 0;
