import { ConflictException, Injectable, Logger, UnprocessableEntityException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { RoleEnum, User } from "./entities/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CacheService } from "../cache/cache.service";
import { BasicAuth } from "../auth/entities/basic-auth.entity";
import { AddPreferenceDto } from "./dto/add-preference.dto";
import { UserPreference } from "./entities/user-preference.entity";

@Injectable()
export class UserService {
  private readonly logger = new Logger("UserService");
  private readonly brandCacheKeyBase: string;
  private readonly creatorCacheKeyBase: string;
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(BasicAuth) private basicAuthRepository: Repository<BasicAuth>,
    @InjectRepository(UserPreference) private userPreferenceRepository: Repository<UserPreference>,
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

    const userEntity = new User();

    for (const key in createUserDto) {
      if (createUserDto.hasOwnProperty(key) && key !== "password") {
        userEntity[key] = createUserDto[key];
      }
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const saveUser = await queryRunner.manager.save(User, userEntity);
      const password = await User.hashPassword(createUserDto.password);
      await queryRunner.manager.save(BasicAuth, {
        user_id: { id: saveUser.id },
        password,
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(err);
      throw new UnprocessableEntityException("An unknown error occurred");
    } finally {
      await queryRunner.commitTransaction();
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

  async addPreference(id: number, addPreferenceDto: AddPreferenceDto) {
    const userPreference = await this.userPreferenceRepository.findOne({ where: { user_id: { id } } });
    if (userPreference) {
      await this.userPreferenceRepository.update(userPreference.id, addPreferenceDto);
    } else {
      const newUserPreference = this.userPreferenceRepository.create({ ...addPreferenceDto, user_id: { id } });
      await this.userPreferenceRepository.save(newUserPreference);
    }
  }
}
