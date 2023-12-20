import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, NotFoundException, Query } from "@nestjs/common";
import { WorkService } from "./work.service";
import { CreateWorkDto } from "./dto/create-work.dto";
import { UpdateWorkDto } from "./dto/update-work.dto";
import { sendSuccess } from "../utils/helpers/response.helpers";
import { JwtGuard } from "../auth/auth.jwt.guard";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { WorkQueryDto } from "./dto/work-query.dto";

@ApiBearerAuth("jwt")
@ApiTags("Work")
@Controller("v1/work")
export class WorkController {
  constructor(private readonly workService: WorkService) {}
  @UseGuards(JwtGuard)
  @Post()
  async createWork(@Body() createWorkDto: CreateWorkDto, @Request() req) {
    const data = await this.workService.createWork(req.user.id, createWorkDto);
    return sendSuccess(data, "Work added successfully.");
  }

  @UseGuards(JwtGuard)
  @ApiQuery({ name: "limit", type: "number", required: false })
  @ApiQuery({ name: "page", type: "number", required: false })
  @Get()
  async getAllWorks(@Query() workQueryDto: WorkQueryDto) {
    const works = await this.workService.getAllWorks(workQueryDto);
    return sendSuccess(works, "All user works retrieved successfully.");
  }

  @UseGuards(JwtGuard)
  @Get(":id")
  async getWork(@Param("id") id: string) {
    const data = await this.workService.getWork(+id);
    if (!data) throw new NotFoundException("Work not found.");
    return sendSuccess(data, "Work retrieved successfully.");
  }

  @UseGuards(JwtGuard)
  @Patch(":id")
  async updateWork(@Param("id") id: string, @Body() updateWorkDto: UpdateWorkDto) {
    await this.workService.updateWork(+id, updateWorkDto);
    return sendSuccess(null, "Work updated successfully");
  }

  @UseGuards(JwtGuard)
  @Delete(":id")
  async removeWork(@Param("id") id: string) {
    await this.workService.removeWork(+id);
    return sendSuccess(null, "Work deleted successfully.");
  }
}
