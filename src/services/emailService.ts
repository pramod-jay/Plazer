import { HttpStatus } from "@nestjs/common";

const nodemailer = require('nodemailer');

//Email configurations 
export class MailService {
    constructor(to: string, subject: string, html: string) {
        this.mailDetails.to = to;
        this.mailDetails.subject = subject;
        this.mailDetails.html = html;
    }

    async sendMail(): Promise<number> {
        this.mailTransporter.verify(function (error, success) {
            if (error) {
                console.log(error);
                return HttpStatus.INTERNAL_SERVER_ERROR;
            } 
        })

        let result = await this.mailTransporter.sendMail(this.mailDetails);

        if(result.accepted!=null){
            return HttpStatus.ACCEPTED;
        }else{
            return HttpStatus.NOT_ACCEPTABLE;
        }   
    }

    private mailDetails = {
        name: 'Plazer',
        from: 'plazer456@gmail.com',
        to: '',
        subject: '',
        html: ''
    }

    private mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'plazer456@gmail.com',
            pass: 'rqam nixs vfcm qaso'
        }
    });
}