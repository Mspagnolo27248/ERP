import { Response } from "express";
import { ApplicationError, DomainError, InfrastructureError } from "../../core-layer/general/Errors/errors";



export function handleError(res: Response, error: unknown): Response {
    if (error instanceof DomainError) {
        return res.status(400).json({ message: error.message }); 
    }

    if (error instanceof InfrastructureError) {
        return res.status(500).json({ message: error.message }); 
    }

    if (error instanceof ApplicationError) {
        return res.status(500).json({ message: error.message }); 
    }

    if (error instanceof Error) {
        return res.status(500).json({ message: error.message }); 
    }

    console.error("Unexpected error occurred:", error);
    return res.status(500).json({ message: "An unexpected error occurred" }); 
}
