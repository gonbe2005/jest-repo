export function add(a, b) {
    return a + b;
  }
  
  export const handler = async (event) => {
    const { num1, num2 } = event;
    const result = add(num1, num2);
    return {
      statusCode: 200,
      body: JSON.stringify({ result }),
    };
  };
  