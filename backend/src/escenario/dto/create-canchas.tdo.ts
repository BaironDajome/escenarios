// src/escenario/dto/create-escenario.dto.ts
import { IsIn, IsString } from 'class-validator';

export class CreateCanchaDto {
    @IsString()
    nombre: string;

    @IsString()
    @IsIn(['activo', 'inactivo', 'mantenimiento'], {
        message: 'El estado debe ser activo, inactivo o mantenimiento',
    })
    estado: string;
}