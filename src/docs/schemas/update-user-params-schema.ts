export const updateUserParamsSchema = {
  type: 'object',
  properties: {
    cpf: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    photo_url: {
      type: 'string',
    },
    cnpj: {
      type: 'string',
    },
    plan: {
      type: 'string',
    },
    city: {
      type: 'string',
    },
    address: {
      type: 'string',
    },
    complement: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    intervalAppointment: {
      type: 'number',
    },
    days1: {
      type: 'array',
    },
    days2: {
      type: 'array',
    },
    hourStart1: {
      type: 'string',
    },
    hourStart2: {
      type: 'string',
    },
    hourEnd1: {
      type: 'string',
    },
    hourEnd2: {
      type: 'string',
    },
    coord: {
      type: 'array',
      items: { type: 'number' },
    },
  },
};
