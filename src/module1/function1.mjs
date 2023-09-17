export const handler = async (event) => {
  const { num1, num2 } = event;
  
  if (num1 === null || num2 === null || num1 === undefined || num2 === undefined) {
      throw new Error("Invalid input");
  }

  const result = add(num1, num2);
  return {
      statusCode: 200,
      body: JSON.stringify({ result }),
  };
};