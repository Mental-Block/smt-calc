import { getRepository } from "typeorm";
import { Request } from "express";


import { COMPONENT, ENTITY, ERRORS, FLOOR_LIFE, LABEL } from "@const";
import { FloorLife, Label } from "@entities";

import { toFlatPropertyMap } from "@util/toFlatPropertyMap";

import { AddMSL, AllMSL, DelMSL, FloorLifeProps, MSLStatusType } from "@interfaces/msl"

import FloorLifeClock from "@util/FloorLifeClock";
import Table from "@util/Table";

export default class FloorlifeController {
  private FloorlifeRepository = getRepository(FloorLife)
  private LabelRepository = getRepository(Label)

  async all(req: Request<{}, {}, {}, AllMSL>){
    let { sortField, sortOrder, pageSize, page } = req.query
    const { 
      availableAt, 
      createdAt, 
      updatedAt, 
      level, 
      status,
      label_partId,
      label_component_partnumberInternal
    } = req.query

    let fixSortFeild = Table.fixSortFeild(
      sortField, {
      default: `${ENTITY.floorlife}.${FLOOR_LIFE.id}`,
      prefix: `${ENTITY.floorlife}` 
    }, [
      `${ENTITY.label}_${ENTITY.component}_${COMPONENT.partnumberInternal}` 
    ])

    fixSortFeild = fixSortFeild === `${ENTITY.floorlife}.${ENTITY.label}.${ENTITY.component}.${COMPONENT.partnumberInternal}` 
    ? `${ENTITY.component}.${COMPONENT.partnumberInternal}` : fixSortFeild

    const createdPage = Table.createPage(page, pageSize)
    const createdSort = Table.createSort(
      fixSortFeild, 
      sortOrder,
    )

    let data = await this.FloorlifeRepository.createQueryBuilder(`${ENTITY.floorlife}`)
    .leftJoinAndMapOne(`${ENTITY.floorlife}.${ENTITY.label}`, `${ENTITY.floorlife}.${ENTITY.label}`, `${ENTITY.label}`)
    .leftJoinAndMapOne(`${ENTITY.label}.${ENTITY.component}`,  `${ENTITY.label}.${ENTITY.component}`, `${ENTITY.component}`)
    .select([
      `${ENTITY.floorlife}.${FLOOR_LIFE.id}`,  
      `${ENTITY.floorlife}.${FLOOR_LIFE.availableAt}`,  
      `${ENTITY.floorlife}.${FLOOR_LIFE.createdAt}`,  
      `${ENTITY.floorlife}.${FLOOR_LIFE.level}`,  
      `${ENTITY.floorlife}.${FLOOR_LIFE.status}`,  
      `${ENTITY.floorlife}.${FLOOR_LIFE.updatedAt}`,  
      `${ENTITY.label}.${LABEL.partId}`,
      `${ENTITY.component}.${COMPONENT.partnumberInternal}`,
    ])
    .where(createdAt ? `${ENTITY.floorlife}.${FLOOR_LIFE.createdAt} BETWEEN :startRange::timestamptz AND :endRange::timestamptz`   
    : `TRUE`, createdAt ? {
      startRange: `${new Date(createdAt).toISOString().substring(0, 10)}T00:00:00.000Z`,
      endRange: `${new Date(createdAt).toISOString().substring(0, 10)}T23:59:59.000Z`
    } : {})
    .andWhere(updatedAt ? `${ENTITY.floorlife}.${FLOOR_LIFE.updatedAt} BETWEEN :startRange::timestamptz AND :endRange::timestamptz`   
    : `TRUE`, updatedAt ? {
      startRange: `${new Date(updatedAt).toISOString().substring(0, 10)}T00:00:00.000Z`,
      endRange: `${new Date(updatedAt).toISOString().substring(0, 10)}T23:59:59.000Z`
    } : {})
    .andWhere(availableAt ? `${ENTITY.floorlife}.${FLOOR_LIFE.availableAt} BETWEEN :startRange::timestamptz AND :endRange::timestamptz`   
    : `TRUE`, availableAt ? {
      startRange: `${new Date(availableAt).toISOString().substring(0, 10)}T00:00:00.000Z`,
      endRange: `${new Date(availableAt).toISOString().substring(0, 10)}T23:59:59.000Z`
    } : {})
    .andWhere( status ?  
      `${ENTITY.floorlife}.${FLOOR_LIFE.status} = ANY(STRING_TO_ARRAY(:${FLOOR_LIFE.status},' ')::TEXT[])` 
      : `TRUE`, { status })
    .andWhere( level ?  
      `${ENTITY.floorlife}.${FLOOR_LIFE.level} ::TEXT = ANY(STRING_TO_ARRAY(:${FLOOR_LIFE.level},' ')::TEXT[])` 
      : `TRUE`, {level: level })
      .andWhere(label_component_partnumberInternal ?  `${ENTITY.component}.${COMPONENT.partnumberInternal} ILIKE :${COMPONENT.partnumberInternal}` 
      : `TRUE`, { partnumberInternal: `%${label_component_partnumberInternal}%` })
      .andWhere(label_partId ? `${ENTITY.label}.${LABEL.partId} ::TEXT ILIKE :${LABEL.partId} ::TEXT` 
      : `TRUE`, {partId: `%${label_partId}%`})
    .skip(createdPage.skip)
    .take(createdPage.pageSize)
    .orderBy(createdSort.sortField, createdSort.sortOrder)
    .getManyAndCount()

    return { records:data[0].map((obj) => toFlatPropertyMap(obj, '_')),  pageLength: data[1] }
  }

