import { Logger } from "@nestjs/common";

export async function sendEmail(email: string, url: string) {
  Logger.log(`Send email to ${email} and url ${url}`)
}
