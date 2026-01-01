import { useQuery } from "@tanstack/react-query";
import Product from "../components/Products";
import Search from "../components/Search";
import { Alert, Box, CircularProgress, Container } from "@mui/material";
import SaleProductCard from "../components/SaleProduct";
const api = "http://localhost:8800";
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
        errorData.msg || errorData.error || `Failed to fetch products (${res.status})`
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
export default function Pos() {
  const {
    data: products,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProduct,
  });

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
    <div>
      <Search />
      <Container sx={{ display: "flex", gap: 4, mt: 3, mb: 10 }}>
        <Product products={products?.products} />
        <SaleProductCard />
      </Container>
    </div>
  );
}
