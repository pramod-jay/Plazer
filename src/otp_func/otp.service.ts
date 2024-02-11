import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Otp } from "./otp.entity";
import { Repository } from "typeorm";
import { Response } from "express";
import { MailService } from "src/services/emailService";
import * as bcrypt from 'bcrypt';
import { MobileService } from "src/services/mobileService";


const saltOrRound = 10;

@Injectable()
export class OtpService {
    constructor(@InjectRepository(Otp) private otpRepository: Repository<Otp>) { }

    //Function for send OTP to the user entered Email
    async sendMailOtp(recipient: Otp, response: Response) {
        try {
            const otp = Math.floor(1000 + Math.random() * 9000);

            //Send recipient data to the email configuation class
            let mailService = new MailService(recipient.recipient, 'Plazer verification', `<h3>Hello</h3>\n<h4>This is your verfication code: ${otp}</h4>`);

            let result = await mailService.sendMail();

            switch (result) {
                case HttpStatus.ACCEPTED:
                    const hashedOtp = await bcrypt.hash(String(otp), saltOrRound);

                    recipient.otp = hashedOtp;
                    recipient.type = 'email';
                    let resultFromDb = await this.otpRepository.save(recipient);

                    //OTP automatically delete from DB after 5 mins
                    setTimeout(() => {
                        this.otpRepository.remove(resultFromDb);
                    }, 5 * 60 * 1000);

                    return response.status(HttpStatus.ACCEPTED).send(`OTP has been sent successfully to ${recipient.recipient}\nOTP ID: ${resultFromDb.otpId}`);
                case HttpStatus.NOT_ACCEPTABLE:
                    return response.status(HttpStatus.NOT_ACCEPTABLE).send("Please recheck you entered email");
                default:
                    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send("Internal server error");
            }
        } catch (error) {
            console.log(error);
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send("Internal server error");
        }
    }

    //Function for resend OTP to the user entered Email
    async resendMaitOtp(otpId: Otp, response: Response) {
        try {
            let resultFromDb = await this.otpRepository.findOne({ where: { otpId: otpId.otpId } });
            if (resultFromDb != null) {
                const otp = Math.floor(1000 + Math.random() * 9000);

                //Send recipient data to the email configuation class
                let mailService = new MailService(resultFromDb.recipient, 'Plazer verification', `<h3>Hello</h3>\n<h4>This is your verfication code: ${otp}</h4>`);

                let result = await mailService.sendMail();

                switch (result) {
                    case HttpStatus.ACCEPTED:
                        const hashedOtp = await bcrypt.hash(String(otp), saltOrRound);

                        otpId.otp = hashedOtp;

                        resultFromDb = this.otpRepository.merge(resultFromDb, otpId);

                        //OTP automatically delete from DB after 5 mins
                        setTimeout(() => {
                            this.otpRepository.remove(resultFromDb);
                        }, 5 * 60 * 1000);

                        return response.status(HttpStatus.ACCEPTED).send(`OTP has been sent successfully to ${resultFromDb.recipient}\nOTP ID: ${resultFromDb.otpId}`);

                    case HttpStatus.NOT_ACCEPTABLE:
                        return response.status(HttpStatus.NOT_ACCEPTABLE).send("Please recheck you entered email");
                    default:
                        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send("Internal server error");
                }
            } else {
                return response.status(HttpStatus.REQUEST_TIMEOUT).send("Cannot resend due to the time exceed");
            }
        } catch (error) {
            console.log(error);
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send("Internal server error");
        }
    }

    //Function for verify OTP
    async verifyOtp(otp: Otp, response: Response) {
        try {
            let resultFromDb = await this.otpRepository.findOne({ where: { otpId: otp.otpId } });
            if (resultFromDb != null) {
                const isMatch = await bcrypt.compare(otp.otp, resultFromDb.otp);
                if(isMatch){
                    await this.otpRepository.delete(resultFromDb);
                    return response.status(HttpStatus.ACCEPTED).send("OTP verified");
                }else{
                    return response.status(HttpStatus.NOT_FOUND).send("OTP mismatched");
                }
            } else {
                return response.status(HttpStatus.REQUEST_TIMEOUT).send("Cannot verify OTP due to the time exceed");
            }
        } catch (error) {
            console.log(error);
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send("Internal server error");
        }
    }
}