


export abstract class Repository {

     protected thowInfrastuctureError(error:any):never{
        const infrastructureError = error instanceof Error ? error : new Error('Default Infrastructure Error');
        infrastructureError.name = 'InfrastructureError';
        throw infrastructureError;        
    }
}


