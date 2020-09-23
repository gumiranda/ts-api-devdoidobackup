import { AES, enc } from 'react-native-crypto-js';
import variables from '@/bin/configuration/variables';
import pagarme from '@/bin/helpers/external-apis/pagarme';
const decryptObject = (dataEncrypted) => {
  const bytes = AES.decrypt(dataEncrypted, variables.Security.AESKey);
  return JSON.parse(bytes.toString(enc.Utf8));
};
const encryptObject = (plainData) => {
  return AES.encrypt(
    JSON.stringify(plainData),
    variables.Security.AESKey,
  ).toString();
};
const generateCardHashPagarme = async (card_hash) => {
  const bytes = AES.decrypt(card_hash, variables.Security.AESKey);
  const decryptedData = JSON.parse(bytes.toString(enc.Utf8));
  const cardToHash = {
    card_number: decryptedData.card_number,
    card_holder_name: decryptedData.card_holder_name,
    card_cvv: decryptedData.card_cvv,
    card_expiration_date: decryptedData.card_expiration_date,
  };
  return await pagarme.generateCardHash(cardToHash);
};

export default {
  decryptObject,
  generateCardHashPagarme,
  encryptObject,
};
