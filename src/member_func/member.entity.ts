import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Member {
    @PrimaryGeneratedColumn('increment')
    memberId: number;

    @Column({ unique: true, length: 100 })
    userName: string;

    @Column({ length: 150 })
    password: string;

    @Column({ length: 500 })
    address: string;

    @Column({ type: 'date' })
    DOB: Date;

    @Column({ length: 500 })
    skills: string;
}