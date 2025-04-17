import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const dynamoDb = new DynamoDBClient({ region: "us-east-1" });

const deleteContact = async (event: any) => {
  const contactId = event.pathParameters?.id;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:5173",
  };
  if (!contactId) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Missing contact id" }),
    };
  }

  const command = new DeleteItemCommand({
    TableName: "contact",
    Key: marshall({ id: contactId }),
  });

  try {
    await dynamoDb.send(command);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Contact deleted" }),
    };
  } catch (error) {
    console.error("Error deleting contact:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Error deleting contact" }),
    };
  }
};

module.exports = {
  deleteContact,
};
