/*
// Use Cases
// 1. Implement Try Catch explictily and Throw Application Errors or Bubble up Domain/ Infra Errors.
// 2. Parses Dat 
//
*/







export abstract class UseCase {

   execute(...params: any[]): Promise<any> | void{
      throw new Error('Not Implemented')
   };

   protected throwApplicationError(message: string='Application Error'): never {
      throw new Error(message);
  }



  }


