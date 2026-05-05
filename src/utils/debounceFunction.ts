export const debounceFunction = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
