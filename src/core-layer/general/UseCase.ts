/*
// Use Cases
// 1. Implement Try Catch explictily and Throw Application Errors or Bubble up Domain/ Infra Errors.
// 2. Parse input data 
// 3. does existance checking
// 4. convert dto to entites
// 5. returns dto only not entites so no domain logic is leaked
*/ 


export abstract class UseCase {

   execute(...params: any[]): Promise<any> | void{
      throw new Error('Not Implemented')
   };

   protected throwApplicationError(message:string): never {
      const error = new Error(`ApplicationError:${message}`);
      error.name = 'ApplicationError'
      throw error
  }



  }


