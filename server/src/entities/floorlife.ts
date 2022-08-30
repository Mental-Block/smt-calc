import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, OneToOne, JoinColumn } from "typeorm"

import { TDateISO } from "@interfaces/date"
import { FloorLifeProps, MSLLevelType, MSLStatusType } from "@interfaces/msl"

import { ENTITY, MSL_STATUS } from "../const"

import Label from "./label"

@Entity(ENTITY.floorlife)
class FloorLife extends BaseEntity implements FloorLifeProps { 
    @PrimaryGeneratedColumn()
    id!: number

    @Column("text")
    level!: MSLLevelType
    
    @Column("text", { default: MSL_STATUS.PAUSED })
    status!: MSLStatusType

    @Column("timestamptz", { nullable: true })
    availableAt!: TDateISO

    @UpdateDateColumn()
    updatedAt!: TDateISO;

    @CreateDateColumn()
    createdAt!: TDateISO;

    @OneToOne(() => Label, label => label.msl)
    @JoinColumn()
    label!: Label;
}

export default FloorLife