import { Request, Response, NextFunction } from "express";


 function handleError(error: any,res: Response): Response {

    if (error instanceof Error) {
        if(error.name === 'DomainError'){
            console.log(error.stack)
            return res.status(400).json({ message: error.message }); 
            
        }
        if(error.name === 'ApplicationError'){
            
            return res.status(400).json({ message: error.message }); 
        }
        if(error.name === 'InfrastructureError'){
            // console.log(error.stack)  
            return res.status(500).json({ message: error.message }); 
        }
    }

    console.error("Unexpected error occurred:", error);
    const msg = error?.message ? error.message : "An unexpected error occurred";
    return res.status(500).json({ message: msg }); 
}


// Decorator for error handling
export function withHttpErrorHandling() {
    return (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) => {
      const originalMethod = descriptor.value;
  
      descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
        try {
          await originalMethod.call(this, req, res, next);
        } catch (error) {
          handleError(error, res);
        }
      };
  
      return descriptor;
    };
  }
