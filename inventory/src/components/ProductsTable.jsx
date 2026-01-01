import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useState } from "react";

export default function ProductsTable({ products, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!products || !Array.isArray(products) || products.length === 0) {
    return (
      <Box sx={{ mt: 3 }}>
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            No products found. Add your first product to get started!
          </Typography>
        </Paper>
      </Box>
    );
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Paper>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
            mt: 1,
            ml: 1,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter product name or SKU"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
        <TableContainer
          sx={{
            borderRadius: 4,
            border: 0.7,
            maxHeight: filteredProducts.length > 20 ? 500 : "none",
            overflowY: filteredProducts.length > 20 ? "auto" : "visible",
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Stock</TableCell>
                <TableCell align="right">Retail</TableCell>
                <TableCell align="right">WholeSale</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow
                  key={product.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Box sx={{ gridColumn: "span 4" }}>
                      <Typography
                        fontSize={14}
                        fontWeight={500}
                        color="slategray"
                        noWrap
                      >
                        {product.name}
                      </Typography>

                      <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            bgcolor:
                              product.Category === "grocery"
                                ? "success.main"
                                : "error.main",
                          }}
                        />

                        <Typography fontSize={10} color="text.secondary">
                          {product.Category}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">{product.Stock}</TableCell>
                  <TableCell align="right">{product.RetailPrice}</TableCell>
                  <TableCell align="right">{product.WholesalePrice}</TableCell>
                  <TableCell align="right">
                    <Box>
                      <IconButton onClick={() => onEdit && onEdit(product)}>
                        <EditIcon color="primary" />
                      </IconButton>
                      <IconButton onClick={() => onDelete(product.id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
