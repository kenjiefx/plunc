import { expect } from "chai";
import { resolveExpression } from "./expResolver";

describe("resolveExpression", () => {
  it("should resolve basic field", () => {
    const object = {
      firstName: "John",
    };
    const result = resolveExpression(object, "firstName");
    expect(result).to.equal("John");
  });
  it("should resolve nested field", () => {
    const object = {
      user: {
        profile: {
          age: 30,
        },
      },
    };
    const result = resolveExpression(object, "user.profile.age");
    expect(result).to.equal(30);
  });
  it("should return undefined string for non-existing field", () => {
    const object = {
      firstName: "John",
    };
    const result = resolveExpression(object, "lastName");
    expect(result).to.equal(undefined);
  });
  it("should return undefined for non-existing nested field", () => {
    const object = {
      user: {
        profile: {
          age: 30,
        },
      },
    };
    const result = resolveExpression(object, "user.profile.height");
    expect(result).to.equal(undefined);
  });
  it("should return value for function expression", () => {
    const object = {
      getFullName: () => "John Doe",
    };
    const result = resolveExpression(object, "getFullName()");
    expect(result).to.equal("John Doe");
  });
  it("should return value for operation expression of object fields", () => {
    const object = {
      a: 10,
      b: 20,
    };
    const result = resolveExpression(object, "a + b");
    expect(result).to.equal(30);
  });
  it("should return value for basic operation expression", () => {
    const result = resolveExpression({}, "2 + 15");
    expect(result).to.equal(17);

    const result2 = resolveExpression({}, "10 - 3");
    expect(result2).to.equal(7);

    const result3 = resolveExpression({}, "4 * 5");
    expect(result3).to.equal(20);

    const result4 = resolveExpression({}, "20 / 4");
    expect(result4).to.equal(5);
  });
  it("should return value for operation of object fields and numbers", () => {
    const object = {
      a: 10,
    };
    const result = resolveExpression(object, "a * 3");
    expect(result).to.equal(30);

    const result2 = resolveExpression(object, "a + 7");
    expect(result2).to.equal(17);

    const result3 = resolveExpression(object, "a - 2");
    expect(result3).to.equal(8);

    const result4 = resolveExpression(object, "a / 2");
    expect(result4).to.equal(5);
  });
});
