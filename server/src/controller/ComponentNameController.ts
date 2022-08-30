import { getRepository } from "typeorm";
import { Request } from "express";

import { ComponentName } from "@entities";

import { ENTITY, COMPONENTNAME } from "@const";

import { ComponentNameProps } from "@interfaces/component";

type ComponentNameAddReq = Request<{}, {}, Pick<ComponentNameProps, 'name'>>
type ComponentNameReq = Request<{}, {}, {}, Pick<ComponentNameProps, 'name'>>
type ComponentNameDelReq = Request<Pick<ComponentNameProps, 'id'>>

export default class ComponentNameController {
  private ComponentNameRepository = getRepository(ComponentName)

  async all(req: ComponentNameReq) {
    let { name } = req.query

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
  }

  async del (req: ComponentNameDelReq) {
    const { id } = req.params

    await this.ComponentNameRepository.delete({ id });

    return true
  }

  async add(req: ComponentNameAddReq) {
    const reqName = req.body.name

      const createdComponentName = this.ComponentNameRepository.create({
        name: reqName 
      })

    const { id, name } = await this.ComponentNameRepository.save(createdComponentName)

    return {
      id,
      text: name,
      value: name,
    }
  }
}

