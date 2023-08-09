import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum CategoryStatusEnum {
  ACTIVE = 1,
  DISABLED = 2,
}

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  category_name: string;

  @Column({
    type: "decimal",
    precision: 2,
    scale: 1,
  })
  commission: number;

  @Column({
    type: "enum",
    enum: CategoryStatusEnum,
    default: CategoryStatusEnum.ACTIVE,
  })
  status: number;

  @Column({ nullable: true })
  magento_id: number;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;
}
