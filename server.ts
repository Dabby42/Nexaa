import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  // if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "staging") {
  //
  // }
  const documentOptions = new DocumentBuilder()
    .setTitle("Hera Docs")
    .setDescription("Konga Hera service for Affiliate")
    .setVersion("v1")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "jwt"
    )
    .build();
  const document = SwaggerModule.createDocument(app, documentOptions);
  SwaggerModule.setup("docs", app, document);
  app.enableCors();
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );

  await app.listen(9000,"0.0.0.0");
}
bootstrap();
