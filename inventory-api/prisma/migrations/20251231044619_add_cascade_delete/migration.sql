-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sale" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quantity" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "priceType" TEXT NOT NULL DEFAULT 'Retail',
    "saleDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ProductId" INTEGER NOT NULL,
    CONSTRAINT "Sale_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Sale" ("ProductId", "id", "priceType", "quantity", "saleDate", "totalPrice") SELECT "ProductId", "id", "priceType", "quantity", "saleDate", "totalPrice" FROM "Sale";
DROP TABLE "Sale";
ALTER TABLE "new_Sale" RENAME TO "Sale";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
