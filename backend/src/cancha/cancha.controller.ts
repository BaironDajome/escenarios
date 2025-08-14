import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put } from '@nestjs/common';
import { CanchaService } from './cancha.service';
import { JwtAuthGuard } from 'src/Guards/jwt-auth.guard';
import { RolesGuard } from 'src/Guards/roles.guard';
import { Roles } from 'src/Guards/roles.decorator';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { UpdateCanchaDto } from './dto/update-cancha.dto';

@Controller('cancha')
export class CanchaController {
  constructor(private readonly canchaService: CanchaService) { }

  @Get('una/:escenario_id')
  obtenerUnaCanchaPorEscenario(@Param('escenario_id') escenario_id: string) {
    return this.canchaService.obtenerUnaCanchaInicial(escenario_id);
  }

  @Get('una')
  obtenerPrimeraCancha() {
    return this.canchaService.obtenerUnaCanchaInicial();
  }

  @Get('escenario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  obtenerCanchaEscenario(@Req() req: RequestWithUser) {
    return this.canchaService.obtenerCanchasPorEscenario(req.user);
  }

  @Get()
  obtenerCanchas() {
    return this.canchaService.obtenerCanchas();
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdateCanchaDto, @Req() req: RequestWithUser) {
    return this.canchaService.update(id, dto, req.user);
  }

  @Put('eliminar/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  eliminar(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.canchaService.EliminadoLogico(id, req.user);
  }
}
