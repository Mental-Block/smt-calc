import { getRepository } from "typeorm";
import { Request } from "express";

import { Component } from "@entities";

import { COMPONENT, ENTITY, ERRORS } from "@const";

import { 
  AddComponent, 
  AllComponent, 
  DelComponent, 
  SaveComponent, 
  IsMultiplePartNumber, 
} from "@interfaces/component";

import Table from "@util/Table";

export default class ComponentController {
  private ComponentRepository = getRepository(Component)

  async all(req: Request<{}, {}, {}, AllComponent>) {
    let { page, pageSize, sortField, sortOrder} = req.query
    const { 
      bodyThickness, 
      description, 
      pinCount,  
      mslLevel, 
      name, 
      partnumberInternal, 
      partnumberManufactor, 
      vendor, 
      packageType  
    } = req.query

    const createdPage = Table.createPage(page, pageSize)
    const createdSort = Table.createSort(
      sortField,
      sortOrder,
    )

    const data = await this.ComponentRepository
    .createQueryBuilder(`${ENTITY.component}`)
    .select([
      `${ENTITY.component}.${COMPONENT.id}`,
      `${ENTITY.component}.${COMPONENT.bodyThickness}`,
      `${ENTITY.component}.${COMPONENT.description}`,
      `${ENTITY.component}.${COMPONENT.mslLevel}`,
      `${ENTITY.component}.${COMPONENT.name}`,
      `${ENTITY.component}.${COMPONENT.packageType}`,
      `${ENTITY.component}.${COMPONENT.partnumberInternal}`,
      `${ENTITY.component}.${COMPONENT.partnumberManufactor}`,
      `${ENTITY.component}.${COMPONENT.pinCount}`,
      `${ENTITY.component}.${COMPONENT.vendor}`,
    ])
    .where(bodyThickness ? `${ENTITY.component}.${COMPONENT.bodyThickness} ::TEXT ILIKE :${COMPONENT.bodyThickness} ::TEXT` 
    : `TRUE`, {bodyThickness: `%${bodyThickness}%`})
    .andWhere(description ? `${ENTITY.component}.${COMPONENT.description} ILIKE :${COMPONENT.description}` 
    : `TRUE`, {description: `%${description}%`})
    .andWhere(pinCount ? `${ENTITY.component}.${COMPONENT.pinCount} ::TEXT ILIKE :${COMPONENT.pinCount} ::TEXT` 
    : `TRUE`, {pinCount: `%${pinCount}%`}) 
    .andWhere(name ?  `${ENTITY.component}.${COMPONENT.name} ILIKE :${COMPONENT.name}` 
    : `TRUE`, { name: `%${name}%` })
    .andWhere(partnumberInternal ?  `${ENTITY.component}.${COMPONENT.partnumberInternal} ILIKE :${COMPONENT.partnumberInternal}` 
    : `TRUE`, { partnumberInternal: `%${partnumberInternal}%` })
    .andWhere(partnumberManufactor ?  `${ENTITY.component}.${COMPONENT.partnumberManufactor} ILIKE :${COMPONENT.partnumberManufactor}` 
    : `TRUE`, { partnumberManufactor: `%${partnumberManufactor}%` })
    .andWhere(vendor ?  `${ENTITY.component}.${COMPONENT.vendor} ILIKE :${COMPONENT.vendor}` 
    : `TRUE`, { vendor: `%${vendor}%` })
    .andWhere(packageType ? `${ENTITY.component}.${COMPONENT.packageType} ::TEXT[] && STRING_TO_ARRAY(:${COMPONENT.packageType}, ' ')` 
    : 'TRUE', { packageType })
    .andWhere( mslLevel ?  
      `${ENTITY.component}.${COMPONENT.mslLevel} ::TEXT = ANY(STRING_TO_ARRAY(:${COMPONENT.mslLevel},' ')::TEXT[])` 
      : `TRUE`, { mslLevel })
    .skip(createdPage.skip)
    .take(createdPage.pageSize)
    .orderBy('name', createdSort.sortOrder)
    .getManyAndCount()
    
    return { records: data[0], pageLength: data[1] }
  }

  async add(req: Request<{}, {}, AddComponent>) {
   const componentProps = req.body

    const component = this.ComponentRepository.create({
      ...componentProps
    })

    const newComponent = await this.ComponentRepository.save(component)

   return newComponent
  }
  
  async del(req: Request<DelComponent>) {
    const { id } = req.params
    
    try {
      const component = await this.ComponentRepository.findOne({ where: { id } });

      if(!component) throw new Error(ERRORS.componentNotFound)

      await this.ComponentRepository.delete(component)
  
      return true
    } catch {
      throw new Error(ERRORS.componentInUse)
    }
  }

  async save(req: Request<{ id: number }, {}, SaveComponent>) {
    const { id } = req.params
    const componentReq = req.body
    
    const component = await this.ComponentRepository.findOne({ where: { id } })

    if(!component) throw new Error("No component found!")

    this.ComponentRepository.merge(component, {
      ...componentReq,
    });

    await this.ComponentRepository.save(component);

    return true;
  }

  async isMultipleInternalPartNumber (req: Request<IsMultiplePartNumber>) {
    const { partnumberInternal } = req.params

    const partnumber = await this.ComponentRepository.find({
      where: { partnumberInternal },
      select: [`partnumberManufactor`]
    })

    if(partnumber.length === 0) return false

    return partnumber
  }
}
