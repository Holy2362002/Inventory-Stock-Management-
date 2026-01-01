import express from "express";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import cors from "cors";
app.use(cors());

app.get("/items", (req, res) => {
  res.json({ msg: "This is express ...." });
});

import { userRouter } from "./route/user.ts";
app.use("/users", userRouter);
import { productRouter } from "./route/product";
app.use("/products", productRouter);
import { saleRouter } from "./route/sale";
app.use("/sales", saleRouter);



app.listen(8800, () => {
  console.log("sever is running in port 8800>>>");
});
