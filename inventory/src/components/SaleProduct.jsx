import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  IconButton,
  Button,
  Chip,
  Divider,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { useApp } from "../AppProvider";
import { useQueryClient } from "@tanstack/react-query";

const api = "https://inventory-api-b0va.onrender.com";

export default function SaleProductCard() {
  const { cart, setCart, priceType } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const product = cart.find((item) => item.id === productId);
    if (product && newQuantity > product.Stock) return;

    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = priceType === "RetailPrice" ? item.RetailPrice : item.WholesalePrice;
      return total + price * item.quantity;
    }, 0);
  };

  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      // Process each product in the cart
      const updatePromises = cart.map(async (item) => {
        // Fetch current product to get latest stock
        const getRes = await fetch(`${api}/products/${item.id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!getRes.ok) {
          throw new Error(`Failed to fetch product ${item.name}`);
        }

        const productData = await getRes.json();
        const currentProduct = productData.product || productData.products || productData;

        if (!currentProduct) {
          throw new Error(`Product ${item.name} not found`);
        }

        // Calculate new stock
        const newStock = currentProduct.Stock - item.quantity;

        if (newStock < 0) {
          throw new Error(
            `Insufficient stock for ${item.name}. Available: ${currentProduct.Stock}, Requested: ${item.quantity}`
          );
        }

        // Update product stock
        const updateRes = await fetch(`${api}/products/${item.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Stock: newStock,
          }),
        });

        if (!updateRes.ok) {
          const errorData = await updateRes.json();
          throw new Error(
            `Failed to update ${item.name}: ${errorData.msg || errorData.error || "Unknown error"}`
          );
        }

        return { success: true, product: item.name };
      });

      // Wait for all updates to complete
      await Promise.all(updatePromises);

      // Refresh product list
      queryClient.invalidateQueries({ queryKey: ["products"] });

      // Show success message
      alert(
        `Sale completed successfully!\nTotal: MMK ${calculateTotal().toFixed(2)}\n\nProducts sold:\n${cart
          .map((item) => `- ${item.name} x${item.quantity}`)
          .join("\n")}`
      );

      // Clear cart
      setCart([]);
    } catch (error) {
      console.error("Error completing sale:", error);
      setError(error.message || "Failed to complete sale. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 3,
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        width: 360,
        maxHeight: "80vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={1}>
          <ShoppingBagOutlinedIcon />
          <Typography fontWeight={600}>Current Sale</Typography>
        </Box>
        <Chip label={priceType === "RetailPrice" ? "RETAIL" : "WHOLESALE"} size="small" />
      </Box>

      <Divider sx={{ my: 2 }} />

      {error && (
        <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          maxHeight: "50vh",
          mb: 2,
        }}
      >
        {cart.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              color: "text.secondary",
            }}
          >
            <Typography variant="body2">No products in cart</Typography>
            <Typography variant="caption">
              Click "Sale Product" to add items
            </Typography>
          </Box>
        ) : (
          cart.map((item) => {
            const price = priceType === "RetailPrice" ? item.RetailPrice : item.WholesalePrice;
            return (
              <Paper
                key={item.id}
                sx={{
                  p: 1.5,
                  mb: 1.5,
                  borderRadius: 2,
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box flex={1}>
                    <Typography fontWeight={600} fontSize={14}>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      MMK {price} / unit
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      display="flex"
                      alignItems="center"
                      bgcolor="#1379dfff"
                      borderRadius={2}
                    >
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>

                      <Typography px={1} fontSize={14}>
                        {item.quantity}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.Stock}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                  Subtotal: MMK {(price * item.quantity).toFixed(2)}
                </Typography>
              </Paper>
            );
          })
        )}
      </Box>

      {cart.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography color="text.secondary">Total Amount</Typography>
              <Typography fontWeight={700} fontSize={20}>
                MMK {calculateTotal().toFixed(2)}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={
                isProcessing ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <CreditCardIcon />
                )
              }
              onClick={handleCompleteSale}
              disabled={isProcessing}
              sx={{
                borderRadius: 3,
                py: 1.5,
                backgroundColor: "#5A4CF0",
                "&:hover": {
                  backgroundColor: "#4A3CE0",
                },
                "&:disabled": {
                  backgroundColor: "#9E9E9E",
                },
              }}
            >
              {isProcessing ? "Processing Sale..." : "Complete Sale"}
            </Button>
          </Box>
        </>
      )}
    </Card>
  );
}
