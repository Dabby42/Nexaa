import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateWorkDto } from "./dto/create-work.dto";
import { UpdateWorkDto } from "./dto/update-work.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Work } from "./entities/work.entity";
import { Repository } from "typeorm";
import { CacheService } from "../cache/cache.service";
import { WorkQueryDto } from "./dto/work-query.dto";

@Injectable()
export class WorkService {
  private readonly cacheKeyBase: string;

  constructor(@InjectRepository(Work) private workRepository: Repository<Work>, private cacheService: CacheService) {}
  async createWork(id: number, createWorkDto: CreateWorkDto) {
    const newWork = this.workRepository.create({ ...createWorkDto, user_id: { id } });
    return await this.workRepository.save(newWork);
  }

  async getAllWorks(queryWorkDto: WorkQueryDto) {
    const { page, limit } = queryWorkDto;
    return this.cacheService.cachedData(`${this.cacheKeyBase}${page}_${limit}`, async () => {
      const query = this.workRepository
        .createQueryBuilder("works")
        .select(["works.*", "CONCAT(user.first_name, ' ', user.last_name) AS user"])
        .leftJoin("works.user_id", "user")
        .skip((+page - 1) * +limit)
        .limit(+limit)
        .orderBy("works.created_at", "DESC");
      const count = await query.getCount();
      const works = await query.getRawMany();

      const pages = Math.ceil(count / +limit);

      return {
        works,
        count,
        current_page: page,
        pages,
      };
    });
  }

  getWork(id: number) {
    let key = this.cacheKeyBase;
    key += id;
    return this.cacheService.cachedData(key, async () => {
      const work = await this.workRepository.findOne({
        where: { id },
      });

      if (!work) return null;
      return work;
    });
  }

  async updateWork(id: number, updateWorkDto: UpdateWorkDto) {
    const data = await this.workRepository.update(id, updateWorkDto);
    if (data.affected === 0) throw new BadRequestException("Update could not be performed.");
    await this.cacheService.refresh(this.cacheKeyBase);
  }

  async removeWork(id: number) {
    const data = await this.workRepository.delete(id);
    if (data.affected === 0) throw new NotFoundException("Work not found.");
    await this.cacheService.refresh(this.cacheKeyBase);
  }
}
