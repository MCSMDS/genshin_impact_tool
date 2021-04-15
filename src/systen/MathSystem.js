import Big from "big.js";

export const sum = (...args) => args.reduce((big, num) => big.plus(num), Big(0)).toNumber();
export const plus = (a, b) => Big(a).plus(b).toNumber();
export const minus = (a, b) => Big(a).minus(b).toNumber();
export const div = (a, b) => Big(a).div(b).toNumber();
export const fixPercentage = (a, b) => Big(a).div(b).times(100).toNumber();
export const buildPercentage = (b, progress) => {
  let a = 0;
  return () => {
    progress(Big(a = a + 1).div(b).times(100).toNumber());
  }
};