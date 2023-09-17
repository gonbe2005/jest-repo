import { returnBatteryNotification } from './function1.mjs';

// 既存の jest.mock の中で DocumentClient の get メソッドのモックを取得します。
jest.mock('aws-sdk/clients/dynamodb', () => {
  const getMock = jest.fn().mockImplementation((params) => {
    return {
      promise: jest.fn().mockResolvedValue({
        Item: {
          proCode: "exampleProCode",
          batteryId: "exampleBatteryId",
          slotNo: 1
        }
      })
    };
  });

  return {
    DocumentClient: jest.fn().mockImplementation(() => {
      return {
        get: getMock
      };
    })
  };
});

describe('バッテリー返却通知テスト', () => {

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
    expect.assertions(2);

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
  it('DynamoDBからのデータが取得できない場合、500を返す', async () => {
    expect.assertions(1);

    // モックをリセット
    jest.resetModules();

    // DynamoDBのモックを上書きして、Itemが含まれていないレスポンスを返すようにする
    const dynamodb = jest.requireActual('aws-sdk/clients/dynamodb');
    dynamodb.DocumentClient.prototype.get = jest.fn().mockImplementation((params) => {
      return {
        promise: jest.fn().mockResolvedValue({})
      };
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
    expect(response.statusCode).toBe(500);
});
});