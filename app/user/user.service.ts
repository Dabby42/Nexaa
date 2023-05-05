import { ConflictException, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateBankDetailsDto } from "./dto/update-bank-details.dto";
import { sendSuccess } from "app/utils/helpers/response.helpers";
import { Admin } from "./entities/admin.entity";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { LinksService } from "../links/links.service";
import { SearchAndFilterAffiliateDto } from "./dto/searchAndFilterAffiliateDto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    private readonly linksService: LinksService
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: [{ email: createUserDto.email }, { username: createUserDto.username }, { phone_number: createUserDto.phone_number }],
    });
    if (user) {
      if (createUserDto.username === user.username) throw new ConflictException("A user with this username already exist");
      else if (createUserDto.email === user.email) throw new ConflictException("A user with this email already exist");
      else throw new ConflictException("A user with this phone number already exist");
    }

    const newUser = this.userRepository.create(createUserDto);
    newUser.password = await User.hashPassword(createUserDto.password);

    try {
      const saveUser = await this.userRepository.insert(newUser);
      await this.linksService.generateCustomUrl({ redirect_url: "https://konga.com", is_default: true }, { user: { id: saveUser.raw.insertId, username: createUserDto.username } });
    } catch (err) {
      console.log(err);
      throw new UnprocessableEntityException("An unknown error occurred");
    }
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    const admin = await this.adminRepository.findOne({ where: { email: createAdminDto.email } });
    if (admin) throw new ConflictException("An admin with this email already exists.");
    const newAdmin = this.adminRepository.create(createAdminDto);
    newAdmin.password = await Admin.hashPassword(createAdminDto.password);
    try {
      await this.adminRepository.insert(newAdmin);
    } catch (err) {
      throw new UnprocessableEntityException("An unknown error occurred");
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.username) {
      const user = await this.userRepository.findOne({ where: { username: updateUserDto.username } });
      if (user) throw new ConflictException("Username already in use.");
    }
    await this.userRepository.update(id, updateUserDto);
  }

  async updateBankDetails(id: number, updateBankDetailsDto: UpdateBankDetailsDto) {
    try {
      await this.userRepository.update(id, updateBankDetailsDto);
      return sendSuccess(null, "Bank Details Updated");
    } catch (error) {
      throw new UnprocessableEntityException("An unknown error occurred");
    }
  }

  async fetchAllAffiliates(page: number, limit: number) {
    const [users, count] = await this.userRepository.findAndCount({
      order: { created_at: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
      select: ["first_name", "last_name", "username", "verified_at", "created_at", "phone_number", "status"],
    });

    const pages = Math.ceil(count / limit);

    return {
      users,
      count,
      current_page: page,
      pages,
    };
  }

  async searchAndFilterAffiliates(searchAndFilterAffiliateDto: SearchAndFilterAffiliateDto) {
    const { page, limit, q, status } = searchAndFilterAffiliateDto;
    const options: any = {
      order: { created_at: "DESC" },
      skip: (+page - 1) * +limit,
      take: +limit,
      select: ["first_name", "last_name", "username", "verified_at", "created_at", "phone_number", "status"],
    };

    if (q) {
      options.where = [{ first_name: Like(`%${q}%`) }, { last_name: Like(`%${q}%`) }, { username: Like(`%${q}%`) }];
    }

    if (status) {
      options.where = options.where?.map((w) => ({ ...w, status })) || { status };
    }

    const [users, count] = await this.userRepository.findAndCount(options);
    const pages = Math.ceil(count / +limit);

    return {
      users,
      count,
      current_page: +page,
      pages,
    };
  }
}
