
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import morgan from "morgan";

import { Response, Request, NextFunction}  from 'express';
import { validationResult } from "express-validator"

import Routes from "./Routes";

  const handleError = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    return res.status(err.statusCode || 500).send({ message: err.message })
  }

  const app = express()

  app.use(morgan('tiny'))
  app.set('trust proxy', 1)
  app.use(express.json())
  app.use(cookieParser())
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN!,
      credentials: true
    })
  );

  Routes.forEach(route => {
    (app as any)[route.method](route.route,
        ...route.validation,
        async (req: Request, res: Response, next: Function) => {
            try {
              const errors = validationResult(req);
              if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
              }
        
              const result = await (new route.controller)[route.action](req, res, next);
              return res.json(result);
            } catch(err) {
              next(err);
            }
        });
  });

  app.use(handleError)

  export default app