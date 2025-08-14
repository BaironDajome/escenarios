import { IsEmail, IsString, MinLength, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePersonaDto } from 'src/persona/dto/create-persona.dto';

export class CreateUsuarioDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @ValidateNested()
  @Type(() => CreatePersonaDto)
  persona: CreatePersonaDto;
}

