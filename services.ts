import * as AWS from "aws-sdk";

export const sendEmailService = new AWS.SES({
  region: "eu-central-1",
});
