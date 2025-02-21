import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public email: string;
}

export class FindUserDto {
  @IsString()
  @IsNotEmpty()
  public id: string;
}
