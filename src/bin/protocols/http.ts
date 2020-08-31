export type HttpResponse = {
  statusCode: number;
  body: any;
};

export type HttpRequest = {
  body?: any;
  headers?: any;
  io?: any;
  usuarioLogado?: any;
  connectedUsers?: any;
};
