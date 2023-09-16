import { handler } from './function1.mjs';
import { expect } from 'chai';

describe('function1 Lambda handler tests', () => {
  it('should add two numbers correctly', async () => {
    const event = {
      num1: 2,
      num2: 3
    };

    const response = await handler(event);
    
    const responseBody = JSON.parse(response.body);

    expect(response.statusCode).to.equal(200);
    expect(responseBody.result).to.equal(5);
  });
});
