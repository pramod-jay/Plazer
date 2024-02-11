import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MemberModule } from './member_func/member.module';
import { Member } from './member_func/member.entity';

import { OtpModule } from './otp_func/otp.module';
import { Otp } from './otp_func/otp.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'plazer-app.postgres.database.azure.com',
      port: 5432,
      username: 'PlazerAdmin',
      database: 'plazer_db',
      password: 'tms0920#',
      entities: [Member, Otp],
      synchronize: true,
      ssl: true
    }),
    MemberModule,
    OtpModule
  ]

})
export class AppModule { }
