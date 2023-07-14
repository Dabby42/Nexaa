import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Banner } from "../../banners/entities/banner.entity";

@Entity()
export class Links {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "user_id" })
  public user_id: User;

  @Column()
  public redirect_url: string;

  @Column({ default: false })
  public is_default: boolean;

  @Column()
  public k_id: string;

  @ManyToOne(() => Banner, { nullable: true })
  @JoinColumn({ name: "banner_id" })
  public banner_id: Banner;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
