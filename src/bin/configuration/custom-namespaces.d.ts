declare namespace Express {
  interface Request {
    userId?: string;
    io: any;
    connectedUsers: any;
  }
}
