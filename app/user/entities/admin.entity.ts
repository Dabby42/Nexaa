import { Column, Entity } from "typeorm";
import { BaseUser } from "./base-user.entity";

@Entity("admins")
export class Admin extends BaseUser {
  @Column({ type: "boolean", default: true })
  is_active: boolean;
}
