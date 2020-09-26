export default {
  Api: {
    port: process.env.port || 3333,
  },
  Database: {
    connection: process.env.CONNECTION,
  },
  Security: {
    secretKey: process.env.SECRETKEY,
    AESKey: process.env.AESKEY,
  },
  OneSignal: {
    authKey: process.env.ONE_SIGNAL_AUTH_KEY,
    appId: process.env.ONE_SIGNAL_APP_ID,
  },
  Pagarme: {
    pagarmeKey: process.env.PAGARME,
    pagarmeKeyTest:
      process.env.AMBIENTE === 'DEV'
        ? process.env.PAGARMETEST
        : 'CHAVE DE PROD',
  },
};
// module.exports = variables;
