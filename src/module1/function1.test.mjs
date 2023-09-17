import { handler, add } from './function1.mjs';

describe('function1 handlerのテスト', () => {
    it('2つの正の数の加算が正しく行われる', async () => {
        const response = await handler({ num1: 5, num2: 3 });
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body).result).toBe(8);
    });

    it('負の数と正の数の加算が正しく行われる', async () => {
        const response = await handler({ num1: -5, num2: 3 });
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body).result).toBe(-2);
    });

    it('正の数と負の数の加算が正しく行われる', async () => {
        const response = await handler({ num1: 5, num2: -3 });
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body).result).toBe(2);
    });

    it('2つの負の数の加算が正しく行われる', async () => {
        const response = await handler({ num1: -5, num2: -3 });
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body).result).toBe(-8);
    });

    it('num1がゼロの場合の処理が正しく行われる', async () => {
        const response = await handler({ num1: 0, num2: 3 });
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body).result).toBe(3);
    });

    it('num2がゼロの場合の処理が正しく行われる', async () => {
        const response = await handler({ num1: 5, num2: 0 });
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body).result).toBe(5);
    });

    it('num1がnullの場合の処理', async () => {
        await expect(handler({ num1: null, num2: 3 })).rejects.toThrow();
    });

    it('num2がnullの場合の処理', async () => {
        await expect(handler({ num1: 5, num2: null })).rejects.toThrow();
    });

    it('num1がundefinedの場合の処理', async () => {
        await expect(handler({ num2: 3 })).rejects.toThrow();
    });

    it('num2がundefinedの場合の処理', async () => {
        await expect(handler({ num1: 5 })).rejects.toThrow();
    });
});
