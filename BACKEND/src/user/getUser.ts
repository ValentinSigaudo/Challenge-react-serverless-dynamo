import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynamoDb = new DynamoDBClient({ region: "us-east-1" });

const getUser = async (event: any) => {
  const userId = event.pathParameters?.id;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:5173",
  };
  if (!userId) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ message: "User ID is required in path" }),
    };
  }

  const command = new GetItemCommand({
    TableName: "user",
    Key: {
      id: { S: userId },
    },
  });

  try {
    const { Item } = await dynamoDb.send(command);

    if (!Item) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    const user = unmarshall(Item);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ user }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Error getting user" }),
    };
  }
};

module.exports = {
  getUser,
};
