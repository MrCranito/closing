import { IsEmail, IsNotEmpty } from 'class-validator';
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

  @Column()
  @IsNotEmpty({})
  public firstname: string;

  @Column()
  @IsNotEmpty({})
  public lastname: string;

  @Column()
  @Exclude()
  @IsNotEmpty({})
  public password: string;
}
