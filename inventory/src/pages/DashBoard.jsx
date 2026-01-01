import DashBoardLayout from "../components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress, Alert } from "@mui/material";

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
        errorData.msg ||
          errorData.error ||
          `Failed to fetch products (${res.status})`
      );
    }

    return res.json();
  } catch (error) {
    throw error;
  }
}

export default function Dashboard() {
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProduct,
  });

  if (isLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" style={{ margin: "20px" }}>
        {error.message}
      </Alert>
    );
  }

  return (
    <div>
      <DashBoardLayout products={products?.products || []} />
    </div>
  );
}
