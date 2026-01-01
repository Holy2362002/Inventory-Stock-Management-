/// <reference path="../types/express.d.ts" />
import express from "express";
const router = express.Router();
import { prisma } from "../libs/prisma";
import { auth } from "../middleware/auth";
import { Category } from "../generated/prisma/enums";

router.get("/choice", auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const products = await prisma.product.findMany({
      where: {
        UserId: req.user.id,
      },
      orderBy: {
        CreatedAt: "desc",
      },
    });
    res.status(200).json({ products });
  } catch (error: any) {
    console.error("Error fetching user products:", error);
    res.status(500).json({
      msg: "Failed to fetch products",
      error: error.message,
    });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const productId = Number(req.params.id);
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        UserId: req.user.id,
      },
    });

    if (!product) {
      return res.status(404).json({
        msg: "Product not found or you don't have permission to access it",
      });
    }

    res.status(200).json({ product });
  } catch (error: any) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      msg: "Failed to fetch product",
      error: error.message,
    });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    const productData = req.body?.product || req.body;
    const {
      name,
      RetailPrice,
      WholesalePrice,
      Stock,
      Category: categoryValue,
      PreOrder,
    } = productData;

    // Validate required fields
    if (
      !name ||
      RetailPrice === undefined ||
      WholesalePrice === undefined ||
      Stock === undefined ||
      !categoryValue
    ) {
      return res.status(400).json({
        msg: "name, RetailPrice, WholesalePrice, Stock, and Category are required",
      });
    }

    // Validate Category enum
    if (
      categoryValue !== Category.grocery &&
      categoryValue !== Category.beauty
    ) {
      return res.status(400).json({
        msg: `Category must be either "${Category.grocery}" or "${Category.beauty}"`,
      });
    }

    // Validate numeric fields
    const retailPrice = parseInt(RetailPrice);
    const wholesalePrice = parseInt(WholesalePrice);
    const stock = parseInt(Stock);
    const preOrder = PreOrder ? parseInt(PreOrder) : 0;

    if (
      isNaN(retailPrice) ||
      isNaN(wholesalePrice) ||
      isNaN(stock) ||
      isNaN(preOrder)
    ) {
      return res.status(400).json({
        msg: "RetailPrice, WholesalePrice, Stock, and PreOrder must be valid numbers",
      });
    }

    if (retailPrice < 0 || wholesalePrice < 0 || stock < 0 || preOrder < 0) {
      return res.status(400).json({
        msg: "Prices, Stock, and PreOrder cannot be negative",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        RetailPrice: retailPrice,
        WholesalePrice: wholesalePrice,
        Stock: stock,
        Category: categoryValue,
        PreOrder: preOrder,
        UserId: req.user.id,
      },
    });

    res.status(201).json({ product });
  } catch (error: any) {
    console.error("Error creating product:", error);
    res.status(400).json({
      msg: "Failed to create product",
      error: error.message,
    });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    const productId = req.params.id;
    await prisma.product.deleteMany({
      where: {
        id: Number(productId),
        UserId: req.user.id,
      },
    });
    res.status(200).json({ msg: "Product deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      msg: "Failed to delete product",
      error: error.message,
    });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    const productId = Number(req.params?.id);

    // First verify the product belongs to the user
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        UserId: req.user.id,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        msg: "Product not found or you don't have permission to update it",
      });
    }

    const productData = req.body;

    if (productData.Stock !== undefined) {
      const newStock = parseInt(productData.Stock);
      if (isNaN(newStock) || newStock < 0) {
        return res.status(400).json({
          msg: "Stock must be a valid non-negative number",
        });
      }
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: productData,
    });

    res.status(200).json({ updatedProduct });
  } catch (error: any) {
    console.error("Error updating product:", error);
    res.status(500).json({
      msg: "Failed to update product",
      error: error.message,
    });
  }
});

export { router as productRouter };
