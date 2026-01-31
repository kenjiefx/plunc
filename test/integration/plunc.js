"use strict";
(() => {
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve2, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) =>
        x.done
          ? resolve2(x.value)
          : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // out/entities/component.js
  const createComponentFactory = (parseAliasNotationFn, createScopeFn) => {
    return function createComponent(id, nameThatMayHaveAlias) {
      const parsed = parseAliasNotationFn(nameThatMayHaveAlias);
      return {
        id,
        name: parsed.name,
        alias: parsed.alias,
        proxy: null,
        scope: createScopeFn(),
        template: `<!-- Component ${id} Template -->`,
        __brand__: Symbol("ComponentObject"),
      };
    };
  };
  function isComponentObject(entity) {
    return (
      entity && typeof entity === "object" && "id" in entity && "name" in entity
    );
  }
  function composeComponentIdGenerator(appCtx) {
    return function generateComponentId(childIteration, parentComponentId) {
      if (parentComponentId !== "") {
        return `${parentComponentId}.${childIteration.toString()}`;
      }
      return `${appCtx.id.toString()}.${childIteration.toString()}`;
    };
  }

  // out/entities/library.js
  function createNamespace(type, name) {
    return `${type}.${name}`;
  }
  function addToLibrary(library, name, type, handler) {
    library.data[createNamespace(type, name)] = handler;
  }
  function getComponentHandlerFromLibrary(library, name) {
    const result = library.data[createNamespace("component", name)];
    if (!result) {
      throw new Error(`Component handler "${name}" not found in the library.`);
    }
    return result;
  }
  function getServiceHandlerFromLibrary(library, name) {
    const result = library.data[createNamespace("service", name)];
    return result !== null && result !== void 0 ? result : null;
  }
  function getFactoryHandlerFromLibrary(library, name) {
    const result = library.data[createNamespace("factory", name)];
    return result !== null && result !== void 0 ? result : null;
  }
  function getHelperHandlerFromLibrary(library, name) {
    const result = library.data[createNamespace("helper", name)];
    return result !== null && result !== void 0 ? result : null;
  }

  // out/entities/lineage.js
  function addRecordToLineage(lineage, parent, child) {
    if (lineage.genealogy[parent] === void 0) {
      lineage.genealogy[parent] = {
        parent: null,
        children: [],
      };
    }
    if (child === null) return;
    lineage.genealogy[parent].children.push(child);
    if (lineage.genealogy[child] === void 0) {
      lineage.genealogy[child] = {
        parent,
        children: [],
      };
    }
  }
  function lookupLineage(lineage, child) {
    if (lineage.genealogy[child] === void 0) return [];
    const parents = [];
    let parent = lineage.genealogy[child].parent;
    while (parent !== null) {
      parents.push(parent);
      parent = lineage.genealogy[parent].parent;
    }
    return parents;
  }
  function whoAreTheChildren(lineage, parent) {
    if (lineage.genealogy[parent] === void 0) return [];
    return lineage.genealogy[parent].children;
  }
  function whoIsTheParent(lineage, child) {
    if (lineage.genealogy[child] === void 0) return null;
    return lineage.genealogy[child].parent;
  }
  function whoAreTheSiblings(lineage, child) {
    const parent = whoIsTheParent(lineage, child);
    if (parent === null) return [];
    const siblings = whoAreTheChildren(lineage, parent).filter(
      (sibling) => sibling !== child,
    );
    return siblings;
  }

  // out/entities/plunc.js
  function createPluncApp(name, id, configuration, registry, library) {
    let ready = false;
    let onReadyLtns = [];
    return {
      name,
      id,
      config: configuration,
      registry,
      library,
      onReadyLtns,
      toReady: () => {
        ready = true;
      },
      isReady: () => ready,
      onReady: (listener) => {
        onReadyLtns.push(listener);
      },
    };
  }

  // out/entities/registry.js
  function addToRegistry(registry, id, entity) {
    registry.data[id] = entity;
  }
  function getFromRegistryByIds(registry, ids) {
    return ids
      .map((id) => registry.data[id])
      .filter((entity) => entity !== void 0);
  }
  function getFromRegistryById(registry, id) {
    var _a;
    return (_a = registry.data[id]) !== null && _a !== void 0 ? _a : null;
  }
  function getAllFromRegistry(registry) {
    return registry.data;
  }

  // out/entities/scope.js
  function createScope() {
    return /* @__PURE__ */ Object.create(null);
  }

  // out/services/aliasNotation.js
  function parseAliasNotation(name) {
    var _a;
    return {
      name: name.split(" as ")[0],
      alias: (_a = name.split(" as ")[1]) !== null && _a !== void 0 ? _a : null,
    };
  }

  // out/services/pluncAttribute.js
  var GLOBAL_ATTR_FOR_APP_NAME = "app";
  var GLOBAL_ATTR_FOR_TEMPLATE_NAME = "name";
  var COMPONENT_ELEMENT_ATTR = "component";
  var COMPONENT_ID_ATTR = "cid";
  var REPEAT_ELEMENT_ATTR = "repeat";
  var IF_ELEMENT_ATTR = "if";
  var CHECK_ELEMENT_ATTR = "check";
  var STYLE_ELEMENT_ATTR = "style";
  var MODEL_ELEMENT_ATTR = "model";
  var DISABLE_ELEMENT_ATTR = "disable";
  var CLICK_EVENT_ATTR = "click";
  var CHANGE_EVENT_ATTR = "change";
  var TOUCH_EVENT_ATTR = "touch";
  var BLOCK_ELEMENT_ATTR = "block";
  var SCOPE_ARGUMENT_KEY = "$scope";
  var BLOCK_ARGUMENT_KEY = "$block";
  var PARENT_ARGUMENT_KEY = "$parent";
  var PATCH_ARGUMENT_KEY = "$patch";
  var APP_ARGUMENT_KEY = "$app";
  var COMPONENT_ARGUMENT_KEY = "$this";
  var REPEAT_REFERENCE_TOKEN = "$$index";
  var LOCK_ID_ATTR_KEY = "set";
  var LOCK_ID_ATTR_VALUE = "true";
  var ELEMENT_REFERENCE_ATTR = "rid";
  function composePluncAttributeKeyFormatter(instance) {
    const prefix = instance.config.prefix;
    return function pluncAttributeFormatter(key) {
      return `${prefix}${key}`;
    };
  }

  // out/services/blockService.js
  function createSelectorUsingAttributes(
    name,
    componentObject,
    pluncAttributeKeyFormatter,
  ) {
    const blockAttributeKey = pluncAttributeKeyFormatter(BLOCK_ELEMENT_ATTR);
    const referenceAttributeKey = pluncAttributeKeyFormatter(
      ELEMENT_REFERENCE_ATTR,
    );
    return `[${blockAttributeKey}="${name}"][${referenceAttributeKey}="${componentObject.id}"]`;
  }
  function composeBlockElementSelector(
    pluncAttributeKeyFormatter,
    querySelectAllElements,
  ) {
    return function composeSelector(name, componentObject) {
      const blockSelector = createSelectorUsingAttributes(
        name,
        componentObject,
        pluncAttributeKeyFormatter,
      );
      return function selectElements(context) {
        return querySelectAllElements(context, blockSelector);
      };
    };
  }

  // out/services/componentProxy.js
  function composeComponentProxyFactory() {
    return function newComponentProxy(wrapper) {
      const handler = {
        get: function get(target, name) {
          for (const id in target) {
            const component = target[id];
            const exposed = component.proxy;
            if (exposed === null) {
              const name2 = component.name;
              throw new Error(
                `Cannot invoke component "${name2}}" before $app is ready`,
              );
            }
            if (!(name in exposed)) {
              throw new Error(
                `Calling undefined member "${name}" in component "${component.name}"`,
              );
            }
            return exposed[name];
          }
        },
      };
      return new Proxy(wrapper, handler);
    };
  }

  // out/services/componentService.js
  function composeComponentRenderer(
    appCtx,
    templatesMap,
    elementsSelector,
    generateComponentId,
    attachReferenceToNamedElementsFn,
  ) {
    function renderComponent(
      componentWrapperElement,
      componentId,
      parentComponentId,
    ) {
      const componentName = getComponentName(appCtx, componentWrapperElement);
      appCtx.__pluncAttributeValueSetter(
        componentWrapperElement,
        COMPONENT_ID_ATTR,
        componentId,
      );
      appCtx.__addRecordToLineage(parentComponentId, componentId);
      const componentAlias = getComponentAlias(appCtx, componentWrapperElement);
      const componentObject = createOrGetComponentObject(
        componentId,
        componentName,
        componentAlias,
        appCtx,
      );
      assertNoCircularDependency(appCtx, componentObject);
      appCtx.__addRecordToRegistry(componentId, componentObject);
      const componentTemplate = templatesMap.get(componentName);
      if (componentTemplate === void 0) {
        throw new Error(`Template not found for component: ${componentName}`);
      }
      componentWrapperElement.innerHTML = componentTemplate;
      attachReferenceToNamedElementsFn(componentId, componentWrapperElement);
      renderComponentsOfParent(componentWrapperElement, componentId);
      componentObject.template = componentWrapperElement.innerHTML;
    }
    function renderComponentsOfParent(parentElement, parentComponentId) {
      const componentWrapperElements = selectAllComponentElementsInTarget(
        parentElement,
        appCtx,
        elementsSelector,
      );
      let componentIterator = 0;
      componentWrapperElements.forEach((componentWrapperElement) => {
        const componentId = generateComponentId(
          componentIterator,
          parentComponentId,
        );
        componentIterator++;
        renderComponent(
          componentWrapperElement,
          componentId,
          parentComponentId,
        );
      });
    }
    return renderComponentsOfParent;
  }
  function selectAllComponentElementsInTarget(
    target,
    appCtx,
    elementsSelector,
  ) {
    const componentAttributeKey = appCtx.__pluncAttributeKeyFormatter(
      COMPONENT_ELEMENT_ATTR,
    );
    return elementsSelector(target, `[${componentAttributeKey}]`);
  }
  function composeComponentSelectorById(
    pluncAttributeKeyFormatter,
    elementSelector,
  ) {
    return function selectComponentById(selectContext, componentId) {
      const attributeKey = pluncAttributeKeyFormatter(COMPONENT_ID_ATTR);
      const selector = `[${attributeKey}="${componentId}"]`;
      return elementSelector(selectContext, selector);
    };
  }
  function getComponentName(appCtx, componentElement) {
    const componentNameThatMayHaveAlias = getComponentNameThatMayHaveAlias(
      appCtx,
      componentElement,
    );
    return appCtx.__aliasNotationParser(componentNameThatMayHaveAlias).name;
  }
  function getComponentAlias(appCtx, componentElement) {
    const componentNameThatMayHaveAlias = getComponentNameThatMayHaveAlias(
      appCtx,
      componentElement,
    );
    return appCtx.__aliasNotationParser(componentNameThatMayHaveAlias).alias;
  }
  function getComponentNameThatMayHaveAlias(appCtx, componentElement) {
    const componentNameThatMayHaveAlias = appCtx.__pluncAttributeValueGetter(
      componentElement,
      COMPONENT_ELEMENT_ATTR,
    );
    if (!componentNameThatMayHaveAlias) {
      throw new Error(
        `Component element is missing the ${COMPONENT_ELEMENT_ATTR} attribute.`,
      );
    }
    return componentNameThatMayHaveAlias;
  }
  function assertNoCircularDependency(appCtx, component) {
    const name = component.name;
    const idsOfParents = appCtx.__lookupLineage(component.id);
    const parentNames = appCtx.__getFromRegistryByIds(idsOfParents);
    parentNames.forEach((parent) => {
      if (parent && "name" in parent && parent.name === name) {
        throw new Error(`Circular dependency detected for component: ${name}`);
      }
    });
  }
  function createOrGetComponentObject(componentId, name, alias, appCtx) {
    const existingComponent = appCtx.__getFromRegistryById(componentId);
    if (existingComponent && isComponentObject(existingComponent)) {
      return existingComponent;
    }
    return appCtx.__createComponentObject(
      componentId,
      alias ? `${name}:${alias}` : name,
    );
  }

  // out/services/configuration.js
  function resolveConfiguration(config) {
    var _a, _b, _c;
    const startFn = () => new Promise((resolve2) => resolve2(true));
    const endFn = () => new Promise((resolve2) => resolve2());
    return {
      prefix:
        (_a = config === null || config === void 0 ? void 0 : config.prefix) !==
          null && _a !== void 0
          ? _a
          : "plunc-",
      startFn:
        (_b =
          config === null || config === void 0 ? void 0 : config.startFn) !==
          null && _b !== void 0
          ? _b
          : startFn,
      endFn:
        (_c = config === null || config === void 0 ? void 0 : config.endFn) !==
          null && _c !== void 0
          ? _c
          : endFn,
    };
  }

  // out/services/elementService.js
  function selectElement(context, selector) {
    return context.querySelector(selector);
  }
  function selectAllElements(context, selector) {
    return Array.from(context.querySelectorAll(selector));
  }
  function composeElementSelectorsWithPluncAttribute(
    selectAllElementFn,
    formatPluncAttributeFn,
  ) {
    return function selectAllElementsWithPluncAttribute(
      context,
      pluncAttributeKey,
      pluncAttributeValue,
    ) {
      const attributeKey = formatPluncAttributeFn(pluncAttributeKey);
      const valuePart = pluncAttributeValue ? `="${pluncAttributeValue}"` : "";
      const selector = `[${attributeKey}${valuePart}]`;
      return selectAllElementFn(context, selector);
    };
  }
  function composePluncAttributeValueGetter(formatPluncAttributeFn) {
    return function getPluncAttributeValue(element2, key) {
      const attributeKey = formatPluncAttributeFn(key);
      return element2.getAttribute(attributeKey);
    };
  }
  function composePluncAttributeValueSetter(formatPluncAttributeFn) {
    return function setPluncAttributeValue(element2, key, value) {
      const attributeKey = formatPluncAttributeFn(key);
      element2.setAttribute(attributeKey, value);
    };
  }
  function cleanChildComponents(selectElementByComponentId) {
    return function (component, childIds) {
      for (let i2 = 0; i2 < childIds.length; i2++) {
        const childId = childIds[i2];
        const child = selectElementByComponentId(component, childId);
        if (child !== null) child.innerHTML = "";
      }
    };
  }
  function selectLiveAppRootElement(appName) {
    const appRootAttributeKey = `plunc-${GLOBAL_ATTR_FOR_APP_NAME}`;
    const selector = `[${appRootAttributeKey}="${appName}"]`;
    const element2 = document.querySelector(selector);
    if (!element2) {
      throw new Error(`Cannot find the app root element for app: ${appName}`);
    }
    return element2;
  }
  function makeStagingElement(innerHtml) {
    const element2 = document.implementation.createHTMLDocument().body;
    let isCommitted = false;
    if (innerHtml) {
      element2.innerHTML = innerHtml;
    }
    function setInnerHtml(html) {
      if (isCommitted) {
        throw new Error(
          "Cannot set innerHTML after committing to target element.",
        );
      }
      element2.innerHTML = html;
    }
    function getInnerHtml() {
      if (isCommitted) {
        throw new Error(
          "Cannot get innerHTML after committing to target element.",
        );
      }
      return element2.innerHTML;
    }
    function getElement() {
      return element2;
    }
    function commitTo(targetElement) {
      if (isCommitted) {
        throw new Error("Staging element has already been committed.");
      }
      while (element2.firstChild) {
        targetElement.appendChild(element2.firstChild);
      }
      isCommitted = true;
    }
    return Object.freeze({
      setInnerHtml,
      getInnerHtml,
      commitTo,
      getElement,
    });
  }

  // out/services/contextBinder.js
  function makePluncAppContextBinder(
    configResolver,
    createPluncAppFn,
    addToLibraryFn,
    getServiceHandlerFn,
    getComponentHandlerFn,
    getFactoryHandlerFn,
    getHelperHandlerFn,
    addToRegistryFn,
    getFromRegistryByIdsFn,
    getFromRegistryByIdFn,
    getAllFromRegistryFn,
    addRecordToLineageFn,
    lookupLineageFn,
    whoAreTheChildrenFn,
    whoIsTheParentFn,
    whoAreTheSiblingsFn,
    parseAliasNotationFn,
    selectElementFn,
    selectAllElementsFn,
    composeBlockElementSelectorFn,
    composeComponentSelectorByIdFn,
    composeComponentProxyFactoryFn,
    createComponentFactoryFn,
    createScopeObjectFn,
    composeElementLockerFn,
    composeElementLockCheckerFn,
    disposeElementFn,
    resolveExpression2,
    reconcileChildrenFn,
    cleanChildComponentsFn,
    makeStagingElementFn,
  ) {
    return function bindPluncAppContext(
      instanceId,
      applicationName,
      configuration = null,
    ) {
      const requiredConfiguration = configResolver(configuration);
      const registry = { data: {} };
      const library = { data: {} };
      const lineage = { genealogy: {} };
      const instance = createPluncAppFn(
        applicationName,
        instanceId,
        requiredConfiguration,
        registry,
        library,
      );
      const attributeKeyFormatter = composePluncAttributeKeyFormatter(instance);
      const attributeValueGetter = composePluncAttributeValueGetter(
        attributeKeyFormatter,
      );
      const attributeValueSetter = composePluncAttributeValueSetter(
        attributeKeyFormatter,
      );
      const generateComponentId = composeComponentIdGenerator(instance);
      const blockSelectorCreator = composeBlockElementSelectorFn(
        attributeKeyFormatter,
        selectAllElementsFn,
      );
      const componentSelectorById = composeComponentSelectorByIdFn(
        attributeKeyFormatter,
        selectElementFn,
      );
      const componentObjectFactory = createComponentFactoryFn(
        parseAliasNotationFn,
        createScopeObjectFn,
      );
      const querySelectorByPluncAttribute =
        composeElementSelectorsWithPluncAttribute(
          selectAllElementsFn,
          attributeKeyFormatter,
        );
      return {
        __getInstance: function () {
          return instance;
        },
        __addToLibrary: function (name, type, handler) {
          addToLibraryFn(library, name, type, handler);
        },
        __getServiceHandler: function (name) {
          return getServiceHandlerFn(library, name);
        },
        __getComponentHandler: function (name) {
          return getComponentHandlerFn(library, name);
        },
        __getFactoryHandler: function (name) {
          return getFactoryHandlerFn(library, name);
        },
        __getHelperHandler: function (name) {
          return getHelperHandlerFn(library, name);
        },
        __addRecordToRegistry: function (id, entity) {
          addToRegistryFn(registry, id, entity);
        },
        __getFromRegistryByIds: function (ids) {
          return getFromRegistryByIdsFn(registry, ids);
        },
        __getFromRegistryById: function (id) {
          return getFromRegistryByIdFn(registry, id);
        },
        __getAllFromRegistry: function () {
          return getAllFromRegistryFn(registry);
        },
        __addRecordToLineage: function (parent, child) {
          addRecordToLineageFn(lineage, parent, child);
        },
        __whoAreTheChildren: function (parent) {
          return whoAreTheChildrenFn(lineage, parent);
        },
        __whoIsTheParent: function (child) {
          return whoIsTheParentFn(lineage, child);
        },
        __whoAreTheSiblings: function (child) {
          return whoAreTheSiblingsFn(lineage, child);
        },
        __lookupLineage: function (child) {
          return lookupLineageFn(lineage, child);
        },
        __getLineage: function () {
          return lineage;
        },
        __pluncAttributeKeyFormatter: attributeKeyFormatter,
        __pluncAttributeValueGetter: attributeValueGetter,
        __pluncAttributeValueSetter: attributeValueSetter,
        __aliasNotationParser: parseAliasNotationFn,
        __generateComponentId: generateComponentId,
        __querySelectElement: selectElementFn,
        __querySelectAllElements: selectAllElementsFn,
        __querySelectComponentById: componentSelectorById,
        __createBlockSelector: blockSelectorCreator,
        __createComponentProxy: composeComponentProxyFactoryFn(),
        __createComponentObject: componentObjectFactory,
        __querySelectAllByPluncAttribute: querySelectorByPluncAttribute,
        __lockElement: composeElementLockerFn(attributeKeyFormatter),
        __isElementLocked: composeElementLockCheckerFn(attributeKeyFormatter),
        __trashElement: disposeElementFn,
        __resolveExpression: resolveExpression2,
        __reconcileChildren: reconcileChildrenFn,
        __clearChildComponents: cleanChildComponentsFn(componentSelectorById),
        __createStagingElement: makeStagingElementFn,
      };
    };
  }

  // out/directives/check.js
  function composeCheckDirectiveProcessor(appCtx) {
    return function processCheckDirective(elementCtx, dataCtx) {
      const elementsToProcess = appCtx.__querySelectAllByPluncAttribute(
        elementCtx,
        CHECK_ELEMENT_ATTR,
      );
      elementsToProcess.forEach((element2) => {
        if (appCtx.__isElementLocked(element2)) {
          return;
        }
        const checkExpression = appCtx.__pluncAttributeValueGetter(
          element2,
          CHECK_ELEMENT_ATTR,
        );
        if (checkExpression === null || checkExpression.trim() === "") {
          return;
        }
        const evaluatedResult = appCtx.__resolveExpression(
          dataCtx,
          checkExpression,
        );
        if (typeof evaluatedResult === "boolean") {
          evaluatedResult
            ? element2.setAttribute("checked", "true")
            : element2.removeAttribute("checked");
        }
        appCtx.__lockElement(element2);
      });
    };
  }

  // out/directives/conditionals.js
  function composeConditionalDirectivesProcessor(appCtx) {
    return function processConditionalDirectives(elementCtx, dataCtx) {
      const elementsToProcess = appCtx.__querySelectAllByPluncAttribute(
        elementCtx,
        IF_ELEMENT_ATTR,
      );
      elementsToProcess.forEach((element2) => {
        if (appCtx.__isElementLocked(element2)) {
          return;
        }
        const conditionExpression = appCtx.__pluncAttributeValueGetter(
          element2,
          IF_ELEMENT_ATTR,
        );
        if (conditionExpression === null || conditionExpression.trim() === "") {
          return;
        }
        const evaluationResult = appCtx.__resolveExpression(
          dataCtx,
          conditionExpression,
        );
        if (
          typeof evaluationResult === "boolean" &&
          evaluationResult === false
        ) {
          appCtx.__trashElement(element2, `condition evaluated to false`);
        }
        appCtx.__lockElement(element2);
      });
    };
  }

  // out/directives/disable.js
  function composeDisableDirectiveProcessor(appCtx) {
    return function processDisableDirective(elementCtx, dataCtx) {
      const elementsToProcess = appCtx.__querySelectAllByPluncAttribute(
        elementCtx,
        DISABLE_ELEMENT_ATTR,
      );
      elementsToProcess.forEach((element2) => {
        if (appCtx.__isElementLocked(element2)) {
          return;
        }
        const disableExpression = appCtx.__pluncAttributeValueGetter(
          element2,
          DISABLE_ELEMENT_ATTR,
        );
        if (disableExpression === null || disableExpression.trim() === "") {
          return;
        }
        const evaluatedResult = appCtx.__resolveExpression(
          dataCtx,
          disableExpression,
        );
        if (typeof evaluatedResult === "boolean") {
          evaluatedResult
            ? element2.setAttribute("disabled", "true")
            : element2.removeAttribute("disabled");
        }
        appCtx.__lockElement(element2);
      });
    };
  }

  // out/entities/element.js
  var PluncElement = class _PluncElement {
    /**
     * @param element - The Element
     * @param pcount - The number of iteration of parent created
     */
    constructor(element2, pcount = null) {
      Object.defineProperty(this, "$element", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0,
      });
      Object.defineProperty(this, "$parent", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0,
      });
      Object.defineProperty(this, "state", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0,
      });
      Object.defineProperty(this, "scope", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0,
      });
      this.$element = element2;
      this.state = null;
      this.__wrapParent(pcount !== null && pcount !== void 0 ? pcount : 1);
    }
    /** Wraps the parent element within `PluncElement` object */
    __wrapParent(count) {
      const parentElement = this.$element.parentElement;
      if (count > 3 || parentElement === null) return;
      this.$parent = new _PluncElement(parentElement, count++);
    }
    /** Retrieves the $element */
    get() {
      return this.$element;
    }
    /** Retrieves the state */
    getState() {
      return this.state;
    }
    setState(state) {
      if (state === null) return;
      this.state = state;
    }
    setScope(scope2) {
      this.scope = scope2;
    }
    getScope() {
      return this.scope;
    }
    addClass(className) {
      this.$element.classList.add(className);
    }
    listClass() {
      return this.$element.className.split(" ");
    }
    removeClass(className) {
      this.$element.classList.remove(className);
    }
    toggleClass(className) {
      const classes = this.listClass();
      for (var i2 = 0; i2 < classes.length; i2++) {
        let aclass = classes[i2];
        aclass === className
          ? this.removeClass(className)
          : this.addClass(className);
      }
    }
  };

  // out/services/expResolver.js
  var resolveExpression = (scope2, expression2, element2 = null) => {
    const resolveType2 = getResolveType(expression2);
    return resolve(scope2, expression2, resolveType2, element2);
  };
  function getResolveType(expression2) {
    if (/^'.*'$/.test(expression2)) return "string";
    if (!isNaN(expression2)) return "number";
    if (expression2.includes("(") && expression2.includes("=="))
      return "conditional";
    if (expression2.includes("(") && expression2.includes("is "))
      return "conditional";
    if (expression2.includes("(") && expression2.includes(">"))
      return "conditional";
    if (expression2.includes("(") && expression2.includes("<"))
      return "conditional";
    if (expression2.includes("(")) return "function";
    if (expression2.includes("==")) return "conditional";
    if (expression2.includes("is ")) return "conditional";
    if (expression2.includes(">")) return "conditional";
    if (expression2.includes("<")) return "conditional";
    if (
      expression2.includes("+") ||
      expression2.includes("-") ||
      expression2.includes("/") ||
      expression2.includes("*") ||
      expression2.includes("%")
    ) {
      return "operation";
    }
    if (
      expression2 == "false" ||
      expression2 == "true" ||
      expression2 == "null"
    ) {
      return "boolean";
    }
    return "object";
  }
  function resolve(scope, expression, resolveType, element = null) {
    switch (resolveType) {
      case "string":
        return expression.slice(1, -1);
        break;
      case "boolean":
        if (expression == "true") return true;
        if (expression == "false") return false;
        if (expression == "null") return null;
        break;
      case "object":
        return evalObject(scope, expression);
        break;
      case "function":
        let structure = expression.split("(");
        let expressionTest = structure[0].split(".");
        if (expressionTest.length > 1) {
          let refObject = resolveExpression(
            scope,
            getParentObjectExp(structure[0]),
          );
          let funcExpression = expression
            .split(".")
            .slice(expressionTest.length - 1)
            .join(".");
          return invokeFunction(refObject, scope, funcExpression, element);
        }
        if (!Object.prototype.hasOwnProperty.call(scope, structure[0])) {
          return "";
        }
        return invokeFunction(scope, scope, expression, element);
        break;
      case "conditional":
        const evaluatorMap = {
          "!==": areTwoExpressionsNotTheSame,
          "==": areTwoExpressionsTheSame,
          "is not ": areTwoExpressionsNotTheSame,
          "is ": areTwoExpressionsTheSame,
          ">=": isGreaterThanOrEqualToTheOther,
          ">": isGreaterThanTheOther,
          "<=": isLessThanOrEqualToTheOther,
          "<": isLessThanTheOther,
        };
        for (const comparator in evaluatorMap) {
          if (expression.includes(comparator)) {
            return evaluatorMap[comparator](scope, expression, comparator);
          }
        }
        return false;
        break;
      case "number":
        return Number(expression);
        break;
      case "operation":
        let finalExpression = expression;
        let operations = ["+", "-", "*", "/", "%"];
        for (var i = 0; i < operations.length; i++) {
          if (expression.includes(operations[i])) {
            let exp = expression.split(operations[i]);
            let left = resolveExpression(scope, exp[0].trim());
            var right = resolveExpression(scope, exp[1].trim());
            finalExpression = left + operations[i] + right;
          }
        }
        return eval(finalExpression);
        break;
      default:
        break;
    }
  }
  function evalObject(scope2, expression2) {
    if (expression2 === "$scope") {
      return scope2;
    }
    return expression2.split(".").reduce(function (o, x) {
      if (o === void 0) return;
      if (o === null) return;
      if (o[x] === void 0) return;
      return o[x];
    }, scope2);
  }
  function invokeFunction(scope2, object, expression2, element2) {
    if (scope2 === void 0) return "";
    const splitExpression = expression2.match(/\(([^)]+)\)/);
    let struct = expression2.split("(");
    let name = struct[0];
    if (splitExpression !== null) {
      const argsVault = new Array();
      const splitArguments = splitExpression[1].split(",");
      for (let i2 = 0; i2 < splitArguments.length; i2++) {
        argsVault.push(resolveExpression(object, splitArguments[i2].trim()));
      }
      if (element2 !== null) {
        argsVault.push(new PluncElement(element2));
      }
      if (!(scope2[name] instanceof Function)) {
        return "";
      }
      return scope2[name](...argsVault);
    }
    if (element2 !== null) {
      const argsVault = new Array();
      argsVault.push(new PluncElement(element2));
      return scope2[name](...argsVault);
    }
    if (!(scope2[name] instanceof Function)) {
      return "";
    }
    return scope2[name]();
  }
  function getParentObjectExp(expression2) {
    let pieces = expression2.split(".");
    if (pieces.length < 2) return "$scope";
    pieces.pop();
    return pieces.join(".");
  }
  function getParentObjAsObject(base, expression2) {
    const parentObjExp = getParentObjectExp(expression2);
    return resolveExpression(base, parentObjExp);
  }
  function getChildObjectExp(expression2) {
    let pieces = expression2.split(".");
    return pieces[pieces.length - 1];
  }
  function areTwoExpressionsTheSame(scope2, expression2, comparator) {
    const [left, right2] = expression2.split(comparator).map((arm) => {
      return resolveExpression(scope2, arm.trim());
    });
    return left === right2;
  }
  function areTwoExpressionsNotTheSame(scope2, expression2, comparator) {
    const [left, right2] = expression2.split(comparator).map((arm) => {
      return resolveExpression(scope2, arm.trim());
    });
    return left !== right2;
  }
  function isGreaterThanTheOther(scope2, expression2, comparator) {
    const [left, right2] = expression2.split(comparator).map((arm) => {
      return resolveExpression(scope2, arm.trim());
    });
    return left > right2;
  }
  function isGreaterThanOrEqualToTheOther(scope2, expression2, comparator) {
    const [left, right2] = expression2.split(comparator).map((arm) => {
      return resolveExpression(scope2, arm.trim());
    });
    return left >= right2;
  }
  function isLessThanTheOther(scope2, expression2, comparator) {
    const [left, right2] = expression2.split(comparator).map((arm) => {
      return resolveExpression(scope2, arm.trim());
    });
    return left < right2;
  }
  function isLessThanOrEqualToTheOther(scope2, expression2, comparator) {
    const [left, right2] = expression2.split(comparator).map((arm) => {
      return resolveExpression(scope2, arm.trim());
    });
    return left <= right2;
  }

  // out/directives/events.js
  function bindEventListenerToElement(
    dataCtx,
    bindToElement,
    fnExpression,
    eventType,
  ) {
    if (getResolveType(fnExpression) !== "function") return;
    bindToElement.addEventListener(eventType, () => {
      resolveExpression(dataCtx, fnExpression, bindToElement);
    });
  }
  function composeEventDirectiveProcessor(appCtx) {
    return function processEventDirectives(elementCtx, dataCtx) {
      const events = [
        { type: "click", attr: CLICK_EVENT_ATTR },
        { type: "change", attr: CHANGE_EVENT_ATTR },
        { type: "keyup", attr: TOUCH_EVENT_ATTR },
      ];
      events.forEach((event) => {
        const elementsToProcess = appCtx.__querySelectAllByPluncAttribute(
          elementCtx,
          event.attr,
        );
        elementsToProcess.forEach((element2) => {
          if (appCtx.__isElementLocked(element2)) {
            return;
          }
          const fnExpression = appCtx.__pluncAttributeValueGetter(
            element2,
            event.attr,
          );
          if (fnExpression === null || fnExpression.trim() === "") {
            return;
          }
          bindEventListenerToElement(
            dataCtx,
            element2,
            fnExpression,
            event.type,
          );
          appCtx.__lockElement(element2);
        });
      });
    };
  }

  // out/directives/model.js
  function assertDateFormat(date) {
    var _a, _b, _c;
    const message = `models assigned to Date input elements must follow standard HTML5 format YYYY-MM-DD`;
    const structure2 = date.split("-");
    const year = (_a = structure2[0]) !== null && _a !== void 0 ? _a : null;
    if (year === null || year.length < 4) {
      throw new Error(message);
    }
    const month = (_b = structure2[1]) !== null && _b !== void 0 ? _b : null;
    if (month === null || parseInt(month) > 12) {
      throw new Error(month);
    }
    const day = (_c = structure2[2]) !== null && _c !== void 0 ? _c : null;
    if (day === null || parseInt(day) > 31) {
      throw new Error(day);
    }
  }
  function assertTimeFormat(time) {
    var _a, _b;
    const message = `models assigned to Time input elements must follow standard HTML5 format HH:MM`;
    const structure2 = time.split(":");
    const hours = (_a = structure2[0]) !== null && _a !== void 0 ? _a : null;
    if (hours === null || hours.length < 2 || parseInt(hours) > 23) {
      throw new Error(message);
    }
    const minutes = (_b = structure2[1]) !== null && _b !== void 0 ? _b : null;
    if (minutes === null || minutes.length < 2 || parseInt(minutes) > 59) {
      throw new Error(message);
    }
  }
  var assignModelValue = (dataCtx, expression2, value) => {
    const parentObj = getParentObjAsObject(dataCtx, expression2);
    const childObjExpression = getChildObjectExp(expression2);
    if (void 0 !== parentObj) parentObj[childObjExpression] = value;
  };
  function setModelState(element2, state) {
    typeof state == "boolean" && state
      ? element2.setAttribute("checked", "")
      : element2.removeAttribute("checked");
  }
  function getCurrentDate() {
    const date = new Date(Date.now());
    const nmonth = date.getMonth() + 1;
    const month = nmonth < 10 ? `0${nmonth}` : nmonth;
    const result = `${date.getFullYear()}-${month}-${date.getDate()}`;
    assertDateFormat(result);
    return result;
  }
  function getCurrentTime() {
    const input = new Date(Date.now());
    const hours =
      input.getHours() < 10 ? `0${input.getHours()}` : input.getHours();
    const minutes =
      input.getMinutes() < 10 ? `0${input.getMinutes()}` : input.getMinutes();
    const result = hours + ":" + minutes;
    assertTimeFormat(result);
    return result;
  }
  function castAnyValueToString(value) {
    if (value === null || value === void 0) {
      return "";
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return String(value);
  }
  function handleRadioAndCheckboxModel(
    maybeRadioOrCheckboxElement,
    dataCtx,
    expression2,
    expressionValue,
  ) {
    const elementType = maybeRadioOrCheckboxElement.type.toLowerCase();
    if (elementType !== "radio" && elementType !== "checkbox") {
      return;
    }
    const radioOrCheckboxElement = maybeRadioOrCheckboxElement;
    if (expressionValue === void 0) {
      assignModelValue(dataCtx, expression2, false);
      setModelState(radioOrCheckboxElement, false);
    } else if (typeof expressionValue === "boolean") {
      setModelState(radioOrCheckboxElement, expressionValue);
    } else {
      console.warn(
        `Model directive assigned to checkbox/radio input elements must be of boolean type.`,
      );
    }
  }
  function handleTextInputButNotTextareaModel(
    maybeInputElement,
    dataCtx,
    expression2,
    expressionValue,
  ) {
    const elementType = maybeInputElement.type.toLowerCase();
    if (
      elementType === "text" ||
      elementType === "email" ||
      elementType === "password" ||
      elementType === "search" ||
      elementType === "url" ||
      elementType === "tel"
    ) {
      const inputElement = maybeInputElement;
      if (expressionValue === void 0) {
        assignModelValue(dataCtx, expression2, inputElement.value);
      } else {
        inputElement.value = castAnyValueToString(expressionValue);
      }
    }
  }
  function handleNumberInputModel(
    maybeInputNumberElement,
    dataCtx,
    expression2,
    expressionValue,
  ) {
    const elementType = maybeInputNumberElement.type.toLowerCase();
    if (elementType === "number") {
      const inputElement = maybeInputNumberElement;
      if (expressionValue === void 0) {
        assignModelValue(dataCtx, expression2, 0);
        inputElement.value = "0";
      } else {
        inputElement.value = castAnyValueToString(expressionValue);
      }
    }
  }
  function composeModelHandlerExecutor(
    targetELement,
    dataCtx,
    expression2,
    expressionValue,
  ) {
    return function executeHandler(handler) {
      handler(targetELement, dataCtx, expression2, expressionValue);
    };
  }
  function handleDateInputModel(
    maybeDateInputElement,
    dataCtx,
    expression2,
    expressionValue,
  ) {
    const elementType = maybeDateInputElement.type.toLowerCase();
    if (elementType === "date") {
      const dateInputElement = maybeDateInputElement;
      if (expressionValue === void 0) {
        const currentDate = getCurrentDate();
        assignModelValue(dataCtx, expression2, currentDate);
        dateInputElement.value = currentDate;
      } else {
        const stringifiedValue = castAnyValueToString(expressionValue);
        assertDateFormat(stringifiedValue);
        dateInputElement.value = stringifiedValue;
      }
    }
  }
  function handleTimeInputModel(
    maybeTimeInputElement,
    dataCtx,
    expression2,
    expressionValue,
  ) {
    const elementType = maybeTimeInputElement.type.toLowerCase();
    if (elementType === "time") {
      const timeInputElement = maybeTimeInputElement;
      if (expressionValue === void 0) {
        const currentTime = getCurrentTime();
        assignModelValue(dataCtx, expression2, currentTime);
        timeInputElement.value = currentTime;
      } else {
        const stringifiedValue = castAnyValueToString(expressionValue);
        assertTimeFormat(stringifiedValue);
        timeInputElement.value = stringifiedValue;
      }
    }
  }
  function composeModelDirectiveProcessor(appCtx) {
    return function processModelDirective(elementCtx, dataCtx) {
      const elementsToProcess = appCtx.__querySelectAllByPluncAttribute(
        elementCtx,
        MODEL_ELEMENT_ATTR,
      );
      elementsToProcess.forEach((element2) => {
        const modelExpression = appCtx.__pluncAttributeValueGetter(
          element2,
          MODEL_ELEMENT_ATTR,
        );
        if (modelExpression === null || modelExpression.trim() === "") {
          return;
        }
        let evaluationResult = appCtx.__resolveExpression(
          dataCtx,
          modelExpression,
        );
        if (element2.tagName === "INPUT" || element2.tagName === "SELECT") {
          if (element2 instanceof HTMLInputElement) {
            const execute = composeModelHandlerExecutor(
              element2,
              dataCtx,
              modelExpression,
              evaluationResult,
            );
            execute(handleRadioAndCheckboxModel);
            execute(handleTextInputButNotTextareaModel);
            execute(handleNumberInputModel);
            execute(handleDateInputModel);
            execute(handleTimeInputModel);
          }
          if (element2 instanceof HTMLSelectElement) {
            evaluationResult === void 0
              ? assignModelValue(dataCtx, modelExpression, element2.value)
              : (element2.value = castAnyValueToString(evaluationResult));
          }
          element2.addEventListener("change", (event) => {
            const target = event.target;
            if (target instanceof HTMLInputElement) {
              const targetType = target.type.toLowerCase();
              if (targetType === "radio" || targetType === "checkbox") {
                const isChecked = target.checked;
                assignModelValue(dataCtx, modelExpression, isChecked);
                return;
              }
              assignModelValue(dataCtx, modelExpression, target.value);
            }
            if (target instanceof HTMLSelectElement) {
              assignModelValue(dataCtx, modelExpression, target.value);
            }
          });
        } else if (
          element2.tagName === "TEXTAREA" &&
          element2 instanceof HTMLTextAreaElement
        ) {
          evaluationResult === void 0
            ? assignModelValue(dataCtx, modelExpression, element2.value)
            : (element2.value = castAnyValueToString(evaluationResult));
          element2.addEventListener("change", (event) => {
            const target = event.target;
            if (!(target instanceof HTMLTextAreaElement)) return;
            const value = target.value;
            assignModelValue(dataCtx, modelExpression, value);
          });
        }
      });
    };
  }

  // out/directives/placeholders.js
  function composePlaceholderResolver(appCtx) {
    return function resolvePlaceholders(elementCtx, dataCtx) {
      const regEx = new RegExp("(?<=\\{{).+?(?=\\}})", "g");
      const htmlContent = elementCtx.innerHTML;
      const matchedPlaceholders = htmlContent.match(regEx);
      if (matchedPlaceholders === null) {
        return;
      }
      matchedPlaceholders.forEach((placeholder) => {
        const expression2 = placeholder.trim();
        let evaluationResult = appCtx.__resolveExpression(dataCtx, expression2);
        if (evaluationResult === null || evaluationResult === void 0) {
          evaluationResult = "";
        }
        const placeholderTag = `{{${placeholder}}}`;
        elementCtx.innerHTML = elementCtx.innerHTML.replace(
          placeholderTag,
          String(evaluationResult),
        );
      });
    };
  }

  // out/directives/repeat.js
  function dissectRepeatExpression(expression2) {
    if (expression2.includes("until ")) {
      return [REPEAT_REFERENCE_TOKEN, expression2.split("until")[1].trim()];
    }
    return [
      expression2.split(" as ")[0].trim(),
      expression2.split(" as ")[1].trim(),
    ];
  }
  function countRepeatable(repetitions) {
    if (repetitions instanceof Array) return repetitions.length;
    if (typeof repetitions === "number" && Number.isInteger(repetitions))
      return repetitions;
    throw new Error(`Repeatable elements must have repeatable values`);
  }
  function isIterableWithEntries(value) {
    return (
      value !== null && (typeof value === "object" || Array.isArray(value))
    );
  }
  function composeRepeatDirectiveProcessor(appCtx) {
    let processDirectivesOnRepeatedElementFn = () => {};
    function processRepeatDirective(repeatableElementCtx, dataCtx) {
      const scope2 = Object.assign({}, dataCtx);
      const template = repeatableElementCtx.innerHTML;
      repeatableElementCtx.replaceChildren();
      let repeatExpression = appCtx.__pluncAttributeValueGetter(
        repeatableElementCtx,
        REPEAT_ELEMENT_ATTR,
      );
      if (repeatExpression === null || repeatExpression.trim() === "") {
        return;
      }
      let [dataSourceExpr, itemAlias] =
        dissectRepeatExpression(repeatExpression);
      if (dataSourceExpr === REPEAT_REFERENCE_TOKEN) {
        const repetitions = resolveExpression(scope2, itemAlias);
        let times = countRepeatable(repetitions);
        scope2["$$index"] = {};
        let k = 0;
        while (k < times) scope2["$$index"]["props" + k++] = new Object();
      }
      const repeatableObject = resolveExpression(scope2, dataSourceExpr);
      if (!isIterableWithEntries(repeatableObject)) {
        return;
      }
      let indexNumber = 0;
      for (const [key, value] of Object.entries(repeatableObject)) {
        const repeatDataCtx = {
          $parent: dataCtx,
          $index: indexNumber,
          [itemAlias]: value,
        };
        const repeatedElementCtx =
          document.implementation.createHTMLDocument().body;
        repeatedElementCtx.innerHTML = template;
        processDirectivesOnRepeatedElementFn(repeatedElementCtx, repeatDataCtx);
        appCtx.__reconcileChildren(repeatedElementCtx, repeatableElementCtx);
        indexNumber++;
      }
    }
    return function processRepeatDirectives(
      elementCtx,
      dataCtx,
      processDirectivesOnRepeatedElement,
    ) {
      const repeatElements = appCtx.__querySelectAllByPluncAttribute(
        elementCtx,
        REPEAT_ELEMENT_ATTR,
      );
      processDirectivesOnRepeatedElementFn = processDirectivesOnRepeatedElement;
      for (const repeatElement of repeatElements) {
        processRepeatDirective(repeatElement, dataCtx);
      }
    };
  }

  // out/directives/style.js
  function composeStyleDirectiveProcessor(appCtx) {
    return function processStyleDirective(elementCtx, dataCtx) {
      const elementsToProcess = appCtx.__querySelectAllByPluncAttribute(
        elementCtx,
        STYLE_ELEMENT_ATTR,
      );
      elementsToProcess.forEach((element2) => {
        if (appCtx.__isElementLocked(element2)) {
          return;
        }
        const styleExpression = appCtx.__pluncAttributeValueGetter(
          element2,
          STYLE_ELEMENT_ATTR,
        );
        if (styleExpression === null || styleExpression.trim() === "") {
          return;
        }
        const evaluatedResult = appCtx.__resolveExpression(
          dataCtx,
          styleExpression,
        );
        if (
          typeof evaluatedResult === "string" &&
          evaluatedResult.trim() !== ""
        ) {
          const classNames = evaluatedResult.split(" ").map((cn) => cn.trim());
          classNames.forEach((cn) => {
            if (cn !== "") {
              element2.classList.add(cn);
            }
          });
        }
        appCtx.__lockElement(element2);
      });
    };
  }

  // out/services/directivesProcessor.js
  function composeDirectivesProcessor(appCtx) {
    const processRepeat = composeRepeatDirectiveProcessor(appCtx);
    const processCheck = composeCheckDirectiveProcessor(appCtx);
    const processConditionals = composeConditionalDirectivesProcessor(appCtx);
    const processDisable = composeDisableDirectiveProcessor(appCtx);
    const processEvents = composeEventDirectiveProcessor(appCtx);
    const processModels = composeModelDirectiveProcessor(appCtx);
    const resolvePlaceholders = composePlaceholderResolver(appCtx);
    const processStyles = composeStyleDirectiveProcessor(appCtx);
    function processDirectives(
      targetElement,
      dataCtx,
      skipEventProcessing = true,
    ) {
      processRepeat(targetElement, dataCtx, processDirectives);
      processConditionals(targetElement, dataCtx);
      resolvePlaceholders(targetElement, dataCtx);
      processCheck(targetElement, dataCtx);
      processStyles(targetElement, dataCtx);
      processModels(targetElement, dataCtx);
      processDisable(targetElement, dataCtx);
      if (skipEventProcessing === false) {
        processEvents(targetElement, dataCtx);
      }
    }
    return processDirectives;
  }

  // out/services/disposeService.js
  function disposeElement(element2, comment) {
    if (null !== element2) {
      element2.innerHTML = "";
      if (element2.parentNode !== null) {
        element2.outerHTML =
          "<!-- plunc.js: " + element2.outerHTML + " | " + comment + " -->";
      }
    }
  }

  // out/services/domReady.js
  var userAgent = navigator.userAgent.toLowerCase();
  var browser = {
    version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
    safari: /webkit/.test(userAgent),
    opera: /opera/.test(userAgent),
    msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
    mozilla:
      /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent),
  };
  var readyBound = false;
  var isReady = false;
  var readyList = [];
  function domReady() {
    if (!isReady) {
      isReady = true;
      if (readyList) {
        for (var fn = 0; fn < readyList.length; fn++) {
          readyList[fn].call(window, []);
        }
        readyList = [];
      }
    }
  }
  function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != "function") {
      window.onload = func;
    } else {
      window.onload = function () {
        if (oldonload) oldonload();
        func();
      };
    }
  }
  function bindReady() {
    if (readyBound) {
      return;
    }
    readyBound = true;
    if (document.addEventListener && !browser.opera) {
      document.addEventListener("DOMContentLoaded", domReady, false);
    }
    if (browser.msie && window == top)
      (function checkReady() {
        if (isReady) return;
        try {
          document.documentElement.doScroll("left");
        } catch (error) {
          setTimeout(checkReady, 0);
          return;
        }
        domReady();
      })();
    if (browser.opera) {
      document.addEventListener(
        "DOMContentLoaded",
        function checkReady() {
          if (isReady) return;
          for (var i2 = 0; i2 < document.styleSheets.length; i2++)
            if (document.styleSheets[i2].disabled) {
              setTimeout(checkReady, 0);
              return;
            }
          domReady();
        },
        false,
      );
    }
    if (browser.safari) {
      var numStyles;
      (function checkReady() {
        if (isReady) return;
        if (
          // @ts-ignore
          document.readyState != "loaded" &&
          document.readyState != "complete"
        ) {
          setTimeout(checkReady, 0);
          return;
        }
        if (numStyles === void 0) {
          var links = document.getElementsByTagName("link");
          for (var i2 = 0; i2 < links.length; i2++) {
            if (links[i2].getAttribute("rel") == "stylesheet") {
              numStyles++;
            }
          }
          var styles = document.getElementsByTagName("style");
          numStyles += styles.length;
        }
        if (document.styleSheets.length != numStyles) {
          setTimeout(checkReady, 0);
          return;
        }
        domReady();
      })();
    }
    addLoadEvent(domReady);
  }
  var DOMHelper = {
    ready: function (callback) {
      bindReady();
      if (isReady) return callback.call(window, []);
      readyList.push(function () {
        return callback.call(window, []);
      });
    },
  };
  bindReady();

  // out/services/handlerBinder.js
  function composeComponentBinder(appContext) {
    return function bindComponentToHandler(name, handler) {
      appContext.__addToLibrary(name, "component", handler);
    };
  }
  function composeServiceBinder(appContext) {
    return function bindServiceToHandler(name, handler) {
      appContext.__addToLibrary(name, "service", handler);
    };
  }
  function composeFactoryBinder(appContext) {
    return function bindFactoryToHandler(name, handler) {
      appContext.__addToLibrary(name, "factory", handler);
    };
  }
  function composeHelperBinder(appContext) {
    return function bindHelperToHandler(name, handler) {
      appContext.__addToLibrary(name, "helper", handler);
    };
  }

  // out/apis/$app.js
  function composeAppAPI(appCtx) {
    return {
      ready: (listener) => {
        appCtx.__getInstance().onReady(listener);
      },
    };
  }

  // out/apis/$block.js
  function composeBlockAPI(appCtx, componentObject) {
    return function $block(name, callback) {
      if (!appCtx.__getInstance().isReady()) {
        throw new Error(`cannot use $block outside $app.ready`);
      }
      const liveComponentElement = appCtx.__querySelectComponentById(
        // Components are id'd uniquely accross different app instances,
        // so it's safe to query the document body directly.
        document.body,
        componentObject.id,
      );
      if (!liveComponentElement) {
        throw new Error(
          `Cannot find the live component element for component id: ${componentObject.id}`,
        );
      }
      const selectAllBlockElements = appCtx.__createBlockSelector(
        name,
        componentObject,
      );
      const blockElements = selectAllBlockElements(liveComponentElement);
      if (blockElements.length === 0) {
        callback(null);
        return;
      }
      blockElements.forEach((blockElement) => {
        callback(new PluncElement(blockElement));
      });
    };
  }

  // out/apis/$parent.js
  function composeParentAPI(appCtx, componentObject) {
    return function $parent() {
      const parentId = appCtx.__whoIsTheParent(componentObject.id);
      if (parentId === null) return null;
      const parentComponentObject = appCtx.__getFromRegistryById(parentId);
      if (!parentComponentObject) return null;
      if (!isComponentObject(parentComponentObject)) return null;
      const wrapper = {};
      wrapper[parentId] = parentComponentObject;
      return appCtx.__createComponentProxy(wrapper);
    };
  }

  // out/apis/$patch.js
  function composePatchAPI(appCtx, componentObject) {
    return function $patch(blockName = null) {
      return __async(this, null, function* () {
        if (!appCtx.__getInstance().isReady()) {
          throw new Error(`cannot use $patch outside $app.ready`);
        }
        const liveComponentElement = appCtx.__querySelectComponentById(
          // Components are id'd uniquely accross different app instances,
          // so it's safe to query the document body directly.
          document.body,
          componentObject.id,
        );
        if (!liveComponentElement) {
          throw new Error(
            `Cannot find the live component element for component id: ${componentObject.id}`,
          );
        }
        const { targetType, patchTargetNodes } = getPatchTargetNodesAndType(
          blockName,
          liveComponentElement,
          componentObject,
          appCtx,
        );
        for (const patchTargetNode of patchTargetNodes) {
          const elementBindTo = patchTargetNode;
          if (elementBindTo === null) continue;
          let elementBindFrom = appCtx.__createStagingElement();
          if (targetType === "COMPONENT") {
            elementBindFrom.setInnerHtml(componentObject.template);
          } else {
            if (blockName === null) continue;
            const blockTemplate = getBlockTemplate(
              appCtx,
              componentObject,
              blockName,
            );
            elementBindFrom.setInnerHtml(blockTemplate);
          }
          const processDirectives = composeDirectivesProcessor(appCtx);
          processDirectives(
            elementBindFrom.getElement(),
            componentObject.scope,
            false,
          );
          elementBindTo.innerHTML = "";
          elementBindFrom.commitTo(elementBindTo);
        }
      });
    };
  }
  function getPatchTargetNodesAndType(
    blockName,
    liveComponentElement,
    componentObject,
    appCtx,
  ) {
    if (blockName !== null) {
      const selectAllBlockElements = appCtx.__createBlockSelector(
        blockName,
        componentObject,
      );
      const patchTargetNodes = selectAllBlockElements(liveComponentElement);
      return {
        targetType: "BLOCK",
        patchTargetNodes,
      };
    }
    return {
      targetType: "COMPONENT",
      patchTargetNodes: [liveComponentElement],
    };
  }
  function getBlockTemplate(appCtx, componentObject, blockName) {
    const stagingElement = appCtx.__createStagingElement(
      componentObject.template,
    );
    const blockDirective =
      appCtx.__pluncAttributeKeyFormatter(BLOCK_ELEMENT_ATTR);
    const referenceDirective = appCtx.__pluncAttributeKeyFormatter(
      ELEMENT_REFERENCE_ATTR,
    );
    const specificBlockSelector = `[${blockDirective}="${blockName}"][${referenceDirective}="${componentObject.id}"]`;
    const blockElement = appCtx.__querySelectAllElements(
      stagingElement.getElement(),
      specificBlockSelector,
    );
    if (blockElement.length === 0) {
      throw new Error(
        `Cannot find block element with name "${blockName}" in component "${componentObject.name}".`,
      );
    }
    return blockElement[0].innerHTML;
  }

  // out/apis/$this.js
  function composeComponentAPI(appCtx, componentObject) {
    return function $this() {
      return {
        id: componentObject.id,
        name: componentObject.name,
        alias: componentObject.alias,
        element: () => {
          if (!appCtx.__getInstance().isReady()) {
            throw new Error(
              `Cannot invoke component.get().element() outside $app.ready`,
            );
          }
          const elementNode = appCtx.__querySelectComponentById(
            // Components are id'd uniquely accross different app instances,
            // so it's safe to query the document body directly.
            document.body,
            componentObject.id,
          );
          if (elementNode === null) {
            return null;
          }
          return new PluncElement(elementNode);
        },
      };
    };
  }

  // out/services/handlerExecutor.js
  function listDependencies(handler) {
    const handlerStr = handler.toString().split("{")[0];
    if (handlerStr.charAt(0) !== "(") {
      const param = handlerStr.split("=>")[0];
      if (param === handlerStr) {
        return [];
      }
      return [param.trim()];
    }
    const matchedFn = handlerStr.match(new RegExp("(?<=\\().+?(?=\\))", "g"));
    if (matchedFn === null || /[(={})]/g.test(matchedFn[0])) {
      return [];
    }
    return matchedFn[0].split(",").map((item) => {
      return item.trim();
    });
  }
  function composeDependencyResolver(appCtx, listDependenciesFn) {
    return function resolveDependency(param) {
      const injectables = [];
      param.dependencies.forEach((dependencyKey) => {
        if (isScopeArgumentKey(dependencyKey)) {
          injectables.push(resolveScopeParam(param));
          return;
        }
        if (isAPIDependency(dependencyKey)) {
          injectables.push(resolveAPIDependency(dependencyKey, param, appCtx));
          return;
        }
        if (isServiceDependency(appCtx, dependencyKey)) {
          const serviceObject = invokeServiceHandler(
            dependencyKey,
            appCtx,
            listDependenciesFn,
            resolveDependency,
          );
          injectables.push(serviceObject);
          return;
        }
        if (isFactoryDependency(appCtx, dependencyKey)) {
          const factory = invokeFactoryHandler(
            dependencyKey,
            appCtx,
            listDependenciesFn,
            resolveDependency,
          );
          injectables.push(factory);
          return;
        }
        if (isHelperDependency(appCtx, dependencyKey)) {
          if (param.type === "component" || param.type === "helper") {
            const helper = invokeHelperHandler(
              dependencyKey,
              appCtx,
              listDependenciesFn,
              resolveDependency,
              param.component,
            );
            injectables.push(helper);
            return;
          } else {
            throw new Error(
              `Helper dependency "${dependencyKey}" can only be injected into components or helpers`,
            );
          }
        }
        if (param.type === "component") {
          const componentProxy = resolveComponentDependencyWithNameOrAlias(
            dependencyKey,
            param.component,
            appCtx,
          );
          injectables.push(componentProxy);
          return;
        }
        console.warn(`Unresolved dependency: "${dependencyKey}"`);
        injectables.push(null);
      });
      return injectables;
    };
  }
  function isScopeArgumentKey(value) {
    return value === SCOPE_ARGUMENT_KEY;
  }
  function isAPIDependency(value) {
    return value.startsWith("$");
  }
  function isServiceDependency(appCtx, value) {
    const service = appCtx.__getServiceHandler(value);
    return service !== null;
  }
  function isFactoryDependency(appCtx, value) {
    const factory = appCtx.__getFactoryHandler(value);
    return factory !== null;
  }
  function isHelperDependency(appCtx, value) {
    const helper = appCtx.__getHelperHandler(value);
    return helper !== null;
  }
  function resolveScopeParam(param) {
    if (param.type === "component" || param.type === "helper") {
      return param.component.scope;
    }
    return null;
  }
  function resolveAPIDependency(dependencyKey, param, appCtx) {
    if (param.type === "service" || param.type === "factory") {
      return {};
    }
    switch (dependencyKey) {
      case BLOCK_ARGUMENT_KEY:
        return composeBlockAPI(appCtx, param.component);
      case PATCH_ARGUMENT_KEY:
        return composePatchAPI(appCtx, param.component);
      case PARENT_ARGUMENT_KEY:
        return composeParentAPI(appCtx, param.component);
      case APP_ARGUMENT_KEY:
        return composeAppAPI(appCtx);
      case COMPONENT_ARGUMENT_KEY:
        return composeComponentAPI(appCtx, param.component);
      default:
        return {};
    }
  }
  function assertIsNotDependeningOnItsParents(
    component,
    dependencyKey,
    appCtx,
    options,
  ) {
    const parentNames = recursivelyGetParentNames(
      appCtx,
      component.id,
      options,
    );
    if (parentNames.has(dependencyKey)) {
      throw new Error(
        `Circular dependency detected: Component "${component.name}" cannot depend on its parent "${dependencyKey}".`,
      );
    }
  }
  function recursivelyGetParentNames(appCtx, componentId, options) {
    const parentNames = /* @__PURE__ */ new Set();
    const parentId = appCtx.__whoIsTheParent(componentId);
    if (parentId !== null) {
      const parent = appCtx.__getFromRegistryById(parentId);
      if (parent !== null && isComponentObject(parent)) {
        if (options.tryAlias) {
          if (parent.alias !== null) {
            parentNames.add(parent.alias);
          }
        } else {
          parentNames.add(parent.name);
        }
        const grandparents = recursivelyGetParentNames(
          appCtx,
          parentId,
          options,
        );
        grandparents.forEach((name) => parentNames.add(name));
      }
    }
    return parentNames;
  }
  function resolveComponentDependencyWithNameOrAlias(
    dependencyKey,
    component,
    appCtx,
  ) {
    function execute({ withAlias }) {
      assertIsNotDependeningOnItsParents(component, dependencyKey, appCtx, {
        tryAlias: withAlias,
      });
      let componentProxy2 = resolveComponentDependency(
        dependencyKey,
        component,
        appCtx,
        { matchUsingAlias: withAlias },
      );
      return componentProxy2;
    }
    const componentProxy = execute({ withAlias: false });
    if (componentProxy !== null) {
      return componentProxy;
    }
    return execute({ withAlias: true });
  }
  function resolveComponentDependency(
    dependencyKey,
    component,
    appCtx,
    options,
  ) {
    if (component.name === dependencyKey) {
      throw new Error(
        `Circular dependency detected: Component "${component.name}" cannot depend on itself.`,
      );
    }
    const matchedChildren = matchChildComponentsByName(
      component,
      dependencyKey,
      appCtx,
      options,
    );
    if (matchedChildren.length > 0) {
      const wrapper = {};
      for (let i2 = 0; i2 < matchedChildren.length; i2++) {
        const child = matchedChildren[i2];
        const proxy = invokeComponentHandler(
          child.name,
          child,
          appCtx,
          listDependencies,
          composeDependencyResolver(appCtx, listDependencies),
        );
        wrapper[child.id] = child;
      }
      return appCtx.__createComponentProxy(wrapper);
    }
    return null;
  }
  function matchChildComponentsByName(parent, name, appCtx, options) {
    const childrenIds = appCtx.__whoAreTheChildren(parent.id);
    const matchedChildren = [];
    childrenIds.forEach((childId) => {
      const child = appCtx.__getFromRegistryById(childId);
      if (child !== null && isComponentObject(child)) {
        if (options.matchUsingAlias && child.alias === name) {
          matchedChildren.push(child);
          return;
        }
        if (!options.matchUsingAlias && child.name === name) {
          matchedChildren.push(child);
          return;
        }
      }
    });
    return matchedChildren;
  }
  function invokeComponentHandler(
    name,
    componentObject,
    appCtx,
    listDependenciesFn,
    resolveDependenciesFn,
  ) {
    const proxy = componentObject.proxy;
    if (proxy !== null) {
      return proxy;
    }
    const handler = appCtx.__getComponentHandler(name);
    if (handler === null) {
      throw new Error(`Missing component handler ${name}`);
    }
    const dependencies = listDependenciesFn(handler);
    const injectables = resolveDependenciesFn({
      dependencies,
      type: "component",
      component: componentObject,
    });
    const exposedProxy = handler(...injectables);
    componentObject.proxy = exposedProxy;
    return exposedProxy;
  }
  function invokeFactoryHandler(
    name,
    appCtx,
    listDependenciesFn,
    resolveDependenciesFn,
  ) {
    let handler = appCtx.__getFactoryHandler(name);
    if (handler === null) {
      throw new Error(`Missing factory handler ${name}`);
    }
    const dependencies = listDependenciesFn(handler);
    const injectables = resolveDependenciesFn({
      dependencies,
      type: "factory",
    });
    const factory = handler(...injectables);
    if (typeof factory === "function") {
      return factory;
    }
    throw new Error(`Factory ${name} handler must return class reference`);
  }
  function invokeServiceHandler(
    name,
    appCtx,
    listDependenciesFn,
    resolveDependenciesFn,
  ) {
    const serviceOrComponentObject = appCtx.__getFromRegistryById(name);
    if (serviceOrComponentObject !== null) {
      if (isComponentObject(serviceOrComponentObject)) {
        throw new Error(`Service ${name} is also a component`);
      }
      return serviceOrComponentObject;
    }
    const handler = appCtx.__getServiceHandler(name);
    if (handler === null) {
      throw new Error(`Missing service handler ${name}`);
    }
    const dependencies = listDependenciesFn(handler);
    const injectables = resolveDependenciesFn({
      dependencies,
      type: "service",
    });
    const serviceObject = handler(...injectables);
    if (serviceObject === void 0 || serviceObject === null) {
      throw new Error(
        `Service ${name} must not return ${typeof serviceObject}`,
      );
    }
    appCtx.__addRecordToRegistry(name, serviceObject);
    return serviceObject;
  }
  function invokeHelperHandler(
    name,
    appCtx,
    listDependenciesFn,
    resolveDependenciesFn,
    component,
  ) {
    let handler = appCtx.__getHelperHandler(name);
    if (handler === null) {
      throw new Error(`Missing helper handler ${name}`);
    }
    const dependencies = listDependenciesFn(handler);
    const injectables = resolveDependenciesFn({
      component,
      dependencies,
      type: "helper",
    });
    const helper = handler(...injectables);
    if (helper !== void 0 && helper !== null) {
      if (typeof helper !== "object") {
        throw new Error(`Helper ${name} must return an object`);
      }
    }
    return helper;
  }

  // out/services/lockService.js
  function composeElementLocker(attributeKeyFormatter) {
    return function lockElement(element2) {
      const attributeKey = attributeKeyFormatter(LOCK_ID_ATTR_KEY);
      element2.setAttribute(attributeKey, LOCK_ID_ATTR_VALUE);
    };
  }
  function composeIsElementLockedChecker(attributeKeyFormatter) {
    return function isElementLocked(element2) {
      const attributeKey = attributeKeyFormatter(LOCK_ID_ATTR_KEY);
      return element2.getAttribute(attributeKey) !== null;
    };
  }

  // out/services/namedElements.js
  function composeReferenceAttacher(appCtx, elementsSelector) {
    return function attachReferenceToNamedElements(referenceId, component) {
      [BLOCK_ELEMENT_ATTR].forEach((attribute) => {
        const namedElementAttribute =
          appCtx.__pluncAttributeKeyFormatter(attribute);
        const attributableElements = elementsSelector(
          component,
          `[${namedElementAttribute}]`,
        );
        attributableElements.forEach((element2) => {
          appCtx.__pluncAttributeValueSetter(
            element2,
            ELEMENT_REFERENCE_ATTR,
            referenceId,
          );
        });
      });
    };
  }

  // out/services/scopeReconciler.js
  function reconcileChildren(source, target) {
    if (source === null) return;
    while (source.childNodes.length > 0) {
      target.appendChild(source.childNodes[0]);
    }
  }
  function composeComponentReconciler(reconcileChildrenFn, findByComponentId) {
    return function reconcileScope(
      sourceScope,
      targetScope,
      childComponentIds,
    ) {
      const TChildRegistry = {};
      for (let i2 = 0; i2 < childComponentIds.length; i2++) {
        const childId = childComponentIds[i2];
        const tempChildEl = document.implementation.createHTMLDocument().body;
        const actualChildEl = findByComponentId(targetScope, childId);
        if (actualChildEl !== null) {
          reconcileChildren(actualChildEl, tempChildEl);
          TChildRegistry[childId] = tempChildEl;
        }
      }
      targetScope.innerHTML = "";
      reconcileChildren(sourceScope, targetScope);
      for (const childId in TChildRegistry) {
        const actualChildEl = findByComponentId(targetScope, childId);
        if (actualChildEl === null) continue;
        const tempChildEl = TChildRegistry[childId];
        reconcileChildren(tempChildEl, actualChildEl);
      }
    };
  }

  // out/services/templateService.js
  function collectTemplateElements(contextElement) {
    const templatesMap = /* @__PURE__ */ new Map();
    const templateElements = Array.from(
      contextElement.querySelectorAll("template"),
    );
    const pluncAttr = `plunc-${GLOBAL_ATTR_FOR_TEMPLATE_NAME}`;
    for (const templElement of templateElements) {
      const name = templElement.getAttribute(pluncAttr);
      if (name) {
        templatesMap.set(name, templElement.innerHTML);
      }
    }
    return templatesMap;
  }

  // out/bootstrap.js
  var contexts = [];
  var bindContext = makePluncAppContextBinder(
    resolveConfiguration,
    createPluncApp,
    addToLibrary,
    getServiceHandlerFromLibrary,
    getComponentHandlerFromLibrary,
    getFactoryHandlerFromLibrary,
    getHelperHandlerFromLibrary,
    addToRegistry,
    getFromRegistryByIds,
    getFromRegistryById,
    getAllFromRegistry,
    addRecordToLineage,
    lookupLineage,
    whoAreTheChildren,
    whoIsTheParent,
    whoAreTheSiblings,
    parseAliasNotation,
    selectElement,
    selectAllElements,
    composeBlockElementSelector,
    composeComponentSelectorById,
    composeComponentProxyFactory,
    createComponentFactory,
    createScope,
    composeElementLocker,
    composeIsElementLockedChecker,
    disposeElement,
    resolveExpression,
    reconcileChildren,
    cleanChildComponents,
    makeStagingElement,
  );
  var plunc = (window["plunc"] = {
    create: (applicationName, configuration = null) => {
      const instanceId = contexts.length + 1;
      const appContext = bindContext(
        instanceId,
        applicationName,
        configuration,
      );
      contexts.push(appContext);
      return {
        component: composeComponentBinder(appContext),
        service: composeServiceBinder(appContext),
        factory: composeFactoryBinder(appContext),
        helper: composeHelperBinder(appContext),
      };
    },
  });
  function shouldInit(appContext) {
    return __async(this, null, function* () {
      return appContext.__getInstance().config.startFn();
    });
  }
  function createStagingAppElement(appCtx, templatesMap) {
    const appName = appCtx.__getInstance().name;
    const template = templatesMap.get(appCtx.__getInstance().name);
    if (template === void 0) {
      throw new Error(`Missing app template for: ${appName}`);
    }
    return makeStagingElement(template);
  }
  function bootstrap(contexts2) {
    return __async(this, null, function* () {
      if (contexts2.length === 0) return;
      const [appContext, ...rest] = contexts2;
      if (!(yield shouldInit(appContext))) return;
      const templatesMap = collectTemplateElements(document.body);
      const appStagingElement = createStagingAppElement(
        appContext,
        templatesMap,
      );
      const componentIdGenerator = composeComponentIdGenerator(
        appContext.__getInstance(),
      );
      const referenceAttacher = composeReferenceAttacher(
        appContext,
        selectAllElements,
      );
      const renderComponents = composeComponentRenderer(
        appContext,
        templatesMap,
        selectAllElements,
        componentIdGenerator,
        referenceAttacher,
      );
      renderComponents(appStagingElement.getElement(), "");
      const allComponentObjects = appContext.__getAllFromRegistry();
      for (const componentId in allComponentObjects) {
        const componentObject = allComponentObjects[componentId];
        if (!isComponentObject(componentObject)) continue;
        const dependencyResolver = composeDependencyResolver(
          appContext,
          listDependencies,
        );
        invokeComponentHandler(
          componentObject.name,
          componentObject,
          appContext,
          listDependencies,
          dependencyResolver,
        );
      }
      for (const componentId in allComponentObjects) {
        const componentObject = allComponentObjects[componentId];
        if (!isComponentObject(componentObject)) continue;
        const targetComponentElement = appContext.__querySelectComponentById(
          appStagingElement.getElement(),
          componentObject.id,
        );
        if (targetComponentElement === null) continue;
        const tempElement = document.implementation.createHTMLDocument().body;
        tempElement.innerHTML = targetComponentElement.innerHTML;
        const idsOfChildren = appContext.__whoAreTheChildren(
          componentObject.id,
        );
        appContext.__clearChildComponents(tempElement, idsOfChildren);
        const processDirectives = composeDirectivesProcessor(appContext);
        processDirectives(tempElement, componentObject.scope, false);
        const reconcileComponent = composeComponentReconciler(
          reconcileChildren,
          appContext.__querySelectComponentById,
        );
        reconcileComponent(tempElement, targetComponentElement, idsOfChildren);
      }
      const appElement = selectLiveAppRootElement(
        appContext.__getInstance().name,
      );
      appElement.replaceChildren();
      appStagingElement.commitTo(appElement);
      appContext.__getInstance().toReady();
      const readyListeners = appContext.__getInstance().onReadyLtns;
      for (let i2 = 0; i2 < readyListeners.length; i2++) {
        const listener = readyListeners[i2];
        listener();
      }
      bootstrap(rest);
    });
  }
  DOMHelper.ready(bootstrap.bind(null, contexts));
})();
