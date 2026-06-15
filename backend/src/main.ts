import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // elimina campos no declarados en el DTO
      forbidNonWhitelisted: true, // lanza 400 si llegan campos extra
      transform: true,           // convierte tipos automáticamente
    }),
  );

  app.enableCors({
    origin: 'http://localhost:5173', // Vite dev server
  });

  await app.listen(3000);
}

bootstrap();