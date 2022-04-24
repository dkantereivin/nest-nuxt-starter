export const assertOrThrow = (condition: boolean, exception: Error): void => {
    if (!condition) {
        throw exception;
    }
};
