import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  memberIds: string[];
}
