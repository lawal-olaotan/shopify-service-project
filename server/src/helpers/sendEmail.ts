

import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path';
import dotenv from "dotenv"
import { MailItem } from '../interface';

dotenv.config();


export const Mailer = () => {

    // function generates 
    const generateHtmlContent = (name:string,orderId:number)=> {
        let htmlTemplate  = fs.readFileSync(path.resolve(__dirname, '../template/email.html'), 'utf-8');
        htmlTemplate = htmlTemplate.replace('{{name}}',name)
        const client_url = process.env.CLIENT_URL
        htmlTemplate = htmlTemplate.replace('{{client_url}}',`${client_url}?orderId=${orderId}`);
        return htmlTemplate
    }

     const prepareTransport = () => {

        const mailTransporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            secure:true,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        } as nodemailer.TransportOptions);

        return mailTransporter

     }
    

    const prepareEmail = (emailObject:MailItem) => {
        const {name,orderId,email} = emailObject
        const htmlContent = generateHtmlContent(name,orderId);

            const mailOptions: nodemailer.SendMailOptions = {
            from: process.env.MAIL_FROM,
            to:email,
            subject: 'Your Ring Sizing Kit is on its Way!',
            html: htmlContent
        };

        return mailOptions

    }

    const sendEmail = (emailObject:MailItem) => {

        const mailTransporter = prepareTransport();
        const mailOptions = prepareEmail(emailObject);

        const EmailSendingStatus = mailTransporter.sendMail(mailOptions, (error) => {
            if (error) throw new Error(error.message)
            return true 
        });

        return EmailSendingStatus

    }

    return {
        sendEmail
    }


}