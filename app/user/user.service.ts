import { ConflictException, Injectable, Logger, UnprocessableEntityException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoleEnum, User } from "./entities/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CacheService } from "../cache/cache.service";

@Injectable()
export class UserService {
  private readonly logger = new Logger("UserService");
  private readonly brandCacheKeyBase: string;
  private readonly creatorCacheKeyBase: string;
  constructor(@InjectRepository(User) private userRepository: Repository<User>, private cacheService: CacheService) {
    this.brandCacheKeyBase = "BRAND_";
    this.creatorCacheKeyBase = "CREATOR_";
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: [{ email: createUserDto.email }, { username: createUserDto.username }],
    });
    if (user) {
      if (createUserDto.username === user.username) throw new ConflictException("A user with this username already exist");
      else if (createUserDto.email === user.email) throw new ConflictException("A user with this email already exist");
    }

    const newUser = this.userRepository.create(createUserDto);
    //newUser.password = await User.hashPassword(createUserDto.password);

    try {
      const saveUser = await this.userRepository.insert(newUser);
    } catch (err) {
      this.logger.error(err);
      throw new UnprocessableEntityException("An unknown error occurred");
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.username) {
      const user = await this.userRepository.findOne({ where: { username: updateUserDto.username } });
      if (user) throw new ConflictException("Username already in use.");
    }
    await this.userRepository.update(id, updateUserDto);
    await this.cacheService.refresh(this.creatorCacheKeyBase + id);
  }

  async findByUsername(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }

  async loadUser(id: number, role: RoleEnum) {
    let key = role === RoleEnum.BRAND ? this.brandCacheKeyBase : this.creatorCacheKeyBase;
    key += id;
    return this.cacheService.cachedData(key, async () => {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) return null;
      //delete user.password;
      return user;
    });
  }
}
