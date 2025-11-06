import { expect } from "vitest";

declare module "vitest" {
  interface Assertion<T = any> {
    toContainLike: (condition: any) => void;
  }
}

expect.extend({
  toContainLike<T = any>(
    recieved: ArrayLike<T>,
    checkFunction: (item: any, index: number, arr: ArrayLike<T>) => boolean
  ) {
    if (typeof recieved !== "object" || Number.isInteger(recieved.length)) {
      return { message: () => "expected to recieve array-like", pass: false };
    }

    for (let i = 0; i < recieved.length; ++i) {
      if (checkFunction(recieved[i], i, recieved) == false) {
        return {
          message: () => "expected all items to pass a check",
          pass: false,
        };
      }
    }

    return { message: () => "expected all items to pass a check", pass: true };
  },
});
