import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as compression from 'compression';
import { config } from 'process';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService); 

  // Seguridad y rendimiento
  // app.use(helmet());
  // app.use(compression());

  // Cookies
  app.use(cookieParser());

  // Body parser
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Habilitar CORS con credenciales y orígenes permitidos

  const isProduccion = configService.get('produccion') === true;

  const origenFrontend = isProduccion
  ? configService.get('DOMINIO_FRONTEND')
  : 'http://localhost:5173';

  app.enableCors({
    origin: origenFrontend,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server running on ${port} modo: ${ isProduccion ? "Produccion" : "Desarrollo" }`);
}
bootstrap();
