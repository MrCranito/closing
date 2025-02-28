import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  lastname?: string;

  @IsString()
  @IsNotEmpty()
  firstname?: string;

  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(6)
  password?: string;
}
