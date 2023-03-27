import { BadRequestException, ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User, UserStatusEnum } from "./entities/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateBankDetailsDto } from "./dto/update-bank-details.dto";
import { sendSuccess } from "app/utils/helpers/response.helpers";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: [{ email: createUserDto.email }, { username: createUserDto.username }],
    });
    if (user) {
      if (createUserDto.username === user.username) throw new ConflictException("A user with this username already exist");
      else if (createUserDto.email === user.email) throw new ConflictException("A user with this email already exist");
    }

    const newUser = this.userRepository.create(createUserDto);
    newUser.password = await User.hashPassword(createUserDto.password);

    try {
      await this.userRepository.insert(newUser);
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

  async updateAffiliateStatus(affiliate_id: number, status: UserStatusEnum, reason: string, admin: User) {
    const affiliate = await this.userRepository.findOne({ where: { id: affiliate_id } });
    if (!affiliate) throw new NotFoundException("Affiliate not found.");
    if (affiliate.status === status) throw new BadRequestException("Please update affiliate to a new status.");
    affiliate.status = status;
    affiliate.disable_reason = reason;
    if (status === UserStatusEnum.APPROVED) {
      affiliate.verified_by = admin;
      affiliate.verified_at = new Date();
    }
    await this.userRepository.save(affiliate);
  }

  async approveAffiliate(affiliate_id: number, admin: User) {
    return await this.updateAffiliateStatus(affiliate_id, UserStatusEnum.APPROVED, null, admin);
  }

  async disableAffiliate(affiliate_id: number, reason: string, admin: User) {
    if (!reason) throw new BadRequestException("Please provide a reason for disabling this affiliate.");
    return await this.updateAffiliateStatus(affiliate_id, UserStatusEnum.DISABLED, reason, admin);
  }
}
