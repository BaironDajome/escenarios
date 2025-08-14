import { IsOptional, IsString, IsIn, IsNotEmpty } from 'class-validator';
export class UpdateCanchaDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  nombre?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'La ubicación no puede estar vacía' })
  ubicacion?: string;

  @IsOptional()
  @IsIn(['disponible', 'ocupada', 'mantenimiento'], {
    message: 'El estado debe ser: disponible, ocupada o mantenimiento',
  })
  estado?: string;
}

