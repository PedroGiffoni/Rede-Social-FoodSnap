declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      userType: string;
    };
  }
}
