import { IsOptional, IsString } from "class-validator";

export class CreateDireccionDto {
    @IsString()
    barrio: string;

    @IsString()
    comuna: string;

    @IsString()
    calle: string;

    @IsOptional()
    @IsString()
    numero?: string;
}
