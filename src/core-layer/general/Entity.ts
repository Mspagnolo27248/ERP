
/*
//  ENTITIES: 
// 1. Do not catch errors only throw  [DomainValiadtionError,DomainCalculationError ]
// 2. Validate Inputs in constructor
// 3. Do not do existance checking
// 4. 


*/


export abstract class Entity {
    toDTO() {
        const properties = Object.keys(this);
        const dto: Record<string, any> = {};
        for (const key of properties) {
            dto[key] = (this as any)[key];
        }
        return dto as typeof this;
    } 

    protected throwDomainError(message:string): never {
        const error = new Error(`DomainError:${message}`);  
        error.name = 'DomainError'
        throw error
    }
  
 
}

