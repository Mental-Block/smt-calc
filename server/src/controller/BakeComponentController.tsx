// import { BAKE, COMPONENT, ENTITY } from "@const";
// import { Component } from "@entities";
// import BakeComponent from "@entities/bakeComponent";
// import Table from "@util/Table";
// import { getRepository } from "typeorm"

// export default class BakeComponentController {
//     private BakeComponentRepository = getRepository(BakeComponent)

//     async all(req: Request<{}, {}, {}, any>) {
//         let { page, pageSize, sortField, sortOrder} = req.query
//         const { 
//           bodyThickness, 
//           mslLevel, 
//           partnumberInternal, 
//           partnumberManufactor, 
//           packageType  
//         } = req.query
    
//         const createdPage = Table.createPage(page, pageSize)
//         const createdSort = Table.createSort(
//           sortField,
//           sortOrder,
//         )
    
//         const data = await this.BakeComponentRepository
//         .createQueryBuilder(`${ENTITY.bakecomponent}`)
//         .leftJoinAndSelect(`${ENTITY.bakecomponent}.${ENTITY.component}`, )
//         .select([
//           `.${COMPONENT.id}`,
//           `${ENTITY.component}.${COMPONENT.bodyThickness}`,
//           `${ENTITY.component}.${COMPONENT.mslLevel}`,
//           `${ENTITY.component}.${COMPONENT.packageType}`,
//           `${ENTITY.component}.${COMPONENT.partnumberInternal}`,
//         ])
//         .where(bodyThickness ? `${ENTITY.component}.${COMPONENT.bodyThickness} ::TEXT ILIKE :${COMPONENT.bodyThickness} ::TEXT` 
//         : `TRUE`, {bodyThickness: `%${bodyThickness}%`})
//         .andWhere(partnumberInternal ?  `${ENTITY.component}.${COMPONENT.partnumberInternal} ILIKE :${COMPONENT.partnumberInternal}` 
//         : `TRUE`, { partnumberInternal: `%${partnumberInternal}%` })
//         .andWhere(partnumberManufactor ?  `${ENTITY.component}.${COMPONENT.partnumberManufactor} ILIKE :${COMPONENT.partnumberManufactor}` 
//         : `TRUE`, { partnumberManufactor: `%${partnumberManufactor}%` })
//         .andWhere(packageType ? `${ENTITY.component}.${COMPONENT.packageType} ::TEXT[] && STRING_TO_ARRAY(:${COMPONENT.packageType}, ' ')` 
//         : 'TRUE', { packageType })
//         .andWhere( mslLevel ?  
//           `${ENTITY.component}.${COMPONENT.mslLevel} ::TEXT = ANY(STRING_TO_ARRAY(:${COMPONENT.mslLevel},' ')::TEXT[])` 
//           : `TRUE`, { mslLevel })
//         .skip(createdPage.skip)
//         .take(createdPage.pageSize)
//         .orderBy('name', createdSort.sortOrder)
//         .getManyAndCount()
        
//         return { records: data[0], pageLength: data[1] }
//       }
// }