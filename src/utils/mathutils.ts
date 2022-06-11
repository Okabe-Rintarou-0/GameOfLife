export function roundDown(num: number, base: number): number {
    return num - num % base;
}