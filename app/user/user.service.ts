import {BadRequestException, Injectable, UnprocessableEntityException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "./entities/user.entity";


@Injectable()
export class UserService {

  constructor(
      @InjectRepository(User) private userRepository: Repository<User>
  ){}

  async createUser(createUserDto: CreateUserDto): Promise<User> {

    let user = await this.userRepository.findOne({ where:
          [
            {email: createUserDto.email},
            {username : createUserDto.username}
          ]
      }
    );
    if (user){
      if(createUserDto.username === user.username) throw new BadRequestException("A user with this username already exist")
      else if(createUserDto.email === user.email) throw new BadRequestException("A user with this email already exist");
    }

    const newUser = this.userRepository.create(createUserDto);
    newUser.password = await User.hashPassword(createUserDto.password);

    try {
      return await this.userRepository.save(newUser);
    } catch(err) {
      console.log(err)
      throw new UnprocessableEntityException('An unknown error occurred')
    }

  }

}
