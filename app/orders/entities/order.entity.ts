import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Orders {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "user_id" })
  public affiliate_id: number;

  @Column()
  public product_id: number;

  @Column()
  public order_id: string;

  @Column()
  public status: string;

  @Column()
  public category: string;

  @Column({
    type: "decimal",
    precision: 2,
    scale: 1,
  })
  public total_amount: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
