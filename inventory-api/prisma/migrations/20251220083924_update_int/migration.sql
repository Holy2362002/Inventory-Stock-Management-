/*
  Warnings:

  - You are about to alter the column `RetailPrice` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `WholesalePrice` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "RetailPrice" INTEGER NOT NULL,
    "WholesalePrice" INTEGER NOT NULL,
    "Stock" INTEGER NOT NULL,
    "PreOrder" INTEGER NOT NULL DEFAULT 0,
    "Category" TEXT NOT NULL,
    "CreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserId" INTEGER NOT NULL,
    CONSTRAINT "Product_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("Category", "CreatedAt", "PreOrder", "RetailPrice", "Stock", "UpdatedAt", "UserId", "WholesalePrice", "id", "name") SELECT "Category", "CreatedAt", "PreOrder", "RetailPrice", "Stock", "UpdatedAt", "UserId", "WholesalePrice", "id", "name" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
