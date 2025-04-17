import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynamoDb = new DynamoDBClient({ region: "us-east-1" });

const getContactsByUser = async (event: any) => {
  const userId = event.pathParameters?.userId;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:5173",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  };

  if (event.requestContext?.http?.method === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "CORS preflight success" }),
    };
  }
  if (!userId) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ message: "User ID is required" }),
    };
  }

  const command = new QueryCommand({
    TableName: "contact",
    IndexName: "user_id-index",
    KeyConditionExpression: "user_id = :uid",
    ExpressionAttributeValues: {
      ":uid": { S: userId },
    },
  });

  try {
    const result = await dynamoDb.send(command);
    const contacts = result.Items?.map((item) => unmarshall(item)) || [];

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ contacts }),
    };
  } catch (error) {
    console.error("Error getting contacts:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Error getting contacts",
        error: error instanceof Error ? error.message : error,
      }),
    };
  }
};

module.exports = {
  getContactsByUser,
};
