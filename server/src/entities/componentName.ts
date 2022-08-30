import { ComponentNameProps } from "@interfaces/component"
import {Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm"

import { ENTITY } from "../const"

@Entity(ENTITY.componentname)
class ComponentName extends BaseEntity implements ComponentNameProps { 
    @PrimaryGeneratedColumn()
    id!: number

    @Column('varchar', {})
    name!: string
}

export default ComponentName