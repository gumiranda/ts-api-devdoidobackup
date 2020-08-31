declare namespace Express {
  interface Request {
    accountId?: string;
    io: any;
    connectedUsers: any;
  }
}
