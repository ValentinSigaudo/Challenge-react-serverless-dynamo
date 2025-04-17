import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const dynamoDb = new DynamoDBClient({ region: "us-east-1" });

const updateContact = async (event: any) => {
  const contactId = event.pathParameters?.id;
  const body = JSON.parse(event.body);
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
  if (!contactId) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Missing contact id" }),
    };
  }

  const updateFields = Object.keys(body)
    .filter((key) => body[key] !== undefined)
    .map((key) => `${key} = :${key}`)
    .join(", ");

  const expressionAttributeValues = marshall(
    Object.fromEntries(Object.entries(body).map(([k, v]) => [`:${k}`, v]))
  );

  const command = new UpdateItemCommand({
    TableName: "contact",
    Key: marshall({ id: contactId }),
    UpdateExpression: `SET ${updateFields}`,
    ExpressionAttributeValues: expressionAttributeValues,
  });

  try {
    await dynamoDb.send(command);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Contact updated" }),
    };
  } catch (error) {
    console.error("Error updating contact:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Error editing contact",
        error: error instanceof Error ? error.message : error,
      }),
    };
  }
};

module.exports = {
  updateContact,
};
