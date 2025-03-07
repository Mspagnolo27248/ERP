


export function Char(value: string, expectedLength: number): string {
    if (value.length !== expectedLength) {
        throw new Error(`Char must be ${expectedLength} characters long, but got ${value.length}`);
    }
    return value;
}

