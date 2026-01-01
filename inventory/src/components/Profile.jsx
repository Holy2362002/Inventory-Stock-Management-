import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
const api = "https://inventory-api-b0va.onrender.com";
async function fetchUserProfile() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication required. Please login again.");
  }

  const res = await fetch(`${api}/users/verify`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user profile");
  }

  const data = await res.json();
  return data.user;
}

export default function Profile() {
  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUserProfile,
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
          {error.message || "Failed to load profile"}
        </Alert>
      </Container>
    );
  }
  return (
    <Box sx={{ display: "flex", alignItems: "center", pb: 2 }}>
      <Avatar sx={{ ml: 2, mt: 1, bgcolor: "blue" }}>{user.name[0]}</Avatar>
      <Typography variant="h6" sx={{ ml: 2, mt: 1 }}>
        {user.username}
      </Typography>
    </Box>
  );
}
