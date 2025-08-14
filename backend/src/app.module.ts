import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { PersonaModule } from './persona/persona.module';
import { EscenarioModule } from './escenario/escenario.module';
import { HorariosModule } from './horarios/horarios.module';
import { ReservasModule } from './reservas/reservas.module';
import { UsuarioModule } from './usuario/usuario.module';
import { DireccionModule } from './direccion/direccion.module';
import { AuthModule } from './auth/auth.module';
import { PagoReservaModule } from './pago-reserva/pago-reserva.module';
import { CanchaModule } from './cancha/cancha.module';

@Module({
  imports: [
    DatabaseModule, 
    PersonaModule, 
    EscenarioModule, 
    HorariosModule, 
    ReservasModule, 
    UsuarioModule, 
    DireccionModule, 
    AuthModule, 
    PagoReservaModule, 
    CanchaModule
  ],
})
export class AppModule {}