  async add(req: Request<AddMSL>) {
    const { partId } = req.params

    const label = await this.LabelRepository.findOne({ where: { partId }, relations: [`${ENTITY.component}`, `msl`]})

    if(!label) throw new Error(ERRORS.labelNotFound)
    if(label.msl) throw new Error(ERRORS.labelInUse)

   const MSL = this.FloorlifeRepository.create({
      level: label.component.mslLevel,
      status: 'EXPIRING',
      availableAt: new FloorLifeClock(label.component.mslLevel).createExpireDate()
    })

    await this.FloorlifeRepository.save(MSL) 

    const updatedLabel = await this.LabelRepository.save({
      ...label,
      msl: MSL
    })

    const newItem = {
      ...MSL,
      label_partId: updatedLabel.partId,
      label_component_partnumberInternal: updatedLabel.component.partnumberInternal
    }

    return newItem
  }

  async del (req: Request<DelMSL> ){
    const { id } = req.params

    await this.FloorlifeRepository.delete({ id });

    return true
  }

  async unpause (req: Request) {
    const { id } = req.params

    const msl = await this.FloorlifeRepository.findOne({ where: { id } })

    if (!msl) throw new Error(ERRORS.notMSLLevel)

    const Clock = new FloorLifeClock(msl.level)

    const newMsl: FloorLifeProps = {
      ...msl,
      availableAt: Clock.unPause(msl.status, msl.availableAt, msl.updatedAt),
      status: 'EXPIRING',
    }

    const newFloorlife = this.FloorlifeRepository.merge(msl, newMsl);

    await this.FloorlifeRepository.save(newFloorlife);

    return newMsl
  }

  async pause (req: Request) {
    const { id } = req.params

    const MSL = await this.FloorlifeRepository.findOne({ where: { id } })

    if (!MSL) throw new Error(ERRORS.notMSLLevel)

    const Clock = new FloorLifeClock(MSL.level)

    let status = Clock.getStatus(MSL.availableAt) as MSLStatusType

    const newMSL: FloorLifeProps = {
      ...MSL,
      availableAt: Clock.pause(status, MSL.availableAt),
      status,
    }

    const newFloorlife = this.FloorlifeRepository.merge(MSL, newMSL);

    await this.FloorlifeRepository.save(newFloorlife);

    return newMSL
  }
}

