import type { UserModel } from "../generated/prisma/models/User";

declare global {
  namespace Express {
    interface Request {
      user: UserModel | null;
    }
  }
}

export {};

