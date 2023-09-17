// function1.mjs
import { DynamoDB } from 'aws-sdk';

const dynamo = new DynamoDB.DocumentClient();

// DynamoDBからデータを取得する関数
const fetchData = async (tableName, key) => {
  const params = {
    TableName: tableName,
    Key: key
  };
  return dynamo.get(params).promise();
};

// バッテリー返却通知のAPIハンドラ
export const returnBatteryNotification = async (event) => {
  const { headers, body } = event;

  // ヘッダーのチェック
  if (headers["Content-Type"] !== "application/json" || !headers["x-api-key"]) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid headers" })
    };
  }

  // ボディのパースとバリデーション
  const parsedBody = JSON.parse(body);
  const { uId, FelicaId, slotNo, batteryId, retDt } = parsedBody;
  if (!uId || !FelicaId || !slotNo || !batteryId || !retDt) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing required body parameters" })
    };
  }

  // DynamoDBのテーブル名
  const tableName = "dev-smart-return";

  // DynamoDBへのクエリ (実際の操作内容は仕様によります)
  const dbResponse = await fetchData(tableName, { uId });

  // レスポンスの組み立て
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify({
      proCode: dbResponse.proCode,
      batteryId: dbResponse.batteryId,
      slotNo: dbResponse.slotNo,
      rDt: new Date().toISOString()
    })
  };
};
