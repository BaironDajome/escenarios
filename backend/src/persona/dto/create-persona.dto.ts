import { Type } from "class-transformer";
import { IsString, ValidateNested } from "class-validator";
import { CreateDireccionDto } from "src/direccion/dto/create-direccion.dto";

export class CreatePersonaDto {
    @IsString()
    nombres: string;

    @IsString()
    apellidos: string;

    @IsString()
    documento: string;

    @IsString()
    telefono: string;

    @ValidateNested()
    @Type(() => CreateDireccionDto)
    direccion: CreateDireccionDto;
}
