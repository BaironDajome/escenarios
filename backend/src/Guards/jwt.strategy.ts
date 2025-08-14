import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          return req?.cookies?.token || null; // ⬅️ Extrae token de la cookie
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: 'clave_secreta', // Usa tu clave segura aquí
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      tipo: payload.tipo,
    };
  }
}
