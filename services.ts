import * as AWS from "aws-sdk";
import { sourceEmail, deliveryEmail } from "./config";

const sendEmailService = new AWS.SES({
  region: "eu-central-1",
});

export const sendEmail = (subject: string, message: string, email: string) => {
  const sendEmailParams = {
    Destination: {
      ToAddresses: [deliveryEmail],
    },
    Message: {
      Subject: { Data: subject },
      Body: {
        Text: { Data: message },
      },
    },
    Source: sourceEmail,
    ReplyToAddresses: [email],
  };
  return sendEmailService.sendEmail(sendEmailParams).promise();
};
