import { IsEmail, IsNotEmpty } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  @Exclude()
  @IsNotEmpty({})
  public password: string;

  @Column({ unique: true })
  @IsNotEmpty({})
  @IsEmail()
  public email: string;

  @Column({ default: false })
  public isEmailConfirmed: boolean;

  public token?: string;
}
