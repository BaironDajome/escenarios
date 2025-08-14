import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { EscenarioService } from './escenario.service';
import { CreateEscenarioDto } from './dto/create-escenario.dto';
import { JwtAuthGuard } from 'src/Guards/jwt-auth.guard';
import { RolesGuard } from 'src/Guards/roles.guard';
import { Roles } from 'src/Guards/roles.decorator';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';

@Controller('escenario')
export class EscenarioController {
  constructor(private readonly escenarioService: EscenarioService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  crearEscenarios(@Body() data: CreateEscenarioDto | CreateEscenarioDto[], @Req() req: RequestWithUser) {
    return this.escenarioService.crear(data,req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('cliente')
  obtenerTodos(@Req() req: RequestWithUser) {
    return this.escenarioService.obtenerTodos(req.user);
  }

}
