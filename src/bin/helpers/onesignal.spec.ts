import OneSignal from '@/bin/helpers/onesignal';

describe('OneSignal Helper', () => {
  test('Should call OneSignal sendNotification', async () => {
    const sendNotificationSpy = jest.spyOn(OneSignal, 'sendNotification');
    await OneSignal.sendNotification('any_id', 'any_name', 'any_text');
    expect(sendNotificationSpy).toHaveBeenCalledWith(
      'any_id',
      'any_name',
      'any_text',
    );
  });
  test('Should call OneSignal addDevice', async () => {
    const addDeviceSpy = jest.spyOn(OneSignal, 'addDevice');
    await OneSignal.addDevice('any_token');
    expect(addDeviceSpy).toHaveBeenCalledWith('any_token');
  });
});
