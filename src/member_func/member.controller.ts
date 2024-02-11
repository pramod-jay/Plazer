import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { Response } from 'express';
import { MemberService } from "./member.service";
import { Member } from "./member.entity";

@Controller('member')
export class MemeberController {

    constructor(private memberService: MemberService) { }

    //Controller for Member Registartion
    @Post('memberReg')
    createMember(@Body() member: Member, @Res() response: Response) {
        return this.memberService.createMember(member, response);
    }

    //Controlle for Member Login
    @Get('memberLogin')
    loginMember(@Query() userName: Member, @Body() password: Member, @Res() response: Response) {
        return this.memberService.loginMember(userName, password, response);
    }
}