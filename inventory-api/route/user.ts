import express from "express";
const router = express.Router();
import { prisma } from "../libs/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { auth } from "../middleware/auth";

router.get("/verify", auth, async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
  res.status(200).json({ user });
});

router.post("/", async (req, res) => {
  try {
    const userData = req.body?.user || req.body;
    const { name, username, password } = userData;

    if (!name || !username || !password) {
      return res.status(400).json({
        msg: "name, username, and password are required",
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({
        msg: "Username already exists",
      });
    }

    const user = await prisma.user.create({
      data: {
        name,
        username,
        password: await bcrypt.hash(password, 10),
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ user: userWithoutPassword });
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).json({
      msg: "Failed to create user",
      error: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const username = req.body?.username;
    const password = req.body?.password;

    if (!username || !password) {
      return res.status(400).json({ msg: "username & password are required" });
    }

    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(401).json({ msg: "incorrect username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ msg: "incorrect username or password" });
    }

    const { password: _, ...userWithoutPassword } = user;

    return res.json({
      user: userWithoutPassword,
      token: jwt.sign(
        {
          id: user.id,
          username: user.username,
        },
        process.env.JWT_SECRET || "default-secret"
      ),
    });
  } catch (error: any) {
    console.error("Error during login:", error);
    res.status(500).json({
      msg: "Failed to login",
      error: error.message,
    });
  }
});

export { router as userRouter };
