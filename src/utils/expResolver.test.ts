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
    expect(resolveExpression(object, "a + b")).to.equal(30);
    expect(resolveExpression(object, "a + c.d")).to.equal(40);
    expect(resolveExpression(object, "c.d + a")).to.equal(40);
    expect(resolveExpression(object, "c.d + e.f")).to.equal(35);

    //
    // SUBTRACTION
    //
    expect(resolveExpression(object, "a - b")).to.equal(-10);
    expect(resolveExpression(object, "a - c.d")).to.equal(-20);
    expect(resolveExpression(object, "c.d - a")).to.equal(20);
    expect(resolveExpression(object, "c.d - e.f")).to.equal(25);

    //
    // MULTIPLICATION
    //
    expect(resolveExpression(object, "a * b")).to.equal(200);
    expect(resolveExpression(object, "a * c.d")).to.equal(300);
    expect(resolveExpression(object, "c.d * a")).to.equal(300);
    expect(resolveExpression(object, "c.d * e.f")).to.equal(150);

    //
    // DIVISION
    //
    expect(resolveExpression(object, "b / a")).to.equal(2);
    expect(resolveExpression(object, "c.d / a")).to.equal(3);
    expect(resolveExpression(object, "a / e.f")).to.equal(2);
    expect(resolveExpression(object, "c.d / e.f")).to.equal(6);

    //
    // MODULO
    //
    expect(resolveExpression(object, "b % a")).to.equal(0);
    expect(resolveExpression(object, "c.d % a")).to.equal(0);
    expect(resolveExpression(object, "a % e.f")).to.equal(0);
    expect(resolveExpression(object, "c.d % e.f")).to.equal(0);
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
    expect(resolveExpression(object, "a + 3")).to.equal(13);
    expect(resolveExpression(object, "b.c + 3")).to.equal(23);
    expect(resolveExpression(object, "3 + a")).to.equal(13);
    expect(resolveExpression(object, "3 + b.c")).to.equal(23);

    //
    // SUBTRACTION
    //
    expect(resolveExpression(object, "a - 3")).to.equal(7);
    expect(resolveExpression(object, "b.c - 3")).to.equal(17);
    expect(resolveExpression(object, "30 - a")).to.equal(20);
    expect(resolveExpression(object, "30 - b.c")).to.equal(10);

    //
    // MULTIPLICATION
    //
    expect(resolveExpression(object, "a * 3")).to.equal(30);
    expect(resolveExpression(object, "b.c * 3")).to.equal(60);
    expect(resolveExpression(object, "3 * a")).to.equal(30);
    expect(resolveExpression(object, "3 * b.c")).to.equal(60);

    //
    // DIVISION
    //
    expect(resolveExpression(object, "a / 2")).to.equal(5);
    expect(resolveExpression(object, "b.c / 2")).to.equal(10);
    expect(resolveExpression(object, "40 / a")).to.equal(4);
    expect(resolveExpression(object, "40 / b.c")).to.equal(2);

    //
    // MODULO
    //
    expect(resolveExpression(object, "a % 3")).to.equal(1);
    expect(resolveExpression(object, "b.c % 6")).to.equal(2);
    expect(resolveExpression(object, "25 % a")).to.equal(5);
    expect(resolveExpression(object, "25 % b.c")).to.equal(5);
  });

  it("should correctly return boolean value", () => {
    const object = {
      a: true,
      b: false,
      c: {
        d: true,
      },
    };

    expect(resolveExpression(object, "a")).to.equal(true);
    expect(resolveExpression(object, "b")).to.equal(false);
    expect(resolveExpression(object, "c.d")).to.equal(true);
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
    expect(resolveExpression(object, "a()")).to.equal(30);
    expect(resolveExpression(object, "b.c()")).to.equal(40);
    expect(resolveExpression(object, "e('hello')")).to.equal("hello");
    expect(resolveExpression(object, "f(g)")).to.equal(20);
    expect(resolveExpression(object, "i(2,2)")).to.equal(4);
    expect(resolveExpression(object, "i(g, 4)")).to.equal(6);
    expect(resolveExpression(object, "i(g, j.k)")).to.equal(7);
    expect(resolveExpression(object, "i(j.k, j.k)")).to.equal(10);

    /** @TODO */
    // expect(resolveExpression(object, "a() + g")).to.equal(32);
  });
});
