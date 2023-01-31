import { CountryRegion } from 'app/country_region/entities/country_region.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import * as bcrypt from "bcrypt";
import {config} from "../../config/config";

export enum UserStatusEnum {
  PENDING = 0,
  APPROVED = 1,
  DISABLED = 2,
}

export enum RoleEnum {
  AFFILIATE = 1,
  ADMIN = 3,
}

@Entity()
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

  @Column()
  address: string;

  @ManyToOne(() => CountryRegion)
  @JoinColumn({ name: 'state' })
  state: CountryRegion;

  @Column()
  country: string;

  @Column()
  phone_number: string;

  @Column({nullable: true})
  website_url: string;

  @Column({
    type: 'enum',
    enum: UserStatusEnum,
    default: UserStatusEnum.PENDING,
  })
  status: number;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.AFFILIATE,
  })
  role: number;

  @Column()
  password: string;

  @Column({ type: 'timestamp', nullable: true })
  public verified_at: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'verified_by' })
  public verified_by: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  public updated_at: Date;

  static async hashPassword(password){
    const salt = await bcrypt.genSalt(config.salt);
    return await bcrypt.hash(password, salt);
  }
}
