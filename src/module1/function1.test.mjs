import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { returnBatteryNotification } from './function1.mjs';

describe('バッテリー返却通知テスト', () => {
  
  beforeEach(() => {
    AWSMock.setSDKInstance(AWS);
  });

  afterEach(() => {
    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it('Content-Typeがapplication/jsonでない場合、400を返す', async () => {
    expect.assertions(1);

    const event = {
      headers: {
        "x-api-key": "exampleKey"
      },
      body: JSON.stringify({
        uId: "exampleUId",
        FelicaId: "exampleFelicaId",
        slotNo: 1,
        batteryId: "exampleBatteryId",
        retDt: "exampleDate"
      })
    };

    const response = await returnBatteryNotification(event);
    expect(response.statusCode).toBe(400);
  });

  it('x-api-keyが存在しない場合、400を返す', async () => {
    expect.assertions(1);

    const event = {
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        uId: "exampleUId",
        FelicaId: "exampleFelicaId",
        slotNo: 1,
        batteryId: "exampleBatteryId",
        retDt: "exampleDate"
      })
    };

    const response = await returnBatteryNotification(event);
    expect(response.statusCode).toBe(400);
  });

  it('uIdが存在しない場合、400を返す', async () => {
    expect.assertions(1);

    const event = {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "exampleKey"
      },
      body: JSON.stringify({
        FelicaId: "exampleFelicaId",
        slotNo: 1,
        batteryId: "exampleBatteryId",
        retDt: "exampleDate"
      })
    };

    const response = await returnBatteryNotification(event);
    expect(response.statusCode).toBe(400);
  });

  it('FelicaIdが存在しない場合、400を返す', async () => {
    expect.assertions(1);

    const event = {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "exampleKey"
      },
      body: JSON.stringify({
        uId: "exampleUId",
        slotNo: 1,
        batteryId: "exampleBatteryId",
        retDt: "exampleDate"
      })
    };

    const response = await returnBatteryNotification(event);
    expect(response.statusCode).toBe(400);
  });

  it('slotNoが存在しない場合、400を返す', async () => {
    expect.assertions(1);

    const event = {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "exampleKey"
      },
      body: JSON.stringify({
        uId: "exampleUId",
        FelicaId: "exampleFelicaId",
        batteryId: "exampleBatteryId",
        retDt: "exampleDate"
      })
    };

    const response = await returnBatteryNotification(event);
    expect(response.statusCode).toBe(400);
  });

  it('batteryIdが存在しない場合、400を返す', async () => {
    expect.assertions(1);

    const event = {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "exampleKey"
      },
      body: JSON.stringify({
        uId: "exampleUId",
        FelicaId: "exampleFelicaId",
        slotNo: 1,
        retDt: "exampleDate"
      })
    };

    const response = await returnBatteryNotification(event);
    expect(response.statusCode).toBe(400);
  });

  it('retDtが存在しない場合、400を返す', async () => {
    expect.assertions(1);

    const event = {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "exampleKey"
      },
      body: JSON.stringify({
        uId: "exampleUId",
        FelicaId: "exampleFelicaId",
        slotNo: 1,
        batteryId: "exampleBatteryId"
      })
    };

    const response = await returnBatteryNotification(event);
    expect(response.statusCode).toBe(400);
  });

  it('正しいリクエストの場合、200を返す', async () => {
    expect.assertions(3);

    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
      callback(null, {
        proCode: "exampleProCode",
        batteryId: "exampleBatteryId",
        slotNo: 1
      });
    });

    const event = {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "exampleKey"
      },
      body: JSON.stringify({
        uId: "exampleUId",
        FelicaId: "exampleFelicaId",
        slotNo: 1,
        batteryId: "exampleBatteryId",
        retDt: "exampleDate"
      })
    };

    const response = await returnBatteryNotification(event);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      proCode: "exampleProCode",
      batteryId: "exampleBatteryId",
      slotNo: 1
    });
  });
});
