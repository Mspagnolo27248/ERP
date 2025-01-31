import { Router } from "express";
import { ProductsController } from "../controllers/products-controller";






const productsRoutes = Router();
productsRoutes.get("/", ProductsController.getAll); 
productsRoutes.get("/:id", ProductsController.getOne);  
productsRoutes.post('/', ProductsController.upsert);  
//productsRoutes.put('/:id',ProductsController.upsert);  
productsRoutes.delete('/:id',ProductsController.delete);  

export default productsRoutes;
