import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  public name: string;

  @Column({ nullable: true })
  @IsString()
  public email: string | null;

  @Column({ nullable: true })
  @IsString()
  public phone: string | null;

  @Column({ nullable: true })
  @IsString()
  public address: string | null;

  @Column()
  @Exclude()
  @IsNotEmpty()
  public ownerId: string;
}
