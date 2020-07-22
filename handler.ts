import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { validateQueryData } from "./util";
import { sendEmailService } from "./services";
import { ValidatedData } from "./Types";
import { buildSendEmailParams } from "./util";

export const sendEmail: APIGatewayProxyHandler = async (event, _context) => {
  const data = JSON.parse(event.body);
  const validationResponse = validateQueryData(data);
  if (!validationResponse) {
    const validatedData: ValidatedData = data;
    const sendEmailParams = buildSendEmailParams(validatedData);
    let response;
    try {
      const sendEmailResponse = await sendEmailService
        .sendEmail(sendEmailParams)
        .promise();
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
