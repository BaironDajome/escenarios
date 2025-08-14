import { Controller, Get, Post, Body, HttpStatus, HttpCode, UseGuards, Req } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { JwtAuthGuard } from 'src/Guards/jwt-auth.guard';
import { RolesGuard } from 'src/Guards/roles.guard';
import { Roles } from 'src/Guards/roles.decorator';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';

@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService
  ) { }

  // @Post('login')
  // async login(@Body() dto: LoginDto) {
  //   return this.usuarioService.login(dto.email, dto.password);
  // }

  @Post('registro')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cliente')
  async obtenerUsuarioActual(@Req() req: RequestWithUser) {
    return this.usuarioService.obtenerUsuarioActualizado(req.user);
  }

}
