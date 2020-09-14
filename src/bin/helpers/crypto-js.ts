import { AES, enc } from 'react-native-crypto-js';
import variables from '@/bin/configuration/variables';

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
export default {
  decryptObject,
  encryptObject,
};
