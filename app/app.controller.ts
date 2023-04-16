import { Controller, Get, Param, Redirect, Req, Res } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/:uuid")
  @Redirect()
  async redirectToUrl(@Param("uuid") uuid: string, @Res() res, @Req() req: Request) {
    const url = await this.appService.redirectToUrl(uuid, req);

    return {
      url,
      statusCode: 301,
    };
  }
}
