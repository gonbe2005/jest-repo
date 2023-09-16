import { handler } from './function1.mjs';

describe('function1 Lambda handler tests', () => {
  it('should add two numbers correctly', async () => {
    const event = {
      num1: 2,
      num2: 3
    };

    const response = await handler(event);
    
    const responseBody = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(responseBody.result).toBe(5);
  });
});