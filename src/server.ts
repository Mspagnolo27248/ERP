// src/index.js
import express from "express";
import dotenv from "dotenv";
import router from "./rest-api/router";
import cors from 'cors';
import { swaggerSpec } from './swaggerConfig'
import swaggerUi from 'swagger-ui-express';
import { registerDependencies } from "./shared-common/dependancy-injection/register-dependanies";
import { ConnectionManager } from "./shared-common/database/custom-orm/orm/ConnectionManager";
import path from 'path';


dotenv.config();
const app = express();
const port = process.env.PORT || 8001;
app.use(cors());
app.use('/api-docs', //http://localhost:8001/api-docs/
  swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// Middleware to parse JSON request bodies globally
registerDependencies();//Register Dependacy Injection Container
ConnectionManager.getInstance().configureConnection('sqlite',
  {
    database: path.join('./', 'database.sqlite')
  }
)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));
app.use('/', router);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});