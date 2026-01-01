import {
  Box,
  Button,
  Container,
  Divider,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import ProductsTable from "../components/ProductsTable";
import { Add } from "@mui/icons-material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useApp } from "../AppProvider";
import AddProduct from "../components/AddProduct";
import EditProduct from "../components/EditProduct";
import { useState } from "react";

const api = "https://inventory-api-b0va.onrender.com";

export async function fetchProduct() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required. Please login again.");
  }

  try {
    const res = await fetch(`${api}/products/choice`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));

      if (res.status === 401) {
        localStorage.removeItem("token");
        throw new Error("Session expired. Please login again.");
      }

      throw new Error(
        errorData.msg ||
          errorData.error ||
          `Failed to fetch products (${res.status})`
      );
    }

    return res.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Network error. Please check if the server is running.");
    }
    throw error;
  }
}

export default function Inventory() {
  const { open, setOpen } = useApp();
  const [editOpen, setEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const queryClient = useQueryClient();
  const {
    data: products,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProduct,
  });

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditOpen(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${api}/products/${productId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          queryClient.invalidateQueries({ queryKey: ["products"] });
        } else {
          alert("Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product");
      }
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 3 }}>
          {error.message || "Failed to load products"}
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", mt: 3, mb: 2 }}
      >
        <Typography sx={{ color: "blue", textShadow: 3, ml: 2, fontSize: 25 }}>
          INVENTORY
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add Product
        </Button>
      </Box>
      <Divider />
      <ProductsTable
        products={products?.products || products || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <AddProduct open={open} onClose={() => setOpen(false)} />
      <EditProduct
        open={editOpen}
        onClose={() => setEditOpen(false)}
        product={selectedProduct}
      />
    </Container>
  );
}
