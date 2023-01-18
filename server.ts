import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { config } from 'app/config/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({logger: true})
  );

  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging') {
    const documentOptions = new DocumentBuilder()
      .setTitle('Hera')
      .setDescription('Konga hera service')
      .setVersion('v1')
      .build();
    const document = SwaggerModule.createDocument(app, documentOptions);
    SwaggerModule.setup('docs', app, document);
  }

  app.enableCors({
    origin: ['127.0.0.1', '*', '/\.konga\.com$/', '/\.igbimo\.com$/']},
  );
  app.use(helmet());
  app.setGlobalPrefix('v1');

  const PORT: any = config.web.port;

  await app.listen(PORT, '0.0.0.0');
}
bootstrap();
