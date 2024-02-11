import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Member } from "./member.entity";
import { MemberService } from "./member.service";
import { MemeberController } from "./member.controller";

@Module({
    imports:[TypeOrmModule.forFeature([Member])],
    providers: [MemberService],
    controllers: [MemeberController],
    exports: [TypeOrmModule]
})

export class MemberModule {}