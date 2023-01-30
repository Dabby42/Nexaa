import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "./entities/user.entity";
import * as bcrypt from "bcrypt";
import {config} from "../config/config";

@Injectable()
export class UserService {

  constructor(
      @InjectRepository(User) private userRepository: Repository<any>
  ){}

  async createUser(createUserDto: CreateUserDto): Promise<any> {

    const newUser = this.userRepository.create(createUserDto);

    const salt = await bcrypt.genSalt(config.salt);
    newUser.password = await bcrypt.hash(createUserDto.password, salt);

    return this.userRepository.save(newUser);
  }

  findAllUsers() {
    return `This action returns all user`;
  }

  findUser(id: number) {
    return `This action returns a #${id} user`;
  }

  updateUser(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  deleteUser(id: number) {
    return `This action removes a #${id} user`;
  }
}
