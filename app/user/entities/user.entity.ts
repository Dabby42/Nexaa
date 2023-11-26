import * as bcrypt from "bcryptjs";
import { config } from "../../config/config";
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum RoleEnum {
  BRAND = 1,
  CREATOR = 2,
}

export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  static async comparePasswords(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(config.salt);
    return await bcrypt.hash(password, salt);
  }

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
