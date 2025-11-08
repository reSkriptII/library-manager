declare global {
  type UserRole = "user" | "librarian" | "admin";
  namespace NodeJs {
    interface ProcessEnv {
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
    }
  }
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role?: UserRole;
      };
    }
  }
}

export {};
