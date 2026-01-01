import express from "express";
import jwt from "jsonwebtoken";

import { prisma } from "../libs/prisma";

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

async function auth(req, res, next) {
  try {
    const authorization = req.headers.authorization;
    const token = authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "Token missing" });
    }

    // Verify and decode the token
    let decode;
    try {
      decode = jwt.verify(token, process.env.JWT_SECRET || "default-secret");
    } catch (error) {
      return res.status(401).json({ msg: "Invalid or expired token" });
    }

    if (!decode || !decode.id) {
      return res.status(401).json({ msg: "Invalid token payload" });
    }

    const user = await prisma.user.findFirst({
      where: {
        id: decode.id,
      },
    });

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ msg: "Authentication error", error: error.message });
  }
}

export {auth};