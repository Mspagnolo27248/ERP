


export abstract class BaseError extends Error {
    public readonly name: string;
    public readonly isOperational: boolean;

    protected constructor(name: string, message: string, isOperational = true) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
        this.isOperational = isOperational;
        Error.captureStackTrace(this);
    }
}

export class DomainError extends BaseError {
    constructor(error:any,fallBackMessage?: string) {
        let message = fallBackMessage||'Domain Error'
        if(error instanceof Error) message = `${error.message} - ${message}`;
        super('DomainError', message);
    }
}



export class ApplicationError extends BaseError {
    constructor(error:any,fallBackMessage?: string) {
        let message = fallBackMessage||'Application Error'
        if(error instanceof Error) message = `${error.message} - ${message}`;
        super('ApplicationError', message);
    }
}



export class InfrastructureError extends BaseError {
    constructor(error:any,fallBackMessage?: string) {
        let message = fallBackMessage||'Infrastructure Error'
        if(error instanceof Error) message = `${error.message} - ${message}`;
        super('InfrastructureError', message);
    }
}