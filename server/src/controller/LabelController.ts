import { getRepository } from "typeorm";
import { Request } from "express";

import { Component, Label } from "@entities";

import { COMPONENT, ENTITY, ERRORS, LABEL } from "@const";
import { AddLabel, AllLabel, DelLabel } from "@interfaces/label";

import Table from "@util/Table";
import { toFlatPropertyMap } from "@util/toFlatPropertyMap";

export default class LabelController {
  private LabelRepository = getRepository(Label)
  private ComponentRepository = getRepository(Component)

  async all(req: Request<{}, {}, {}, AllLabel>) {
    const { 
      page, 
      pageSize,
      sortOrder,
      sortField,
      component_partnumberInternal, 
      component_partnumberManufactor, 
      partId, 
    } = req.query

  const fixedSortFeild = Table.fixSortFeild(sortField, {
      default: `${ENTITY.label}.${LABEL.id}`,
    }, [
      `${ENTITY.component}_${COMPONENT.partnumberInternal}`, 
      `${ENTITY.component}_${COMPONENT.partnumberManufactor}`
    ])

   const createdPage = Table.createPage(page, pageSize)
    const createdSort = Table.createSort(
      fixedSortFeild, 
      sortOrder,
    )
    
    const data = await this.LabelRepository.createQueryBuilder(`${ENTITY.label}`)
    .leftJoin(`${ENTITY.label}.${ENTITY.component}`, `${ENTITY.component}`)
    .select([
      `${ENTITY.label}.${LABEL.id}`,
      `${ENTITY.label}.${LABEL.partId}`,
      `${ENTITY.component}.${COMPONENT.partnumberInternal}`,
      `${ENTITY.component}.${COMPONENT.partnumberManufactor}`
    ])
    .andWhere(partId ? `${ENTITY.label}.${LABEL.partId} ::TEXT ILIKE :${LABEL.partId} ::TEXT` 
: `TRUE`, {partId : `%${partId}%` })
    .andWhere(component_partnumberInternal ?  `${ENTITY.component}.${COMPONENT.partnumberInternal} ILIKE :${COMPONENT.partnumberInternal}` 
    : `TRUE`, { partnumberInternal: `%${component_partnumberInternal}%` })
    .andWhere(component_partnumberManufactor ?  `${ENTITY.component}.${COMPONENT.partnumberManufactor} ILIKE :${COMPONENT.partnumberManufactor}` 
    : `TRUE`, { partnumberManufactor: `%${component_partnumberManufactor}%` })
    .skip(createdPage.skip)
    .take(createdPage.pageSize)
    .orderBy(createdSort.sortField, createdSort.sortOrder)
    .getManyAndCount()

    return { records: data[0].map((obj) => toFlatPropertyMap(obj, '_')), pageLength: data[1] }
  }

  async del(req: Request<DelLabel>) {
    const { id } = req.params

      const label = await this.LabelRepository.findOne({ where: { id }, relations: ['msl']});

      if(!label) throw new Error(ERRORS.labelNotFound)
      if(label.msl) throw new Error(ERRORS.mslInuse)
      
      await this.LabelRepository.delete({ id });

      return true
  }

  async add(req: Request<{}, {}, AddLabel>) {
    const { partId, partnumberManufactor } = req.body

      const component = await this.ComponentRepository.findOne({
        where: { partnumberManufactor }
      })

      const newLabel = this.LabelRepository.create({
        partId,
        component,
      })

    const newlyCreatedLabel = await this.LabelRepository.save(newLabel)

    const newItem = {
      id: newlyCreatedLabel.id,
      partId: newlyCreatedLabel.partId,
      component_partnumberManufactor: newlyCreatedLabel.component.partnumberManufactor,
      component_partnumberInternal: newlyCreatedLabel.component.partnumberInternal,
    }

    return newItem
  }
}
