import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, ManyToOne, OneToOne, JoinColumn,} from "typeorm"

import { TDateISO } from "@interfaces/date"
import { ENTITY } from "../const"
import Component from "./component"
import { LabelProps } from "@interfaces/label"

import FloorLife from "./floorlife"

@Entity(ENTITY.label)
class Label extends BaseEntity implements LabelProps { 
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => Component, (component) => component.label)
    component!: Component

    @OneToOne(() => FloorLife, (msl) => msl.label)
    msl!: FloorLife  

    @Column('bigint', { unique: true })
    partId!: number

    @CreateDateColumn()
    createdAt!: TDateISO

    @UpdateDateColumn()
    updatedAt!: TDateISO;
}

export default Label