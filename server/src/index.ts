import "dotenv-safe"
import 'module-alias/register';

import { createConnection } from "typeorm";
import dotenv from "dotenv";
import { join } from "path";

import { __prod__ } from "@const";

import app from "./app"

dotenv.config();

const connectToDataBase = async () => {
  let retries = 5;
  const TIMEOUT = 5000;  // wait 5 seconds

  while (retries) {
    try {
     const conn = await createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [join(__dirname, "./entities/*{.ts,.js}")],
        migrations: [join(__dirname, "./migrations/*{.ts,.js}")],
        ssl: { rejectUnauthorized: true },
        synchronize: false,
        migrationsRun: true,
        cli: {
          entitiesDir: "entities",
          migrationsDir: 'migrations',
        }
      })
      await conn.runMigrations()

      break;
    } catch (err) {
      console.log(err);
      retries -= 1;
      console.log(`retries left: ${retries}`);
      await new Promise(res => setTimeout(res, TIMEOUT));
    }
  }
}

connectToDataBase().then(async _ => {
  app.listen(parseInt(process.env.PORT!), () => console.log(`Server started on port: ${process.env.PORT}`));
}).catch(error => console.error(error))