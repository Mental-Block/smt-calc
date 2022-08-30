import { Entity, CreateDateColumn, UpdateDateColumn, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"

import { TDateISO } from "@interfaces/date"
import { UserProps, UserRoleType } from "@interfaces/user"

import { ENTITY } from "../const"
import BakeComponent from "./bakeComponent"

// Keep entity as users and not user! user is reserved key word 
@Entity(ENTITY.user) 
class User extends BaseEntity implements UserProps { 
 @PrimaryGeneratedColumn()
 id!: number

 @Column("text", { unique: true })
 username!: string

 @Column("text", { select: false })
 password!: string

 @Column("text")
 role!: UserRoleType

 @Column("int", { default: 0 })
 tokenVersion!: number

 @OneToMany(() => BakeComponent, (bake) => bake.user)
 bakeComponent!: BakeComponent

 @CreateDateColumn()
 createdAt!: TDateISO;

 @UpdateDateColumn()
 updatedAt!: TDateISO;
}

export default User