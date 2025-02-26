import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true })
  @IsNotEmpty({})
  @IsEmail()
  public email: string;

  @Column({ nullable: true })
  @IsBoolean()
  public isEmailVerified: boolean;

  @Column({ nullable: true })
  @IsString()
  public firstname: string | null;

  @Column({ nullable: true })
  @IsString()
  public lastname: string | null;

  @Column({ nullable: true })
  @IsString()
  public phone: string | null;

  @Column()
  @Exclude()
  @IsNotEmpty()
  public password: string;
}
