import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

const validateQueryData = (data: any) => {
  const keys = Object.keys(data);
  console.log(keys, "keys");
  if (keys.length > 4) {
    return "provide no more than four arguments";
  }
  const hasName = keys.some((key) => key === "name");
  console.log(hasName, "hasName");
  if (!hasName) {
    return "name field missing";
  }
  const hasEmail = keys.some((key) => key === "email");
  console.log(hasEmail, "hasEmail");
  if (!hasEmail) {
    return "email field missing";
  }
  const hasSubject = keys.some((key) => key === "subject");
  console.log(hasSubject, "hasSubject");
  if (!hasSubject) {
    return "subject field missing";
  }
  const hasMessage = keys.some((key) => key === "message");
  console.log(hasMessage, "hasMessage");
  if (!hasMessage) {
    return "message field missing";
  }
};

type ValidatedData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export const logInfo: APIGatewayProxyHandler = async (event, _context) => {
  const data = JSON.parse(event.body);
  const validationResponse = validateQueryData(data);
  if (!validationResponse) {
    const validatedData: ValidatedData = data;
    console.log(validatedData, "validatedData");
    return {
      statusCode: 200,
      body: JSON.stringify({ response: "received query in correct form" }),
    };
  } else {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: validationResponse }),
    };
  }
};
