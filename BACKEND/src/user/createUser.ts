import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuidv4 } from "uuid";
const dynamoDb = new DynamoDBClient({ region: "us-east-1" });

const createUser = async (event: any) => {
  const { password, name, email } = JSON.parse(event.body);
  const user = {
    id: uuidv4(),
    createdAt: Date.now(),
    name,
    password,
    email,
  };
  const command = new PutItemCommand({
    TableName: "user",
    Item: marshall(user),
  });
  const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:5173",
  };
  try {
    await dynamoDb.send(command);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "User successfully created",
        user,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Error creating user",
        error: error instanceof Error ? error.message : error,
      }),
    };
  }
};

module.exports = {
  createUser,
};
