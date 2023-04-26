import { Column, CreateDateColumn, JoinColumn, ManyToOne, UpdateDateColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

export class Order {
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "user_id" })
  public affiliate_id: number;

  @Column()
  public product_id: number;

  @Column()
  public order_id: number;

  @Column()
  public status: string;

  @Column()
  public category: string;

  @Column({
    type: "decimal",
    precision: 2,
    scale: 1,
  })
  public amount: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
