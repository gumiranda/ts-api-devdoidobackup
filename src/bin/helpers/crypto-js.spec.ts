import EncrypterAES from '@/bin/helpers/crypto-js';

describe('EncrypterAES Helper', () => {
  test('Should call EncrypterAES encryptObject', async () => {
    const encryptObjectSpy = jest.spyOn(EncrypterAES, 'encryptObject');
    EncrypterAES.encryptObject({ id: 'any_id' });
    expect(encryptObjectSpy).toHaveBeenCalledWith({ id: 'any_id' });
  });
});
