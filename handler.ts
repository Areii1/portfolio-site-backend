import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { validateQueryData } from "./util";
import { sendEmailService } from "./services";
import { ValidatedData } from "./Types";
import { buildSendEmailParams } from "./util";

const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export const sendEmail: APIGatewayProxyHandler = async (event, _context) => {
  const data = JSON.parse(event.body);
  const validationResponse = validateQueryData(data);
  if (!validationResponse) {
    const validatedData: ValidatedData = data;
    const sendEmailParams = buildSendEmailParams(validatedData);
    try {
      const sendEmailResponse = await sendEmailService
        .sendEmail(sendEmailParams)
        .promise();
      return {
        statusCode: 200,
        body: JSON.stringify({
          response: `email was sent successfully, id: ${sendEmailResponse.MessageId}`,
        }),
        headers: defaultHeaders,
      };
    } catch (awsSesServiceError) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: `could not send email due to error: '${awsSesServiceError.message}'`,
        }),
        headers: defaultHeaders,
      };
    }
  } else {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: validationResponse }),
      headers: defaultHeaders,
    };
  }
};
