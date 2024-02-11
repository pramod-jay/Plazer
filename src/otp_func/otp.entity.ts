import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Otp {
    @PrimaryGeneratedColumn('increment')
    otpId: number;

    @Column({ length: 10 })
    type: string;

    @Column({ length: 100 })
    recipient: string;

    @Column({ length: 150 })
    otp: string;
}