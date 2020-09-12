export const updateUserPath = {
  put: {
    security: [{ apiKeyAuth: [] }],
    tags: ['User'],
    summary: 'Endpoint que completa cadastro do usuário',
    requestBody: {
      description: 'Forneça cpf e telefone',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/updateUserParams',
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Sucesso',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/user',
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
