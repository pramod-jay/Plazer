import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Otp } from "./otp.entity";
import { OtpService } from "./otp.service";
import { OtpController } from "./otp.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Otp])],
    providers: [OtpService],
    controllers: [OtpController],
    exports: [TypeOrmModule]
})

export class OtpModule {}