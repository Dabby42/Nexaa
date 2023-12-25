import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Query, NotFoundException } from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { sendSuccess } from "../utils/helpers/response.helpers";
import { JwtGuard } from "../auth/auth.jwt.guard";
import { PostQueryDto } from "./dto/post-query.dto";

@ApiBearerAuth("jwt")
@ApiTags("Post")
@Controller("v1/post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createPost(@Body() createPostDto: CreatePostDto, @Request() req) {
    const data = await this.postService.createPost(req.user.id, createPostDto);
    return sendSuccess(data, "Post created successfully.");
  }

  @UseGuards(JwtGuard)
  @ApiQuery({ name: "limit", type: "number", required: false })
  @ApiQuery({ name: "page", type: "number", required: false })
  @Get()
  async getAllPosts(@Query() postQueryDto: PostQueryDto) {
    const posts = await this.postService.getAllPosts(postQueryDto);
    return sendSuccess(posts, "All user posts retrieved successfully.");
  }

  @UseGuards(JwtGuard)
  @Get(":id")
  async getOnePost(@Param("id") id: string) {
    const post = await this.postService.getOnePost(+id);
    if (!post) throw new NotFoundException("Post not found.");
    return sendSuccess(post, "Post retrieved successfully.");
  }

  @UseGuards(JwtGuard)
  @Patch(":id")
  async updatePost(@Param("id") id: string, @Body() updatePostDto: UpdatePostDto) {
    await this.postService.updatePost(+id, updatePostDto);
    return sendSuccess(null, "Post updated successfully");
  }

  @UseGuards(JwtGuard)
  @Delete(":id")
  async removePost(@Param("id") id: string) {
    await this.postService.removePost(+id);
    return sendSuccess(null, "Post deleted successfully.");
  }
}
