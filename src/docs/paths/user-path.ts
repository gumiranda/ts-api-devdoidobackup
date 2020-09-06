export const userPath = {
  get: {
    security: [{ apiKeyAuth: [] }],
    tags: ['User'],
    summary: 'Endpoint que consulta resultado usando paginação',
    parameters: [
      {
        in: 'path',
        name: 'page',
        required: true,
        schema: {
          type: 'number',
        },
      },
    ],
  },
  responses: {
    200: {
      description: 'Sucesso',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/users',
          },
        },
      },
    },
    404: {
      $ref: '#/components/notFound',
    },
    403: {
      $ref: '#/components/forbidden',
    },
    500: {
      $ref: '#/components/serverError',
    },
  },
};
