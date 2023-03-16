import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateNewsDto } from "./dto/create-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { News } from "./entities/news.entity";
import { Repository } from "typeorm";
import { User } from "../user/entities/user.entity";

@Injectable()
export class NewsService {
  constructor(@InjectRepository(News) private readonly newsRepository: Repository<News>) {}
  async create(createNewsDto: CreateNewsDto, publisher: User) {
    const news = await this.newsRepository.create({ ...createNewsDto, publisher });
    await this.newsRepository.save(news);
  }

  async update(id: number, updateNewsDto: UpdateNewsDto) {
    const data = await this.newsRepository.update(id, updateNewsDto);
    if (data.affected === 0) throw new BadRequestException("Update could not be performed.");
  }

  async delete(id: number) {
    const data = await this.newsRepository.delete(id);
    if (data.affected === 0) throw new NotFoundException("News not found.");
  }
}
