import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from '../usuario/usuario.service';
import { CanchaService } from 'src/cancha/cancha.service';

@Injectable()
export class AuthService {
    constructor(
        private usuarioService: UsuarioService,
        private jwtService: JwtService,
        private readonly canchaService: CanchaService,
    ) { }

    async validarUsuario(email: string, password: string) {
        const usuario = await this.usuarioService.obtenerUsuarioPorCorreo(email);
        if (usuario && await bcrypt.compare(password, usuario.password)) {
            const { password, ...rest } = usuario;
            return rest;
        }
        throw new UnauthorizedException('Credenciales inválidas');
    }

    async login(usuario: any) {
        const payload = {
            email: usuario.email,
            sub: usuario.id,
            tipo: usuario.tipo,
        };

        const escenariosConCanchas = await Promise.all(
            (usuario.escenarios ?? []).map(async (e) => ({
                id: e.id,
                nombre: e.nombre,
                descripcion: e.descripcion,
                canchas: await this.canchaService.canchasEscenario(e.id),
            }))
        );

        return {
            token: this.jwtService.sign(payload),
            usuario: {
                id: usuario.id,
                email: usuario.email,
                nombre: usuario.persona?.nombres ?? null,
                apellido: usuario.persona?.apellidos ?? null,
                tipo: usuario.tipo,
                cantidad_reserva: usuario.cantidad_reserva ?? 0,
                escenario: escenariosConCanchas,
            },
        };
    }

}
