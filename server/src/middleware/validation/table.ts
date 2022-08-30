import { ERRORS, TABLE } from "@const"
import { query } from "express-validator"

export const page = 
    query(TABLE.page)
    .optional({checkFalsy: true, nullable: true})
    .escape()
    .trim()
    .toInt()
    .isInt()
    .withMessage(ERRORS.numCheck)
    .bail()

export const pageSize = 
    query(TABLE.pageSize)
    .optional({checkFalsy: true, nullable: true})
    .escape()
    .trim()
    .toInt()
    .isInt()
    .withMessage(ERRORS.numCheck)
    .bail()

export const sortOrder = 
    query(TABLE.sortOrder)  
    .optional({checkFalsy: true, nullable: true})
    .escape()
    .trim()

export const sortFeild = 
    query(TABLE.sortField)
    .optional({checkFalsy: true, nullable: true})
    .escape()
    .trim()
    


