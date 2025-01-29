import { DomainErrorNameType, IDomainError } from "../Entity";



export class DomainError extends Error implements IDomainError {

  // name: properties exist on parent Error
  // message: properties exist on parent Error
  // stack: properties exist on parent Error
  public readonly type: DomainErrorNameType;

  constructor(message:string,type:DomainErrorNameType) {
    super(message);
    this.type = type;  
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}




  

  