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
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", "0");
    return {
      url,
      statusCode: 301,
    };
  }
}
