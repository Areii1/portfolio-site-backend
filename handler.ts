import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { validateQueryData } from "./util";
import { sendEmail as sendEmailFromService } from "./services";
import { ValidatedData } from "./Types";

const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export const sendEmail: APIGatewayProxyHandler = async (event, _context) => {
  const data = JSON.parse(event.body);
  const validationResponse = validateQueryData(data);
  if (!validationResponse) {
    const validatedData: ValidatedData = data;
    try {
      const sendEmailResponse = await sendEmailFromService(
        validatedData.email,
        validatedData.name,
        validatedData.subject,
        validatedData.message
      );
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
      statusCode: 400,
      body: JSON.stringify({ error: validationResponse }),
      headers: defaultHeaders,
    };
  }
};
