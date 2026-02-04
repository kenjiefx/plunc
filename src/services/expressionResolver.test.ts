import { expect } from "chai";
import { resolvePluncExpression } from "./expressionResolver";

describe("resolvePluncExpression", () => {
  it("should resolve basic field", () => {
    const object = {
      firstName: "John",
    };
    const result = resolvePluncExpression(object, "firstName");
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
    const result = resolvePluncExpression(object, "user.profile.age");
    expect(result).to.equal(30);
  });
  it("should return undefined string for non-existing field", () => {
    const object = {
      firstName: "John",
    };
    const result = resolvePluncExpression(object, "lastName");
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
    const result = resolvePluncExpression(object, "user.profile.height");
    expect(result).to.equal(undefined);
  });
  it("should return value for function expression", () => {
    const object = {
      getFullName: () => "John Doe",
    };
    const result = resolvePluncExpression(object, "getFullName()");
    expect(result).to.equal("John Doe");
  });
  it("should return value for operation expressions with fields and subFields", () => {
    const object = {
      a: 10,
      b: 20,
      c: { d: 30 },
      e: { f: 5 },
    };

    //
    // ADDITION
    //
    expect(resolvePluncExpression(object, "a + b")).to.equal(30);
    expect(resolvePluncExpression(object, "a + c.d")).to.equal(40);
    expect(resolvePluncExpression(object, "c.d + a")).to.equal(40);
    expect(resolvePluncExpression(object, "c.d + e.f")).to.equal(35);

    //
    // SUBTRACTION
    //
    expect(resolvePluncExpression(object, "a - b")).to.equal(-10);
    expect(resolvePluncExpression(object, "a - c.d")).to.equal(-20);
    expect(resolvePluncExpression(object, "c.d - a")).to.equal(20);
    expect(resolvePluncExpression(object, "c.d - e.f")).to.equal(25);

    //
    // MULTIPLICATION
    //
    expect(resolvePluncExpression(object, "a * b")).to.equal(200);
    expect(resolvePluncExpression(object, "a * c.d")).to.equal(300);
    expect(resolvePluncExpression(object, "c.d * a")).to.equal(300);
    expect(resolvePluncExpression(object, "c.d * e.f")).to.equal(150);

    //
    // DIVISION
    //
    expect(resolvePluncExpression(object, "b / a")).to.equal(2);
    expect(resolvePluncExpression(object, "c.d / a")).to.equal(3);
    expect(resolvePluncExpression(object, "a / e.f")).to.equal(2);
    expect(resolvePluncExpression(object, "c.d / e.f")).to.equal(6);

    //
    // MODULO
    //
    expect(resolvePluncExpression(object, "b % a")).to.equal(0);
    expect(resolvePluncExpression(object, "c.d % a")).to.equal(0);
    expect(resolvePluncExpression(object, "a % e.f")).to.equal(0);
    expect(resolvePluncExpression(object, "c.d % e.f")).to.equal(0);
  });
  it("should return value for basic operation expression", () => {
    const result = resolvePluncExpression({}, "2 + 15");
    expect(result).to.equal(17);

    const result2 = resolvePluncExpression({}, "10 - 3");
    expect(result2).to.equal(7);

    const result3 = resolvePluncExpression({}, "4 * 5");
    expect(result3).to.equal(20);

    const result4 = resolvePluncExpression({}, "20 / 4");
    expect(result4).to.equal(5);
  });
  it("should return value for operations between object fields/subFields and numbers", () => {
    const object = {
      a: 10,
      b: {
        c: 20,
      },
    };

    //
    // ADDITION
    //
    expect(resolvePluncExpression(object, "a + 3")).to.equal(13);
    expect(resolvePluncExpression(object, "b.c + 3")).to.equal(23);
    expect(resolvePluncExpression(object, "3 + a")).to.equal(13);
    expect(resolvePluncExpression(object, "3 + b.c")).to.equal(23);

    //
    // SUBTRACTION
    //
    expect(resolvePluncExpression(object, "a - 3")).to.equal(7);
    expect(resolvePluncExpression(object, "b.c - 3")).to.equal(17);
    expect(resolvePluncExpression(object, "30 - a")).to.equal(20);
    expect(resolvePluncExpression(object, "30 - b.c")).to.equal(10);

    //
    // MULTIPLICATION
    //
    expect(resolvePluncExpression(object, "a * 3")).to.equal(30);
    expect(resolvePluncExpression(object, "b.c * 3")).to.equal(60);
    expect(resolvePluncExpression(object, "3 * a")).to.equal(30);
    expect(resolvePluncExpression(object, "3 * b.c")).to.equal(60);

    //
    // DIVISION
    //
    expect(resolvePluncExpression(object, "a / 2")).to.equal(5);
    expect(resolvePluncExpression(object, "b.c / 2")).to.equal(10);
    expect(resolvePluncExpression(object, "40 / a")).to.equal(4);
    expect(resolvePluncExpression(object, "40 / b.c")).to.equal(2);

    //
    // MODULO
    //
    expect(resolvePluncExpression(object, "a % 3")).to.equal(1);
    expect(resolvePluncExpression(object, "b.c % 6")).to.equal(2);
    expect(resolvePluncExpression(object, "25 % a")).to.equal(5);
    expect(resolvePluncExpression(object, "25 % b.c")).to.equal(5);
  });

  it("should correctly return boolean value", () => {
    const object = {
      a: true,
      b: false,
      c: {
        d: true,
      },
    };

    expect(resolvePluncExpression(object, "a")).to.equal(true);
    expect(resolvePluncExpression(object, "b")).to.equal(false);
    expect(resolvePluncExpression(object, "c.d")).to.equal(true);
  });

  it("should execute functions correctly", () => {
    const object = {
      a: () => 30,
      b: {
        c: () => 40,
      },
      e: (t: string) => t,
      f: (x: number) => x * 10,
      g: 2,
      i: (x: number, y: number) => x + y,
      j: {
        k: 5,
      },
    };
    expect(resolvePluncExpression(object, "a()")).to.equal(30);
    expect(resolvePluncExpression(object, "b.c()")).to.equal(40);
    expect(resolvePluncExpression(object, "e('hello')")).to.equal("hello");
    expect(resolvePluncExpression(object, "f(g)")).to.equal(20);
    expect(resolvePluncExpression(object, "i(2,2)")).to.equal(4);
    expect(resolvePluncExpression(object, "i(g, 4)")).to.equal(6);
    expect(resolvePluncExpression(object, "i(g, j.k)")).to.equal(7);
    expect(resolvePluncExpression(object, "i(j.k, j.k)")).to.equal(10);

    /** @TODO */
    // expect(resolvePluncExpression(object, "a() + g")).to.equal(32);
  });
});
