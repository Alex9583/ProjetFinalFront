export const formatBalance = (balance: bigint | undefined): string => {
    if (!balance) return '0,00';
    const whole = balance / 100n;
    const decimal = balance % 100n;
    return `${whole},${decimal.toString().padStart(2, '0')}`
}