import { ConflictException, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

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
}
