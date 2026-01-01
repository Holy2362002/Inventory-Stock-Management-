import { Login, Logout } from "@mui/icons-material";
import {
  Box,
  Container,
  IconButton,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import SearchIcon from "@mui/icons-material/Search";
import { useApp } from "../AppProvider";
import { useState } from "react";

export default function Search() {
  const { priceType, setPriceType, searchProduct, setSearchProduct } = useApp();

  return (
    <Container sx={{ mt: 4 }}>
      <Paper
        sx={{
          borderRadius: 2,
          borderColor: "grey",
          border: 1,
          backgroundColor: grey[100],
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 2,
              width: "100%",
              borderRadius: 2.5,
              mt: 2,
              mx: 2,
              backgroundColor: "#2f579bff",
            }}
          >
            <Typography
              variant="h6"
              align="center"
              gutterBottom
              borderBottom={0.05}
              borderColor={"white"}
              sx={{ pb: 1, mb: 2 }}
            >
              Select View
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-around" }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ minWidth: 120 }}
                onClick={() => setPriceType("RetailPrice")}
              >
                Retail
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{ minWidth: 120 }}
                onClick={() => setPriceType("WholesalePrice")}
              >
                Wholesale
              </Button>
            </Box>
          </Paper>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              width: "100%",
              borderRadius: 2.5,
              mx: 2,
              mb: 2,
              backgroundColor: "#2f579bff",
            }}
          >
            <Typography variant="h6" align="center" gutterBottom>
              Search Products
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter product name or SKU"
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
              >
                Search
              </Button>
            </Box>
          </Paper>
        </Box>
      </Paper>
    </Container>
  );
}
