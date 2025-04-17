import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  AdminGetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import Cookies from "js-cookie";

const REGION = "us-east-1";
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const USER_POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const cognitoClient = new CognitoIdentityProviderClient({ region: REGION });

export const signUp = async (email: string, password: string) => {
  const command = new SignUpCommand({
    ClientId: CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: [{ Name: "email", Value: email }],
  });

  return await cognitoClient.send(command);
};

export const confirmCode = async (email: string, code: string) => {
  const command = new ConfirmSignUpCommand({
    ClientId: CLIENT_ID,
    Username: email,
    ConfirmationCode: code,
  });

  return await cognitoClient.send(command);
};

export const login = async (email: string, password: string) => {
  const command = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  });

  const response = await cognitoClient.send(command);
  const tokens = response.AuthenticationResult;

  if (tokens?.IdToken) {
    Cookies.set("token", tokens.IdToken, {
      secure: true,
      sameSite: "strict",
      expires: 1,
    });
  }

  return tokens;
};
//Esto lo tenia implementado, pero por alguna razon no funcionaba bien, una vez que desloggeaba no me dejaba ingresar mas
export const logout = async () => {
  Cookies.remove("token");
};

//este no lo termine usando en ningun lado pero lo deje implementado por que puede servir en un futuro
export const getUserProfileByEmail = async (email: string) => {
  const command = new AdminGetUserCommand({
    UserPoolId: USER_POOL_ID,
    Username: email,
  });

  const response = await cognitoClient.send(command);

  const attributes: Record<string, string> = {};
  response.UserAttributes?.forEach((attr) => {
    if (attr.Name && attr.Value) {
      attributes[attr.Name] = attr.Value;
    }
  });

  return attributes;
};

export const isAuthenticated = () => {
  return Boolean(Cookies.get("token"));
};
