import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, OneToMany } from "typeorm"

import { TDateISO } from "@interfaces/date"

import { ENTITY } from "../const"

import Label from "./label"
import { ComponentProps, PackageType } from "@interfaces/component"
import { MSLLevelType } from "@interfaces/msl"

@Entity(ENTITY.component)
class Component extends BaseEntity implements ComponentProps { 
    @PrimaryGeneratedColumn()
    id!: number

    @Column('varchar')
    partnumberInternal!: string

    @Column('varchar', { unique: true})
    partnumberManufactor!: string

    @Column("varchar", { array: true, default:[] })
    packageType!: PackageType[]
    
    @Column('varchar')
    vendor!: string

    @Column('varchar') 
    name!: string 

    @Column('float')
    bodyThickness!: number  
    
    @Column('int')
    pinCount!: number

    @Column("text", { nullable: true })
    description!: string  
    
    @Column("text")
    mslLevel!: MSLLevelType

    @OneToMany(() => Label, label => label.component, { onDelete: 'CASCADE' })
    label!: Label;

    @CreateDateColumn({select: false})
    createdAt!: TDateISO;
    
    @UpdateDateColumn({select: false})
    updatedAt!: TDateISO;
}

export default Component