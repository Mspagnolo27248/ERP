import { Router } from "express";
import rackPriceRoutes from "./routes/rack-price.routes";
import productsRoutes from "./routes/products-routes";

// **** ROUTER.TS lists Resource endpoints root paths and the files that specify the http verb paths.***
/*
Notes:
- Routes should be lowercase and kebab case.
- Routes should be plural
- Specific route URI's should be defined in the .routes/<resoure>.routes files.
*/ 


const router = Router();


/*This should be a list of Resources*/
router.use('/rack-price',rackPriceRoutes);
router.use('/products',productsRoutes);
//router.use('/special-price',specialPriceRoutes);
// router.use('/orders',ordersRoutes);
// router.use('/special-price',specialPriceRoutes);
// router.use('/forecast-model',forecastModelRoutes);




export default router;