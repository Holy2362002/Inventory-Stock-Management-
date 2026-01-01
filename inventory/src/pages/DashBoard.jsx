import { useQuery } from "@tanstack/react-query";
import DashBoardLayout from "../components/DashboardLayout";

const api = "http://localhost:8800";

export async function fetchItems() {
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

export default function Dashboard() {
  const {
    data: products,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchItems,
  });

  return (
    <div>
      <DashBoardLayout products={products?.products || products || []} />
    </div>
  );
}
