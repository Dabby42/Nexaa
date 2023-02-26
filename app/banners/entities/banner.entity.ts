import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum BannerStatusEnum {
  ACTIVE = 1,
  DISABLED = 2,
}

export interface BannerImagesAndSizes {
  banner_size: string;
  banner_image_url: string;
}

@Entity()
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  banner_name: string;

  @Column()
  banner_images_and_sizes: string;

  @Column()
  banner_link: string;

  @Column({ nullable: true })
  tracking_tag: string;

  @Column({
    type: "enum",
    enum: BannerStatusEnum,
    default: BannerStatusEnum.ACTIVE,
  })
  status: number;

  @Column()
  commission: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}