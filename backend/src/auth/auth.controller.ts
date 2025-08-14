import { Controller, Post, Body, UseGuards, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/Guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response
  ) {
    const user = await this.authService.validarUsuario(body.email, body.password);
    const { token, usuario } = await this.authService.login(user);
    const isProduccion = this.configService.get('produccion');

    // Establecer el token JWT en una cookie segura
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduccion, // en producción: true con HTTPS producccion true local false
      sameSite: isProduccion ? 'none' : 'lax', // o 'none' si usas distintos dominios y HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    });

    return { usuario };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard) // opcional, si quieres proteger el logout solo para usuarios autenticados
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token'); 
    return { message: 'Sesión cerrada correctamente' };
  }
}
