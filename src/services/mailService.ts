import { mailConfig } from "../config.ts/mailConfig";
import { MailInterface } from "../interfaces/mailInterface";
import { ResponseUtil } from "../utils/Response";


export class MailService {

    // Send mail 
    static async sendMail(options: MailInterface) {
        
        try {
            const info = await mailConfig.sendMail({
                from: process.env.EMAIL_SENDER || options.from,
                to: options.to,
                cc: options.cc,
                bcc: options.bcc,
                subject: options.subject,
                text: options.text,
                html: options.html
            });
            console.log(`Message sent ${info.messageId}`);
            return true
        } 
        catch (err) {
            console.log(err);
        }
        return false
    }
}