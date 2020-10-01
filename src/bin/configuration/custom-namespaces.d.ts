declare namespace Express {
  interface Request {
    userId?: string;
    query?: any;
    io: any;
    connectedUsers: any;
  }
}
