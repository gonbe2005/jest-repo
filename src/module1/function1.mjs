import DynamoDB from 'aws-sdk/clients/dynamodb';
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

  // DynamoDBへのクエリ
  const dbResponse = await fetchData(tableName, { uId });

  if (!dbResponse.Item) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to fetch data from DynamoDB" })
    };
  }

  // レスポンスの組み立て
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify({
      proCode: dbResponse.Item.proCode,
      batteryId: dbResponse.Item.batteryId,
      slotNo: dbResponse.Item.slotNo,
      rDt: new Date().toISOString()
    })
  };
};
