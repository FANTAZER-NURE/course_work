/*
  Warnings:

  - Added the required column `legalAdress` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `legalNumber` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippindAdress` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `managerId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderPrice` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingAddress` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "legalAdress" TEXT NOT NULL,
ADD COLUMN     "legalNumber" TEXT NOT NULL,
ADD COLUMN     "shippindAdress" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "managerId" INTEGER NOT NULL,
ADD COLUMN     "orderPrice" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "shippingAddress" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Manager" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
