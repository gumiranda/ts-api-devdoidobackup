export const userSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    pushId: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    role: {
      type: 'string',
    },
    cpf: {
      type: 'string',
    },
    phone: {
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
  },
};
