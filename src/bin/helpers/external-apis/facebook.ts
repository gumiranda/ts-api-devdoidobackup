import axios from 'axios';

export const loginFB = async (faceId, faceToken) => {
  const response: any = await axios.get(
    'https://graph.facebook.com/' +
      faceId +
      '?fields=picture,email,name,first_name&access_token=' +
      faceToken,
  );
  if (response.error) {
    return null;
  } else {
    return response;
  }
};
