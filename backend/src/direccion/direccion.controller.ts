import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DireccionService } from './direccion.service';

@Controller('direccion')
export class DireccionController {
  constructor(private readonly direccionService: DireccionService) {}

}
