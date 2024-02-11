import { Body, Controller, Get, Post, Put, Query, Res } from "@nestjs/common";
import { OtpService } from "./otp.service";
import { Otp } from "./otp.entity";
import { Response } from "express";

@Controller('otp')
export class OtpController {
    constructor(private otpService: OtpService) { }

    //Controller for send new OTP
    @Get('sendMailOtp')
    sendMailOtp(@Query() recipient: Otp, @Res() response: Response) {
        return this.otpService.sendMailOtp(recipient, response);
    }

    //Controller for resend OTP
    @Put('resendMailOtp')
    resendMailOtp(@Query() otpId: Otp, @Res() response: Response) {
        return this.otpService.resendMaitOtp(otpId, response);
    }

    //Controller for verify OTP
    @Post('verifyOtp')
    verifyOtp(@Body() otp: Otp, @Res() response: Response){
        return this.otpService.verifyOtp(otp, response);
    }
}