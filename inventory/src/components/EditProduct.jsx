import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Button,
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

const api = "http://localhost:8800";

export default function EditProduct({ open, onClose, product }) {
  const [category, setCategory] = useState("grocery");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    if (product) {
      setValue("name", product.name);
      setValue("RetailPrice", product.RetailPrice);
      setValue("WholesalePrice", product.WholesalePrice);
      setValue("Stock", product.Stock);
      setValue("PreOrder", product.PreOrder || 0);
      setCategory(product.Category);
    }
  }, [product, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      const productData = {
        name: data.name,
        RetailPrice: parseInt(data.RetailPrice),
        WholesalePrice: parseInt(data.WholesalePrice),
        Stock: parseInt(data.Stock),
        Category: category,
        PreOrder: data.PreOrder ? parseInt(data.PreOrder) : 0,
      };

      const res = await fetch(`${api}/products/${product.id}`, {
        method: "PUT",
        body: JSON.stringify(productData),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (!res.ok) {
        setErrorMessage(result.msg || "Failed to update product");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["products"] });
      onClose();
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
      console.error("Error updating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        Edit Product
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          gap={2}
          onSubmit={handleSubmit(onSubmit)}
        >
          {errorMessage && (
            <Alert severity="error" onClose={() => setErrorMessage("")}>
              {errorMessage}
            </Alert>
          )}
          <Box>
            <Typography variant="caption" sx={{ mb: 0.5, display: "block" }}>
              PRODUCT NAME
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. Aloe Vera Gel"
              {...register("name", { required: "Product name is required" })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ mb: 0.5, display: "block" }}>
              CATEGORY
            </Typography>
            <ToggleButtonGroup
              fullWidth
              value={category}
              exclusive
              onChange={(e, val) => val && setCategory(val)}
              sx={{
                mt: 1,
                "& .MuiToggleButton-root": {
                  borderRadius: 2,
                  textTransform: "none",
                },
              }}
            >
              <ToggleButton value="grocery">Grocery</ToggleButton>
              <ToggleButton value="beauty">Beauty</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box display="flex" gap={2}>
            <Box flex={1}>
              <Typography variant="caption" sx={{ mb: 0.5, display: "block" }}>
                RETAIL PRICE
              </Typography>
              <TextField
                fullWidth
                placeholder="MMK"
                type="number"
                {...register("RetailPrice", {
                  required: "Retail price is required",
                  min: { value: 0, message: "Price must be positive" },
                })}
                error={!!errors.RetailPrice}
                helperText={errors.RetailPrice?.message}
              />
            </Box>
            <Box flex={1}>
              <Typography variant="caption" sx={{ mb: 0.5, display: "block" }}>
                WHOLESALE PRICE
              </Typography>
              <TextField
                fullWidth
                placeholder="MMK"
                type="number"
                {...register("WholesalePrice", {
                  required: "Wholesale price is required",
                  min: { value: 0, message: "Price must be positive" },
                })}
                error={!!errors.WholesalePrice}
                helperText={errors.WholesalePrice?.message}
              />
            </Box>
          </Box>
          <Box display="flex" gap={2}>
            <Box flex={1}>
              <Typography variant="caption" sx={{ mb: 0.5, display: "block" }}>
                CURRENT STOCK
              </Typography>
              <TextField
                fullWidth
                type="number"
                {...register("Stock", {
                  required: "Stock is required",
                  min: { value: 0, message: "Stock must be positive" },
                })}
                error={!!errors.Stock}
                helperText={errors.Stock?.message}
              />
            </Box>
            <Box flex={1}>
              <Typography variant="caption" sx={{ mb: 0.5, display: "block" }}>
                REORDER POINT
              </Typography>
              <TextField
                fullWidth
                type="number"
                {...register("PreOrder", {
                  min: { value: 0, message: "Must be positive" },
                })}
                error={!!errors.PreOrder}
                helperText={errors.PreOrder?.message}
              />
            </Box>
          </Box>

          <Button
            variant="contained"
            size="large"
            type="submit"
            disabled={isSubmitting}
            sx={{
              mt: 2,
              borderRadius: 3,
              py: 1.5,
              backgroundColor: "#5A4CF0",
              "&:hover": {
                backgroundColor: "#4A3CE0",
              },
            }}
          >
            {isSubmitting ? "Updating..." : "Update Product"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
