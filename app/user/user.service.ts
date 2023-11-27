import { ConflictException, Injectable, Logger, UnprocessableEntityException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoleEnum, User } from "./entities/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CacheService } from "../cache/cache.service";
import { BasicAuth } from "../auth/entities/basic-auth.entity";

@Injectable()
export class UserService {
  private readonly logger = new Logger("UserService");
  private readonly brandCacheKeyBase: string;
  private readonly creatorCacheKeyBase: string;
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(BasicAuth) private basicAuthRepository: Repository<BasicAuth>,
    private cacheService: CacheService
  ) {
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

    const newUser = this.userRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      first_name: createUserDto.first_name,
      last_name: createUserDto.last_name,
    });

    try {
      const saveUser = await this.userRepository.save(newUser);

      const password = await User.hashPassword(createUserDto.password);
      await this.basicAuthRepository.save({
        user_id: { id: saveUser.id },
        password,
      });
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
      return user;
    });
  }
}
