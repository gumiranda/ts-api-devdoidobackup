export type HttpResponse = {
  statusCode: number;
  body: any;
};

export type HttpRequest = {
  body?: any;
  headers?: any;
  io?: any;
  params?: any;
  query?: any;
  usuarioLogado?: any;
  userId?: string;
  connectedUsers?: any;
};
