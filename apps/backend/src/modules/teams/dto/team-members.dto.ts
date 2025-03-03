import { IsArray, IsUUID } from 'class-validator';

export class TeamMembersDto {
  @IsArray()
  @IsUUID('4', { each: true })
  memberIds: string[];
}
