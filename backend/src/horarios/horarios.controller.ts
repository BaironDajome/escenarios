import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HorariosService } from './horarios.service';
import { CreateSemanaDto } from './dto/create-semana.dto';

@Controller('horarios')
export class HorariosController {
  constructor(private readonly horariosService: HorariosService) { }
  
  @Post()
  crear(@Body() data: CreateSemanaDto) {
    return this.horariosService.crear(data);
  }
}
