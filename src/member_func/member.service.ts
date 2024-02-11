import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Member } from "./member.entity";
import { Repository } from "typeorm";
import { Response } from 'express';
import * as bcrypt from 'bcrypt';


const saltOrRound = 10;


@Injectable()
export class MemberService {
    constructor(@InjectRepository(Member) private memberRepository: Repository<Member>) { }

    //Function for member register
    async createMember(member: Member, response: Response) {
        try {
            let result = await this.memberRepository.findOne({ where: { userName: member.userName } });
            if (result == null) {
                const hashedPassword = await bcrypt.hash(member.password, saltOrRound);
                member.password = hashedPassword;
                result = await this.memberRepository.save(member);
                console.log(result);
                return response.status(HttpStatus.ACCEPTED).send("User has been created");
            } else {
                return response.status(HttpStatus.CONFLICT).send("User already registered")
            }
        } catch (error) {
            console.log(error);
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send("Internal server error");
        }
    }

    //Function for member login
    async loginMember(userName: Member, password: Member, response: Response) {
        try {
            let result = await this.memberRepository.findOne({ where: { userName: userName.userName } });
            if (result == null) {
                return response.status(HttpStatus.NOT_FOUND).send("User not registered");
            } else {
                const isMatch = await bcrypt.compare(password.password, result.password);
                if (isMatch) {
                    return response.status(HttpStatus.ACCEPTED).send("Login successfull");
                } else {
                    return response.status(HttpStatus.UNAUTHORIZED).send("User Name and Password mismatched");
                }
            }
        } catch (error) {
            console.log(error);
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send("Internal server error");
        }
    }
}