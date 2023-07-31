import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateNewsDto } from "./dto/create-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { News } from "./entities/news.entity";
import { Repository } from "typeorm";
import { Admin } from "../user/entities/admin.entity";
import { CacheService } from "../cache/cache.service";

@Injectable()
export class NewsService {
  private readonly cacheKeyBase: string;
  constructor(@InjectRepository(News) private readonly newsRepository: Repository<News>, private cacheService: CacheService) {
    this.cacheKeyBase = "NEWS_";
  }
  async create(createNewsDto: CreateNewsDto, publisher: Admin) {
    const news = await this.newsRepository.create({ ...createNewsDto, publisher });
    await this.newsRepository.save(news);
    this.cacheService.refresh(this.cacheKeyBase);
  }

  async update(id: number, updateNewsDto: UpdateNewsDto) {
    const data = await this.newsRepository.update(id, updateNewsDto);
    if (data.affected === 0) throw new BadRequestException("Update could not be performed.");
    this.cacheService.refresh(this.cacheKeyBase);
  }

  async delete(id: number) {
    const data = await this.newsRepository.delete(id);
    if (data.affected === 0) throw new NotFoundException("News not found.");
    this.cacheService.refresh(this.cacheKeyBase);
  }

  async getMany(page: number, limit: number) {
    return this.cacheService.cachedData(`${this.cacheKeyBase}${page}_${limit}`, async () => {
      const query = this.newsRepository
        .createQueryBuilder("news")
        .select(["`news`.*", "CONCAT(publisher.first_name, ' ', publisher.last_name) AS publisher"])
        .leftJoin("news.publisher", "publisher")
        .skip((page - 1) * limit)
        .limit(limit)
        .orderBy("news.created_at", "DESC");
      const count = await query.getCount();
      const news = await query.getRawMany();

      const pages = Math.ceil(count / limit);

      return {
        news,
        count,
        current_page: page,
        pages,
      };
    });
  }
}
