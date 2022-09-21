import { getRepository } from "typeorm";
import type { Request } from "express";

import { ComponentName } from "@entities";
import { ENTITY, COMPONENTNAME } from "@const";

import type { ComponentNameProps } from "@interfaces/component";

export default class ComponentNameController {
  private ComponentNameRepository = getRepository(ComponentName)

  async all(req:  Request<{}, {}, {}, Pick<ComponentNameProps, 'name'>>) {
    let { name } = req.query

    try {
      const records = await this.ComponentNameRepository
      .createQueryBuilder(`${ENTITY.componentname}`)
      .select([
      `${ENTITY.componentname}.${COMPONENTNAME.id}`,
      `${ENTITY.componentname}.${COMPONENTNAME.name}`
      ])
      .where(name ? `${ENTITY.componentname}.${COMPONENTNAME.name} ILIKE :${COMPONENTNAME.name}` 
      : `TRUE`, { name: `%${name}%` })
      .getMany()

      return records
    } catch (error: any) {
      throw new Error(error || 'Failed to get component name records.')
    }
  }

  async del (req: Request<Pick<ComponentNameProps, 'id'>>) {
    const { id } = req.params

    try {
      await this.ComponentNameRepository.delete({ id });

      return true
    } catch (error: any) {
      throw new Error(error || "This Componenent name doesn't exist")
    }
  }

  async add(req: Request<{}, {}, Pick<ComponentNameProps, 'name'>>) {
    const { name } = req.body

    try {
      const createdComponentName = this.ComponentNameRepository.create({
        name 
      })

      const option = await this.ComponentNameRepository.save(createdComponentName)

      return {
        id: option.id,
        text: option.name,
        value: option.name,
      }
    } catch (error: any) {
      throw new Error(error || 'Failed to save component name!') 
    }
  }
}

