import { Controller, Get, Post, Body, Patch, Param, Delete, Put, HttpCode, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { Reserva } from './entities/reserva.entity';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Roles } from 'src/Guards/roles.decorator';
import { JwtAuthGuard } from 'src/Guards/jwt-auth.guard';
import { RolesGuard } from 'src/Guards/roles.guard';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) { }

  @Post('pago')
  @HttpCode(200)
  async reservaPago(@Body() body: any) {
    return this.reservasService.crearReservaPago(body);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('cliente')
  crear(@Body() data: CreateReservaDto, @Req() req: RequestWithUser) {
    return this.reservasService.crear(data, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cliente')
  findAll(@Req() req: RequestWithUser): Promise<Reserva[]> {
    return this.reservasService.findAll(req.user);
  }

  @Get('escenario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAllByEscenarios(@Req() req: RequestWithUser): Promise<Partial<Reserva>[]> {
    return this.reservasService.findByReservaEscenario(req.user);
  }


  @Get('cancha/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cliente')
  findByEscenario(@Param('id') id: string, @Req() req: RequestWithUser): Promise<Reserva[]> {
    return this.reservasService.findByCancha(id, req.user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdateReservaDto, @Req() req: RequestWithUser) {
    return this.reservasService.update(id, dto, req.user);
  }

  @Get('pendientes/contador')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getPendientesCount(@Req() req: RequestWithUser) {
    return this.reservasService.contarPorEstado('pendiente', req.user);
  }
}
