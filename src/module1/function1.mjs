import { DynamoDB } from 'aws-sdk';

export const fetchData = async (tableName, key) => {
  const dynamo = new DynamoDB.DocumentClient();
  const params = {
    TableName: tableName,
    Key: key
  };
  return dynamo.get(params).promise();
};