export interface SortProps {
    sortField: string
    sortOrder: "ASC" | "DESC" | undefined
  }
  
  export interface PageProps {
    page: number,
    pageSize: number
  }
  
  export interface CreatedPage extends PageProps {
    skip: number
  }

export type TableProps = CreatedPage & SortProps