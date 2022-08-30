import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, UpdateDateColumn,} from "typeorm"

import { TDateISO } from "@interfaces/date";
import { SettingProps } from "@interfaces/setting";

import { ENTITY } from "../const";

@Entity(ENTITY.settings)
class Settings extends BaseEntity implements SettingProps  { 
    @PrimaryGeneratedColumn()
    id!: number

    @Column("int")
    humidity!: number

    @Column("int")
    tempature!: number

    @UpdateDateColumn()
    updateAt!: TDateISO;
}

export default Settings