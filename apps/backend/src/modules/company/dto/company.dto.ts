import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
