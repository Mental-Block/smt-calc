import {Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne } from "typeorm"

import { ENTITY } from "../const"
import User from "./user"

@Entity(ENTITY.bakecomponent)
class BakeComponent extends BaseEntity { 
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => User, (user) => user.bakeComponent, { cascade: true, onUpdate: 'CASCADE' })
    user!: User
}

export default BakeComponent