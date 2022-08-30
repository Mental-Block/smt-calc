import { CreatedPage, SortProps } from "@interfaces/table"
import { replaceAll } from "./replaceAll"

export default class Table {
   static createSort (
       field: string | undefined = "id" , 
       order: string | undefined = "ASC",
): SortProps {
    if(order === "descend"){
            order = "DESC"
        } else {
            order = "ASC"
        }

        return {
            sortField: field,
            sortOrder: order as Pick<SortProps, 'sortOrder'>['sortOrder']
        }
    }

    static createPage (page: number | undefined = 1 , pageSize: number | undefined = 200): CreatedPage {
        const skip = (pageSize * page) - pageSize
        
        return {
            page,
            pageSize,
            skip
        }
    }

    static fixSortFeild(sortField: string | undefined, defaultSortField: {
        default: string,
        prefix?: string,
    }, fields: string[]): Pick<SortProps, 'sortField'>['sortField'] {
       if (!sortField) sortField = defaultSortField.default
       
       fields.map(field => {
        if(sortField === field) {
            sortField = replaceAll(`${sortField}`, '_', '.')
        }
       })

       if (defaultSortField.prefix && sortField !== defaultSortField.default) {
           sortField = `${defaultSortField.prefix}.${sortField}`
       }

        return sortField
    }
}
