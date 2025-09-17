import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initApp } from './app.init'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  initApp(app); 

  await app.listen(3000);
}
bootstrap();