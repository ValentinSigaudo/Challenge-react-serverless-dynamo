import { v4 as uuidv4 } from "uuid";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const dynamoDb = new DynamoDBClient({ region: "us-east-1" });

const createContact = async (event: any) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:5173",
  };
  const {
    first_name,
    phone,
    email,
    last_name,
    contact_role,
    company_name,
    note,
    user_id,
  } = JSON.parse(event.body);

  if (!user_id || !first_name || !last_name || !phone || !email) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Missing required fields" }),
    };
  }

  const contact = {
    id: uuidv4(),
    createdAt: Date.now(),
    first_name,
    last_name,
    phone,
    email,
    contact_role: contact_role || null,
    company_name: company_name || null,
    note: note || null,
    user_id,
  };

  const command = new PutItemCommand({
    TableName: "contact",
    Item: marshall(contact),
  });

  try {
    await dynamoDb.send(command);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Contact successfully created",
        contact,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Error creating contact",
        error: error instanceof Error ? error.message : JSON.stringify(error),
      }),
    };
  }
};

module.exports = {
  createContact,
};
