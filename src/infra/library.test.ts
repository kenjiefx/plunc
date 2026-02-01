import { expect } from "chai";
import {
  createNewHandlerLibrary,
  addHandlerToLibrary,
  getComponentHandlerFromLibrary,
  getServiceHandlerFromLibrary,
  getFactoryHandlerFromLibrary,
  getHelperHandlerFromLibrary,
} from "./library";

describe("Library Module Tests", () => {
  // Since the library functions are straightforward wrappers around
  // internal data structures, we will test the add and get functions
  // together to ensure they work as expected.
  it("should add and retrieve handlers correctly", () => {
    const library = createNewHandlerLibrary();

    // Define some mock handlers
    const componentHandler = (props: any) => `<div>${props.content}</div>`;
    const serviceHandler = (props: any) => ({ data: props.data });
    const factoryHandler = () => (config: any) => ({ config });
    const helperHandler = (input: any, options: any) => input.toUpperCase();
    // Add handlers to the library
    addHandlerToLibrary(library, "MyComponent", "component", componentHandler);
    addHandlerToLibrary(library, "MyService", "service", serviceHandler);
    addHandlerToLibrary(library, "MyFactory", "factory", factoryHandler);
    addHandlerToLibrary(library, "MyHelper", "helper", helperHandler);

    // Retrieve and verify the handlers
    const retrievedComponent = getComponentHandlerFromLibrary(
      library,
      "MyComponent",
    );
    expect(retrievedComponent).to.equal(componentHandler);
    const retrievedService = getServiceHandlerFromLibrary(library, "MyService");
    expect(retrievedService).to.equal(serviceHandler);
    const retrievedFactory = getFactoryHandlerFromLibrary(library, "MyFactory");
    expect(retrievedFactory).to.equal(factoryHandler);
    const retrievedHelper = getHelperHandlerFromLibrary(library, "MyHelper");
    expect(retrievedHelper).to.equal(helperHandler);
  });

  it("should return null for non-existent handlers", () => {
    const library = createNewHandlerLibrary();
    expect(getComponentHandlerFromLibrary(library, "NonExistent")).to.be.null;
    expect(getServiceHandlerFromLibrary(library, "NonExistent")).to.be.null;
    expect(getFactoryHandlerFromLibrary(library, "NonExistent")).to.be.null;
    expect(getHelperHandlerFromLibrary(library, "NonExistent")).to.be.null;
  });

  it("should throw error when using invalid library", () => {
    const invalidLibrary = {} as any;
    expect(() => {
      getComponentHandlerFromLibrary(invalidLibrary, "Test");
    }).to.throw();
    expect(() => {
      getServiceHandlerFromLibrary(invalidLibrary, "Test");
    }).to.throw();
    expect(() => {
      getFactoryHandlerFromLibrary(invalidLibrary, "Test");
    }).to.throw();
    expect(() => {
      getHelperHandlerFromLibrary(invalidLibrary, "Test");
    }).to.throw();
  });
});
