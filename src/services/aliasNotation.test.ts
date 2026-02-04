import { expect } from "chai";
import { parseAliasNotation } from "./aliasNotation";

describe("Alias Notation Parser", () => {
  it("should parse alias notation correctly", () => {
    const nameThatMayHaveAlias = "ComponentName as AliasName";
    const { name, alias } = parseAliasNotation(nameThatMayHaveAlias);
    expect(name).to.equal("ComponentName");
    expect(alias).to.equal("AliasName");
  });
  it("should return null alias when no alias is present", () => {
    const nameThatMayHaveAlias = "ComponentName";
    const { name, alias } = parseAliasNotation(nameThatMayHaveAlias);
    expect(name).to.equal("ComponentName");
    expect(alias).to.be.null;
  });
});
