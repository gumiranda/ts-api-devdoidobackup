import axios from 'axios';
import variables from '../configuration/variables';

const sendNotification = async (appId, name, text) => {
  try {
    const response = await axios({
      method: 'post',
      url: 'https://onesignal.com/api/v1/notifications',
      headers: {
        'Content-Type': 'application/json',
        Authorization: variables.OneSignal.authKey,
      },
      data: {
        headings: {
          pt: `Nova mensagem de ${name}`,
          en: `Nova mensagem de ${name}`,
        },
        contents: { en: text, pt: text },
        app_id: variables.OneSignal.appId,
        include_player_ids: [appId],
      },
    });
    console.log(response.data);
  } catch (erro) {
    // When status code of HTTP response is not 2xx, HTTPError is thrown.
    console.log(erro);
    console.log(erro.body);
  }
};
const addDevice = async (pushToken) => {
  try {
    await axios({
      method: 'post',
      url: 'https://onesignal.com/api/v1/players',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        identifier: pushToken,
        app_id: variables.OneSignal.appId,
        device_type: '1',
      },
    });
  } catch (e) {
    console.log(e);
  }
};
export default {
  sendNotification,
  addDevice,
};
