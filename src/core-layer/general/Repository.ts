


export abstract class Repository {

     protected thowInfrastuctureError(): never{
        const error = new Error('Infrastructure Error')
        error.name = 'InfrastructureError'
        throw error
    }
}

