



export function ValueError(message:string): never {
 
        const error = new Error(`ValueError:${message}`);  
        error.name = 'ValueError'
        throw error
    }


