import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @Column()
  @IsBoolean()
  public isEmailVerified: boolean;

  @Column()
  @IsNotEmpty()
  @IsString()
  public firstname: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  public lastname: string;

  @Column({ nullable: true })
  @IsString()
  public phone: string | null;

  @Column()
  @Exclude()
  @IsNotEmpty()
  public password: string;
}
