export const ratingPath = {
  get: {
    security: [{ apiKeyAuth: [] }],
    tags: ['Rating'],
    summary: 'Endpoint que lista avaliações',
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/rating',
            },
          },
        },
      },
      403: {
        $ref: '#/components/forbidden',
      },
      404: {
        $ref: '#/components/notFound',
      },
      401: {
        $ref: '#/components/unauthorized',
      },
      500: {
        $ref: '#/components/serverError',
      },
    },
  },
  post: {
    security: [{ apiKeyAuth: [] }],
    tags: ['Rating'],
    summary: 'Endpoint que cadastra avaliação',
    requestBody: {
      description: 'Forneça os dados básicos de avaliação',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/addRatingParams',
          },
        },
      },
    },
  },
  responses: {
    204: {
      description: 'Sucesso',
    },
    400: {
      $ref: '#/components/badRequest',
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
