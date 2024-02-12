export const sum = (a: number, b: number) => {
  return a + b;
};

export const multiply = (a: number, b: number, callback: () => {}) => {
  const result = a * b;

  for (let i = 0; i < result; i++) {
    callback();
  }

  return a * b;
};

const TestFile = () => {
  return <h1>Vitest !!</h1>;
};

export default TestFile;
