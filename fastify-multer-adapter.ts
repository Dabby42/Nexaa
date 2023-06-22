import { FastifyAdapter } from "@nestjs/platform-fastify";
import { MulterStorage } from "multer";
import * as fastifyMulter from "fastify-multer";
import { Logger } from "@nestjs/common";
import { MulterOptions } from "multer";
import { FastifyInstance } from "fastify";
import fastifyMultipart from "@fastify/multipart";

export class FastifyMulterAdapter extends FastifyAdapter {
  private readonly logger = new Logger("FastifyMulterAdapter");

  constructor() {
    super();
    this.registerMulter();
    this.addLogger();
  }

  private registerMulter() {
    const multerOptions: MulterOptions = {
      storage: fastifyMulter.memoryStorage(),
    };

    const fastifyInstance: FastifyInstance = this.getInstance();
    fastifyInstance.decorateRequest("multer", fastifyMulter(multerOptions));

    fastifyInstance.register(fastifyMultipart, {
      limits: {
        fileSize: 1048576, // Adjust the file size limit as needed
      },
    });
  }

  createMulterOptions(): MulterStorage {
    return fastifyMulter.memoryStorage();
  }

  private addLogger() {
    this.getInstance().addHook("onRequest", (request, reply, done) => {
      this.logger.log(`${request.method} ${request.url}`);
      done();
    });
  }
}
