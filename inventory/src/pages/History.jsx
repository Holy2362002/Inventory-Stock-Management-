import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Button,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Delete } from "@mui/icons-material";

const api = "https://inventory-api-b0va.onrender.com";

export async function fetchSales() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required. Please login again.");
  }

  try {
    const res = await fetch(`${api}/sales`, {
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
          `Failed to fetch sales (${res.status})`
      );
    }

    const data = await res.json();
    return data.sales || [];
  } catch (error) {
    console.error("Error fetching sales:", error);
    throw error;
  }

  const handleDelete = () => {};
}

export default function History() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);
  const queryClient = useQueryClient();
  const {
    data: sales,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sales"],
    queryFn: fetchSales,
  });

  const SalehistoryDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${api}/sales/${productId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          queryClient.invalidateQueries({ queryKey: ["sales"] });
        } else {
          alert("Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product");
      }
    }
  };

  const AllSalehistoryDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${api}/sales/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          queryClient.invalidateQueries({ queryKey: ["sales"] });
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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error.message}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" gutterBottom>
          Sales History
        </Typography>
        <Button color="error" onClick={AllSalehistoryDelete}>
          Delete All
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="sales history table">
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Price Type</TableCell>
              <TableCell align="right">Total Price (MMK)</TableCell>
              <TableCell align="right">Sale Date</TableCell>
              <TableCell align="right">Active</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales && sales.length > 0 ? (
              sales.map((sale) => (
                <TableRow
                  key={sale.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {sale.Product?.name || "Unknown Product"}
                  </TableCell>
                  <TableCell align="right">{sale.quantity}</TableCell>
                  <TableCell align="right">{sale.priceType}</TableCell>
                  <TableCell align="right">{sale.totalPrice}</TableCell>
                  <TableCell align="right">
                    {new Date(sale.saleDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="error"
                      onClick={() => SalehistoryDelete(sale.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No sales history found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
