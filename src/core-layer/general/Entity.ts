
/*
//  ENTITIES: 
// 1. Do not catch errors only throw  [DomainValiadtionError,DomainCalculationError ]
// 2. Validate Input in constructor
// 3. Do not do existance checking
// 4. 


*/

import { DomainError } from "./Errors/DomainError";

export abstract class Entity {
    toDTO() {
        const properties = Object.keys(this);
        const dto: Record<string, any> = {};
        for (const key of properties) {
            dto[key] = (this as any)[key];
        }
        return dto as typeof this;
    }

    protected throwDomainError = (message: string)=>{              
        throw   new DomainError(message,'DomainError');

    }

    protected throwDomainValidationError = (message: string)=>{              
        throw   new DomainError(message,'DomainValidationError');

    }

    protected throwDomainCalculationError = (message: string)=>{              
        throw   new DomainError(message,'DomainCalculationError');

    }

    protected thowDomainRuleViolationError = (message: string)=>{              
        throw   new DomainError(message,'DomainRuleViolationError');
    }
 
}

export interface IDomainError {
    name: string;      
    message: string;      
    stack?: string;    
    type: DomainErrorNameType; 
  }



  export type DomainErrorNameType = "DomainError"|"DomainValidationError"|"DomainRuleViolationError"|"DomainCalculationError";