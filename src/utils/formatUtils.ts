export const formatBalance = (balance: bigint): string => {
    const whole = balance / 100n;
    const decimal = balance % 100n;
    return `${whole},${decimal.toString().padStart(2, '0')}`
}