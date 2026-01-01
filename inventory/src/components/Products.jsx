import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button } from "@mui/material";
import { useApp } from "../AppProvider";
import { grey } from "@mui/material/colors";
import { useState } from "react";

export default function Product({ products }) {
  const { priceType, cart, setCart, searchProduct } = useApp();

  const handleAddToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      if (existingItem.quantity < product.Stock) {
        setCart(
          cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      }
    } else {
      const price =
        priceType === "RetailPrice"
          ? product.RetailPrice
          : product.WholesalePrice;
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
          salePrice: price,
        },
      ]);
    }
  };

  const filterSearchProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  return (
    <TableContainer
      sx={{
        borderRadius: 2,
        border: 0.7,
        maxHeight: filterSearchProducts.length > 20 ? 500 : "none",
        overflowY: filterSearchProducts.length > 20 ? "auto" : "visible",
        backgroundColor: grey[500],
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="center">Stock</TableCell>
            {priceType === "RetailPrice" ? (
              <TableCell align="center">Retail Price</TableCell>
            ) : (
              <TableCell align="center">WholeSale Price</TableCell>
            )}
            <TableCell align="center">Sale</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filterSearchProducts.map((product) => (
            <TableRow
              key={product.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {product.name}
              </TableCell>
              <TableCell align="center">{product.Stock}</TableCell>
              {priceType === "RetailPrice" ? (
                <TableCell align="center">{product.RetailPrice}</TableCell>
              ) : (
                <TableCell align="center">{product.WholesalePrice}</TableCell>
              )}
              <TableCell align="center">
                <Button
                  variant="contained"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.Stock === 0}
                  size="small"
                >
                  Sale Product
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
