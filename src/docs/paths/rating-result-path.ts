export const ratingResultPath = {
  put: {
    security: [{ apiKeyAuth: [] }],
    tags: ['Rating'],
    summary: 'Endpoint que cadastra resultado de avaliação',
    parameters: [
      {
        in: 'path',
        name: 'ratingId',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    requestBody: {
      description: 'Forneça os dados básicos de avaliação',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/saveRatingParams',
          },
        },
      },
    },
  },
  get: {
    security: [{ apiKeyAuth: [] }],
    tags: ['Rating'],
    summary: 'Endpoint que consulta resultado de avaliação',
    parameters: [
      {
        in: 'path',
        name: 'ratingId',
        required: true,
        schema: {
          type: 'string',
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
            $ref: '#/schemas/ratingResult',
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
