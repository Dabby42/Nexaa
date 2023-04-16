import { Injectable } from "@nestjs/common";
import { LinksService } from "./links/links.service";
@Injectable()
export class AppService {
  constructor(private linkService: LinksService) {}
  getHello(): string {
    return "Hello World!";
  }

  async redirectToUrl(uuid, req) {
    return await this.linkService.recordClicks(uuid, req);
  }
}
