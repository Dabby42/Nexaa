if (process.env.NEW_RELIC_APP_NAME !== undefined && process.env.NEW_RELIC_LICENSE_KEY !== undefined) {
  try {
    require("newrelic");
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
}

import { NestFactory } from "@nestjs/core";
import { AppModule } from "app/app.module";
import { NestFastifyApplication } from "@nestjs/platform-fastify";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import { config } from "app/config/config";
import { ValidationPipe } from "@nestjs/common";
import { FastifyMulterAdapter } from "./fastify-multer-adapter";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyMulterAdapter());
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "staging") {
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
  }

  app.enableCors();
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );

  const PORT: any = config.web.port;

  await app.listen(PORT, "0.0.0.0");
}
bootstrap();
