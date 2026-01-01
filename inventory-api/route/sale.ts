/// <reference path="../types/express.d.ts" />
import express from "express";
const router = express.Router();
import { prisma } from "../libs/prisma";
import { auth } from "../middleware/auth";

router.post("/", auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const { productId, quantity, priceType } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        msg: "productId and quantity are required",
      });
    }

    const product = await prisma.product.findFirst({
      where: {
        id: Number(productId),
        UserId: req.user.id,
      },
    });

    if (!product) {
      return res.status(404).json({
        msg: "Product not found or you don't have permission to access it",
      });
    }

    const saleQuantity = parseInt(quantity);

    if (isNaN(saleQuantity) || saleQuantity <= 0) {
      return res.status(400).json({
        msg: "Quantity must be a valid positive number",
      });
    }

    if (product.Stock < saleQuantity) {
      return res.status(400).json({
        msg: "Insufficient stock",
      });
    }

    const totalPrice =
      priceType === "WholesalePrice"
        ? saleQuantity * product.WholesalePrice
        : saleQuantity * product.RetailPrice;

    const sale = await prisma.sale.create({
      data: {
        quantity: saleQuantity,
        totalPrice,
        priceType: priceType === "WholesalePrice" ? "Wholesale" : "Retail",
        ProductId: Number(productId),
      },
      include: {
        Product: true,
      },
    });

    await prisma.product.update({
      where: { id: Number(productId) },
      data: {
        Stock: product.Stock - saleQuantity,
        UpdatedAt: new Date(),
      },
    });

    res.status(201).json({ sale });
  } catch (error: any) {
    console.error("Error creating sale:", error);
    res.status(500).json({
      msg: "Failed to create sale",
      error: error.message,
    });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const sales = await prisma.sale.findMany({
      where: {
        Product: {
          UserId: req.user.id,
        },
      },
      include: {
        Product: true,
      },
      orderBy: {
        saleDate: "desc",
      },
    });

    res.status(200).json({ sales });
  } catch (error: any) {
    console.error("Error fetching sales:", error);
    res.status(500).json({
      msg: "Failed to fetch sales",
      error: error.message,
    });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const saleId = Number(req.params.id);

    const sale = await prisma.sale.findFirst({
      where: {
        id: saleId,
        Product: {
          UserId: req.user.id,
        },
      },
      include: {
        Product: true,
      },
    });

    if (!sale) {
      return res.status(404).json({
        msg: "Sale not found or you don't have permission to access it",
      });
    }

    res.status(200).json({ sale });
  } catch (error: any) {
    console.error("Error fetching sale:", error);
    res.status(500).json({
      msg: "Failed to fetch sale",
      error: error.message,
    });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const saleId = Number(req.params.id);

    const sale = await prisma.sale.delete({
      where: {
        id: saleId,
      },
    });

    res.status(200).json({ msg: "Sale deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting sale:", error);
    res.status(500).json({
      msg: "Failed to delete sale",
      error: error.message,
    });
  }
});

router.delete("/", auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const deletedSales = await prisma.sale.deleteMany({
      where: {
        Product: {
          UserId: req.user.id,
        },
      },
    });

    res
      .status(200)
      .json({ msg: "All sales deleted successfully", deletedSales });
  } catch (error: any) {
    console.error("Error deleting all sales:", error);
    res.status(500).json({
      msg: "Failed to delete all sales",
      error: error.message,
    });
  }
});

export { router as saleRouter };
