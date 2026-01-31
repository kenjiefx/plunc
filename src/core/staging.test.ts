import { expect } from "chai";
import {
  commitStagingElementTo,
  createStagingElement,
  getStagingElementInnerHtml,
  setStagingElementInnerHtml,
} from "./staging";

describe("Staging Element Tests", () => {
  it("should create a staging element with state field", () => {
    const stagingElement = createStagingElement();
    expect(stagingElement.$plStgCS).to.be.false;
  });
  it("should create a staging element with initial innerHTML", () => {
    const initialHtml = "<div>Hello World</div>";
    const stagingElement = createStagingElement(initialHtml);
    expect(stagingElement.innerHTML).to.equal(initialHtml);
  });
  it("should allow setting and getting innerHTML before committing", () => {
    const stagingElement = createStagingElement();
    const newHtml = "<p>New Content</p>";
    stagingElement.innerHTML = newHtml;
    expect(stagingElement.innerHTML).to.equal(newHtml);
  });
  it("should throw error when setting innerHTML after committing", () => {
    const stagingElement = createStagingElement();
    const targetElement = document.createElement("div");
    // Commit the staging element
    commitStagingElementTo(stagingElement, targetElement);
    expect(() => {
      setStagingElementInnerHtml(stagingElement, "<span>Should Fail</span>");
    }).to.throw();
  });
  it("should throw error when getting innerHTML after committing", () => {
    const stagingElement = createStagingElement();
    const targetElement = document.createElement("div");
    // Commit the staging element
    commitStagingElementTo(stagingElement, targetElement);
    expect(() => {
      const html = getStagingElementInnerHtml(stagingElement);
    }).to.throw();
  });
  it("should throw error when committing an already committed staging element", () => {
    const stagingElement = createStagingElement();
    const targetElement1 = document.createElement("div");
    const targetElement2 = document.createElement("div");
    // First commit
    commitStagingElementTo(stagingElement, targetElement1);
    expect(() => {
      // Second commit should fail
      commitStagingElementTo(stagingElement, targetElement2);
    }).to.throw();
  });
});
