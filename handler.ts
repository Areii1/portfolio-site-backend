import { APIGatewayProxyHandler } from "aws-lambda";
import * as AWS from "aws-sdk";
import "source-map-support/register";
import { sourceEmail, deliveryEmail } from "./config";
import { validateQueryData } from "./util";

const ses = new AWS.SES({
  region: "eu-central-1",
});

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
    var params = {
      Destination: {
        ToAddresses: [deliveryEmail],
      },
      Message: {
        Subject: { Data: validatedData.subject },
        Body: {
          Text: { Data: validatedData.message },
        },
      },
      Source: sourceEmail,
    };

    let response;
    try {
      const sendEmailResponse = await ses.sendEmail(params).promise();
      response = {
        statusCode: 200,
        body: JSON.stringify({
          response: `email was sent successfully, id: ${sendEmailResponse.MessageId}`,
        }),
      };
    } catch (awsSesServiceError) {
      response = {
        statusCode: 500,
        body: JSON.stringify({
          error: `could not send email due to error: '${awsSesServiceError.message}'`,
        }),
      };
    }
    return response;
  } else {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: validationResponse }),
    };
  }
};
