declare namespace Express {
  interface Request {
    io: any;
    usuarioLogado: any;
    connectedUsers: any;
  }
}
