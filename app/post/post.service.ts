import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "./entities/post.entity";
import { Repository } from "typeorm";
import { CacheService } from "../cache/cache.service";
import { PostQueryDto } from "./dto/post-query.dto";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class PostService {
  private readonly cacheKeyBase: string;

  constructor(@InjectRepository(Post) private postRepository: Repository<Post>, private cacheService: CacheService) {
    this.cacheKeyBase = "POST_";
  }
  async createPost(id: number, createPostDto: CreatePostDto) {
    const newPost = this.postRepository.create({ ...createPostDto, user_id: { id } });
    return await this.postRepository.save(newPost);
  }

  async getAllPosts(queryPostDto: PostQueryDto) {
    const { page, limit } = queryPostDto;
    return this.cacheService.cachedData(`${this.cacheKeyBase}${page}_${limit}`, async () => {
      const query = this.postRepository
        .createQueryBuilder("posts")
        .select(["posts.*", "CONCAT(user.first_name, ' ', user.last_name) AS user"])
        .leftJoin("posts.user_id", "user")
        .skip((+page - 1) * +limit)
        .limit(+limit)
        .orderBy("posts.created_at", "DESC");
      const count = await query.getCount();
      const posts = await query.getRawMany();

      const pages = Math.ceil(count / +limit);

      return {
        posts,
        count,
        current_page: page,
        pages,
      };
    });
  }

  async getOnePost(id: number) {
    let key = this.cacheKeyBase;
    key += id;
    return this.cacheService.cachedData(key, async () => {
      const post = await this.postRepository.findOne({
        where: { id },
      });

      if (!post) return null;
      return post;
    });
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto) {
    const data = await this.postRepository.update(id, updatePostDto);
    if (data.affected === 0) throw new BadRequestException("Update could not be performed.");
    await this.cacheService.refresh(this.cacheKeyBase);
  }

  async removePost(id: number) {
    const data = await this.postRepository.delete(id);
    if (data.affected === 0) throw new NotFoundException("Post not found.");
    await this.cacheService.refresh(this.cacheKeyBase);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async sendOutPost() {
    const currentDate = Date();

    const scheduledPosts = await this.postRepository
      .createQueryBuilder("posts")
      .select(["posts.*", "CONCAT(user.first_name, ' ', user.last_name) AS user"])
      .leftJoin("posts.user_id", "user")
      .where("`updated_at` = (:currentDate)", { currentDate })
      .getRawMany();

    scheduledPosts.forEach((post) => {
      // Implement logic to publish the post
      // eslint-disable-next-line no-console
      console.log(`Publishing post: ${post.body} at ${post.publication_time}`);
    });
  }
}
