import { expect } from "chai";
import { ComponentId } from "../types";
import {
  createComponentLineage,
  addRecordToComponentLineage,
  lookupComponentLineage,
  whoAreTheChildrenOfComponent,
  whoIsTheParentOfComponent,
} from "./lineageService";

describe("Component Family Tree", () => {
  let tree = createComponentLineage();
  const parentId = "parent-component" as ComponentId;
  const childId = "child-component" as ComponentId;
  beforeEach(() => {
    tree = createComponentLineage();
  });
  it("should create an empty component lineage", () => {
    expect(tree).to.be.an("object");
    expect(Object.keys((tree as any).data)).to.have.lengthOf(0);
  });

  it("should add a parent-child record to the lineage", () => {
    addRecordToComponentLineage(tree, parentId, childId);
    const internalData = (tree as any).data;
    expect(internalData[parentId]).to.exist;
    expect(internalData[parentId].children).to.include(childId);
    expect(internalData[childId]).to.exist;
    expect(internalData[childId].parent).to.equal(parentId);
  });

  it("should lookup the lineage of a given component ID", () => {
    addRecordToComponentLineage(tree, parentId, childId);
    const ancestors = lookupComponentLineage(tree, childId);
    expect(ancestors).to.be.an("array").that.includes(parentId);
  });

  it("should return the children of a given parent component", () => {
    addRecordToComponentLineage(tree, parentId, childId);
    const children = whoAreTheChildrenOfComponent(tree, parentId);
    expect(children).to.be.an("array").that.includes(childId);
  });

  it("should return the parent of a given child component", () => {
    addRecordToComponentLineage(tree, parentId, childId);
    const parent = whoIsTheParentOfComponent(tree, childId);
    expect(parent).to.equal(parentId);
  });
});
