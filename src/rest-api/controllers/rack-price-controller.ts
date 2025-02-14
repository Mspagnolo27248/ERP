import { NextFunction, Request, Response } from "express";
import { RackPriceDto } from "../../core-layer/pricing-module/data-transfer-objects/price-records-dtos";
import { container } from "../../shared-common/dependency-injection/register-dependencies";
import { withHttpErrorHandling } from "../utility/error-handler";


/*
              **** Presentaton Layer: Controllers ************
 1. **Receiving Request Input**: Handles incoming requests from routes and prepares to send responses back.
 2. **Parsing Input Request**: Extracts and type checks input data from the request object (e.g., body, query, params). 
      - Focus on type checking to ensure the data is in the expected format before passing it to use-cases.
      - Avoid performing business logic validation at this stage.
 3. **Dependency Injection**: Instantiates required repositories and services, injecting them into use-cases for execution.
 4. **Executes Use Cases these are the main entry points of the Application layer
 5. **Returning HTTP Responses**: Uses the response object to send appropriate HTTP responses. 
      - Example: `200 OK` for successful operations or `400 Bad Request` for invalid input.
*/


export class RackPriceController {

  @withHttpErrorHandling()
  static async getAll(req: Request, res: Response) {
    const filters = req.body;
    const usecase = container.resolve("GetRackPricingUseCase");
    const rackPrices = await usecase.execute(filters);
    return res.status(200).json(rackPrices);

  }


  @withHttpErrorHandling()
  static async getOne(req: Request, res: Response) {
    const keys = req.body as RackPriceDto;
    const usecase = container.resolve("GetRackPriceByKeyUseCase")
    const rackPrice = await usecase.execute(keys);
    return res.status(200).json(rackPrice);
  }


  @withHttpErrorHandling()
  static async upsert(req: Request, res: Response) {
    const createRackPriceUseCase = container.resolve("CreateRackPriceUseCase");
    const rackPriceDto = req.body as RackPriceDto;
    const rackPrice = await createRackPriceUseCase.execute(rackPriceDto);
    return res.status(201).json(rackPrice);
  }


  @withHttpErrorHandling()
  static async delete(req: Request, res: Response) {
    const rackPriceDto = req.body as RackPriceDto;
    const usecase = container.resolve("DeleteRackPriceUseCase");
    const rackPrice = await usecase.execute(rackPriceDto);
    return res.status(204).json('rackPrice');
  }


}






// Example of Middleware check libriary like ZOD can do this. 
export const checkBodyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productCode, containerCode, effectiveDate, effectiveTime, unitOfMeasure } = req.body;
  if (
    typeof productCode !== "string" ||
    typeof containerCode !== "string" ||
    typeof unitOfMeasure !== "string" ||
    typeof effectiveDate !== "number" ||
    typeof effectiveTime !== "number"
  ) {
    return res.status(400).json({ error: "Invalid request body. Ensure all fields are correct." });
  } else {
    next();
  }



};


