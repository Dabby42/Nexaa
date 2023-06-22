import { BadRequestException, CallHandler, ExecutionContext, Injectable, InternalServerErrorException, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
//import {sendError} from "../utils/helpers/response.helpers";
import { FastifyRequest } from "fastify";
//import {sendError} from "../utils/helpers/response.helpers";

@Injectable()
export class FileFilterInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const resp = await request.file();
    if (resp.mimetype !== "text/csv") {
      throw new BadRequestException("Only CSV files are allowed");
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    request["file"] = resp.file;
    return next.handle();
  }
}
