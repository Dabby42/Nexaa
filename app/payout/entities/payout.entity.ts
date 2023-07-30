import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Orders } from "../../orders/entities/order.entity";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Payout {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Orders, { nullable: true })
  @JoinColumn({ name: "order_id" })
  order_id: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "affiliate_id" })
  affiliate_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
