export const flipCoin = (): string => {
  if (Math.random() < 0.5) {
    return "selectionA";
  }
  return "selectionB";
};
