import { APIGatewayProxyHandler } from "aws-lambda";
import * as AWS from "aws-sdk";
import "source-map-support/register";

console.log(AWS, "aws");

const ses = new AWS.SES({
  region: "eu-central-1", // Set the region in which SES is configured
});

console.log(ses, "ses");

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
    var params = {
      Destination: {
        ToAddresses: ["ari.jaaskelainen1@gmail.com"],
      },
      Message: {
        Body: {
          Text: { Data: "Test" },
        },

        Subject: { Data: "Test Email" },
      },
      Source: "contact@arijaaskelainen.fi",
    };

    if (ses.sendEmail) {
      console.log("ses.send email does exist 3");
      let response;
      try {
        const sendEmailResponse = await ses.sendEmail(params).promise();
        console.log(sendEmailResponse, "sendEmailResponse");
        response = {
          statusCode: 200,
          body: JSON.stringify({
            response: `email was sent successfully, id: ${sendEmailResponse.MessageId}`,
          }),
        };
      } catch (awsSesServiceError) {
        console.log("could not perform ses.sendEmail()", awsSesServiceError);
        response = {
          statusCode: 500,
          body: JSON.stringify({
            error: `could not send email due to error: '${awsSesServiceError.message}'`,
          }),
        };
      }
      console.log(response, "response");
      return response;
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "ses service does not exist" }),
      };
    }
  } else {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: validationResponse }),
    };
  }
};
