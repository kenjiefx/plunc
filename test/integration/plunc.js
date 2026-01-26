"use strict";
(() => {
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
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
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // out/entities/component.js
  function createComponentFactory(parseAliasNotationFn, createScopeFn) {
    return function createComponent(id, nameThatMayHaveAlias) {
      const parsed = parseAliasNotationFn(nameThatMayHaveAlias);
      return {
        id,
        name: parsed.name,
        alias: parsed.alias,
        proxy: null,
        scope: createScopeFn(),
        __brand__: Symbol("ComponentObject")
      };
    };
  }
  function isComponentObject(entity) {
    return entity && typeof entity === "object" && "id" in entity && "name" in entity;
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
        children: []
      };
    }
    if (child === null)
      return;
    lineage.genealogy[parent].children.push(child);
    if (lineage.genealogy[child] === void 0) {
      lineage.genealogy[child] = {
        parent,
        children: []
      };
    }
  }
  function lookupLineage(lineage, child) {
    if (lineage.genealogy[child] === void 0)
      return [];
    const parents = [];
    let parent = lineage.genealogy[child].parent;
    while (parent !== null) {
      parents.push(parent);
      parent = lineage.genealogy[parent].parent;
    }
    return parents;
  }
  function whoAreTheChildren(lineage, parent) {
    if (lineage.genealogy[parent] === void 0)
      return [];
    return lineage.genealogy[parent].children;
  }
  function whoIsTheParent(lineage, child) {
    if (lineage.genealogy[child] === void 0)
      return null;
    return lineage.genealogy[child].parent;
  }
  function whoAreTheSiblings(lineage, child) {
    const parent = whoIsTheParent(lineage, child);
    if (parent === null)
      return [];
    const siblings = whoAreTheChildren(lineage, parent).filter((sibling) => sibling !== child);
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
      }
    };
  }

  // out/entities/registry.js
  function addToRegistry(registry, id, entity) {
    registry.data[id] = entity;
  }
  function getFromRegistryByIds(registry, ids) {
    return ids.map((id) => registry.data[id]).filter((entity) => entity !== void 0);
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
      alias: (_a = name.split(" as ")[1]) !== null && _a !== void 0 ? _a : null
    };
  }

  // out/services/pluncAttribute.js
  var GLOBAL_ATTR_FOR_TEMPLATE_NAME = "name";
  var COMPONENT_ELEMENT_ATTR = "component";
  var COMPONENT_ID_ATTR = "cid";
  var BLOCK_ELEMENT_ATTR = "block";
  var SCOPE_ARGUMENT_KEY = "$scope";
  var BLOCK_ARGUMENT_KEY = "$block";
  var PARENT_ARGUMENT_KEY = "$parent";
  var PATCH_ARGUMENT_KEY = "$patch";
  var APP_ARGUMENT_KEY = "$app";
  var COMPONENT_ARGUMENT_KEY = "$this";
  var ELEMENT_REFERENCE_ATTR = "rid";
  function composePluncAttributeKeyFormatter(instance) {
    const prefix = instance.config.prefix;
    return function pluncAttributeFormatter(key) {
      return `${prefix}${key}`;
    };
  }

  // out/services/blockService.js
  function createSelectorUsingAttributes(name, componentObject, pluncAttributeKeyFormatter) {
    const blockAttributeKey = pluncAttributeKeyFormatter(BLOCK_ELEMENT_ATTR);
    const referenceAttributeKey = pluncAttributeKeyFormatter(ELEMENT_REFERENCE_ATTR);
    return `[${blockAttributeKey}="${name}"][${referenceAttributeKey}="${componentObject.id}"]`;
  }
  function composeBlockElementSelector(pluncAttributeKeyFormatter, querySelectAllElements) {
    return function composeSelector(name, componentObject) {
      const blockSelector = createSelectorUsingAttributes(name, componentObject, pluncAttributeKeyFormatter);
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
              throw new Error(`Cannot invoke component "${name2}}" before $app is ready`);
            }
            if (!(name in exposed)) {
              throw new Error(`Calling undefined member "${name}" in component "${component.name}"`);
            }
            return exposed[name];
          }
        }
      };
      return new Proxy(wrapper, handler);
    };
  }

  // out/services/componentService.js
  function composeComponentRenderer(appCtx, templatesMap, elementsSelector, generateComponentId, attachReferenceToNamedElementsFn) {
    function renderComponent(componentWrapperElement, componentId, parentComponentId) {
      const componentName = getComponentName(appCtx, componentWrapperElement);
      appCtx.__pluncAttributeValueSetter(componentWrapperElement, COMPONENT_ID_ATTR, componentId);
      appCtx.__addRecordToLineage(parentComponentId, componentId);
      const componentAlias = getComponentAlias(appCtx, componentWrapperElement);
      const componentObject = createOrGetComponentObject(componentId, componentName, componentAlias, appCtx);
      assertNoCircularDependency(appCtx, componentObject);
      appCtx.__addRecordToRegistry(componentId, componentObject);
      const componentTemplate = templatesMap.get(componentName);
      if (componentTemplate === void 0) {
        throw new Error(`Template not found for component: ${componentName}`);
      }
      componentWrapperElement.innerHTML = componentTemplate;
      attachReferenceToNamedElementsFn(componentId, componentWrapperElement);
      renderComponentsOfParent(componentWrapperElement, componentId);
    }
    function renderComponentsOfParent(parentElement, parentComponentId) {
      const componentWrapperElements = selectAllComponentElementsInTarget(parentElement, appCtx, elementsSelector);
      let componentIterator = 0;
      componentWrapperElements.forEach((componentWrapperElement) => {
        const componentId = generateComponentId(componentIterator, parentComponentId);
        componentIterator++;
        renderComponent(componentWrapperElement, componentId, parentComponentId);
      });
    }
    return renderComponentsOfParent;
  }
  function selectAllComponentElementsInTarget(target, appCtx, elementsSelector) {
    const componentAttributeKey = appCtx.__pluncAttributeKeyFormatter(COMPONENT_ELEMENT_ATTR);
    return elementsSelector(target, `[${componentAttributeKey}]`);
  }
  function composeComponentSelectorById(pluncAttributeKeyFormatter, elementSelector) {
    return function selectComponentById(selectContext, componentId) {
      const attributeKey = pluncAttributeKeyFormatter(COMPONENT_ID_ATTR);
      const selector = `[${attributeKey}="${componentId}"]`;
      return elementSelector(selectContext, selector);
    };
  }
  function getComponentName(appCtx, componentElement) {
    const componentNameThatMayHaveAlias = getComponentNameThatMayHaveAlias(appCtx, componentElement);
    return appCtx.__aliasNotationParser(componentNameThatMayHaveAlias).name;
  }
  function getComponentAlias(appCtx, componentElement) {
    const componentNameThatMayHaveAlias = getComponentNameThatMayHaveAlias(appCtx, componentElement);
    return appCtx.__aliasNotationParser(componentNameThatMayHaveAlias).alias;
  }
  function getComponentNameThatMayHaveAlias(appCtx, componentElement) {
    const componentNameThatMayHaveAlias = appCtx.__pluncAttributeValueGetter(componentElement, COMPONENT_ELEMENT_ATTR);
    if (!componentNameThatMayHaveAlias) {
      throw new Error(`Component element is missing the ${COMPONENT_ELEMENT_ATTR} attribute.`);
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
    return appCtx.__createComponentObject(componentId, alias ? `${name}:${alias}` : name);
  }

  // out/services/configuration.js
  function resolveConfiguration(config) {
    var _a, _b, _c;
    const startFn = () => new Promise((resolve) => resolve(true));
    const endFn = () => new Promise((resolve) => resolve());
    return {
      prefix: (_a = config === null || config === void 0 ? void 0 : config.prefix) !== null && _a !== void 0 ? _a : "plunc-",
      startFn: (_b = config === null || config === void 0 ? void 0 : config.startFn) !== null && _b !== void 0 ? _b : startFn,
      endFn: (_c = config === null || config === void 0 ? void 0 : config.endFn) !== null && _c !== void 0 ? _c : endFn
    };
  }

  // out/services/elementService.js
  function selectElement(context, selector) {
    return context.querySelector(selector);
  }
  function selectAllElements(context, selector) {
    return Array.from(context.querySelectorAll(selector));
  }
  function composePluncAttributeValueGetter(formatPluncAttributeFn) {
    return function getPluncAttributeValue(element, key) {
      const attributeKey = formatPluncAttributeFn(key);
      return element.getAttribute(attributeKey);
    };
  }
  function composePluncAttributeValueSetter(formatPluncAttributeFn) {
    return function setPluncAttributeValue(element, key, value) {
      const attributeKey = formatPluncAttributeFn(key);
      element.setAttribute(attributeKey, value);
    };
  }
  function makeStagingElement(innerHtml) {
    const element = document.implementation.createHTMLDocument().body;
    if (innerHtml) {
      element.innerHTML = innerHtml;
    }
    return element;
  }

  // out/services/contextBinder.js
  function makePluncAppContextBinder(configResolver, createPluncAppFn, addToLibraryFn, getServiceHandlerFn, getComponentHandlerFn, getFactoryHandlerFn, getHelperHandlerFn, addToRegistryFn, getFromRegistryByIdsFn, getFromRegistryByIdFn, getAllFromRegistryFn, addRecordToLineageFn, lookupLineageFn, whoAreTheChildrenFn, whoIsTheParentFn, whoAreTheSiblingsFn, parseAliasNotationFn, selectElementFn, selectAllElementsFn, composeBlockElementSelectorFn, composeComponentSelectorByIdFn, composeComponentProxyFactoryFn, createComponentFactoryFn, createScopeObjectFn) {
    return function bindPluncAppContext(instanceId, applicationName, configuration = null) {
      const requiredConfiguration = configResolver(configuration);
      const registry = { data: {} };
      const library = { data: {} };
      const lineage = { genealogy: {} };
      const instance = createPluncAppFn(applicationName, instanceId, requiredConfiguration, registry, library);
      const attributeKeyFormatter = composePluncAttributeKeyFormatter(instance);
      const attributeValueGetter = composePluncAttributeValueGetter(attributeKeyFormatter);
      const attributeValueSetter = composePluncAttributeValueSetter(attributeKeyFormatter);
      const generateComponentId = composeComponentIdGenerator(instance);
      const blockSelectorCreator = composeBlockElementSelectorFn(attributeKeyFormatter, selectAllElementsFn);
      const componentSelectorById = composeComponentSelectorByIdFn(attributeKeyFormatter, selectElementFn);
      const componentObjectFactory = createComponentFactoryFn(parseAliasNotationFn, createScopeObjectFn);
      return {
        __getInstance: function() {
          return instance;
        },
        __addToLibrary: function(name, type, handler) {
          addToLibraryFn(library, name, type, handler);
        },
        __getServiceHandler: function(name) {
          return getServiceHandlerFn(library, name);
        },
        __getComponentHandler: function(name) {
          return getComponentHandlerFn(library, name);
        },
        __getFactoryHandler: function(name) {
          return getFactoryHandlerFn(library, name);
        },
        __getHelperHandler: function(name) {
          return getHelperHandlerFn(library, name);
        },
        __addRecordToRegistry: function(id, entity) {
          addToRegistryFn(registry, id, entity);
        },
        __getFromRegistryByIds: function(ids) {
          return getFromRegistryByIdsFn(registry, ids);
        },
        __getFromRegistryById: function(id) {
          return getFromRegistryByIdFn(registry, id);
        },
        __getAllFromRegistry: function() {
          return getAllFromRegistryFn(registry);
        },
        __addRecordToLineage: function(parent, child) {
          addRecordToLineageFn(lineage, parent, child);
        },
        __whoAreTheChildren: function(parent) {
          return whoAreTheChildrenFn(lineage, parent);
        },
        __whoIsTheParent: function(child) {
          return whoIsTheParentFn(lineage, child);
        },
        __whoAreTheSiblings: function(child) {
          return whoAreTheSiblingsFn(lineage, child);
        },
        __lookupLineage: function(child) {
          return lookupLineageFn(lineage, child);
        },
        __getLineage: function() {
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
        __createComponentObject: componentObjectFactory
      };
    };
  }

  // out/services/domReady.js
  var userAgent = navigator.userAgent.toLowerCase();
  var browser = {
    version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
    safari: /webkit/.test(userAgent),
    opera: /opera/.test(userAgent),
    msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
    mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
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
      window.onload = function() {
        if (oldonload)
          oldonload();
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
        if (isReady)
          return;
        try {
          document.documentElement.doScroll("left");
        } catch (error) {
          setTimeout(checkReady, 0);
          return;
        }
        domReady();
      })();
    if (browser.opera) {
      document.addEventListener("DOMContentLoaded", function checkReady() {
        if (isReady)
          return;
        for (var i = 0; i < document.styleSheets.length; i++)
          if (document.styleSheets[i].disabled) {
            setTimeout(checkReady, 0);
            return;
          }
        domReady();
      }, false);
    }
    if (browser.safari) {
      var numStyles;
      (function checkReady() {
        if (isReady)
          return;
        if (
          // @ts-ignore
          document.readyState != "loaded" && document.readyState != "complete"
        ) {
          setTimeout(checkReady, 0);
          return;
        }
        if (numStyles === void 0) {
          var links = document.getElementsByTagName("link");
          for (var i = 0; i < links.length; i++) {
            if (links[i].getAttribute("rel") == "stylesheet") {
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
    ready: function(callback) {
      bindReady();
      if (isReady)
        return callback.call(window, []);
      readyList.push(function() {
        return callback.call(window, []);
      });
    }
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
      }
    };
  }

  // out/entities/element.js
  var PluncElement = class _PluncElement {
    /**
     * @param element - The Element
     * @param pcount - The number of iteration of parent created
     */
    constructor(element, pcount = null) {
      Object.defineProperty(this, "$element", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "$parent", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "state", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "scope", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      this.$element = element;
      this.state = null;
      this.__wrapParent(pcount !== null && pcount !== void 0 ? pcount : 1);
    }
    /** Wraps the parent element within `PluncElement` object */
    __wrapParent(count) {
      const parentElement = this.$element.parentElement;
      if (count > 3 || parentElement === null)
        return;
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
      if (state === null)
        return;
      this.state = state;
    }
    setScope(scope) {
      this.scope = scope;
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
      for (var i = 0; i < classes.length; i++) {
        let aclass = classes[i];
        aclass === className ? this.removeClass(className) : this.addClass(className);
      }
    }
  };

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
        componentObject.id
      );
      if (!liveComponentElement) {
        throw new Error(`Cannot find the live component element for component id: ${componentObject.id}`);
      }
      const selectAllBlockElements = appCtx.__createBlockSelector(name, componentObject);
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
      if (parentId === null)
        return null;
      const parentComponentObject = appCtx.__getFromRegistryById(parentId);
      if (!parentComponentObject)
        return null;
      if (!isComponentObject(parentComponentObject))
        return null;
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
          componentObject.id
        );
        if (!liveComponentElement) {
          throw new Error(`Cannot find the live component element for component id: ${componentObject.id}`);
        }
        const { targetType, patchTargetNodes } = getPatchTargetNodesAndType(blockName, liveComponentElement, componentObject, appCtx);
      });
    };
  }
  function getPatchTargetNodesAndType(blockName, liveComponentElement, componentObject, appCtx) {
    if (blockName !== null) {
      const selectAllBlockElements = appCtx.__createBlockSelector(blockName, componentObject);
      const patchTargetNodes = selectAllBlockElements(liveComponentElement);
      return {
        targetType: "BLOCK",
        patchTargetNodes
      };
    }
    return {
      targetType: "COMPONENT",
      patchTargetNodes: [liveComponentElement]
    };
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
            throw new Error(`Cannot invoke component.get().element() outside $app.ready`);
          }
          const elementNode = appCtx.__querySelectComponentById(
            // Components are id'd uniquely accross different app instances,
            // so it's safe to query the document body directly.
            document.body,
            componentObject.id
          );
          if (elementNode === null) {
            return null;
          }
          return new PluncElement(elementNode);
        }
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
          const serviceObject = invokeServiceHandler(dependencyKey, appCtx, listDependenciesFn, resolveDependency);
          injectables.push(serviceObject);
          return;
        }
        if (isFactoryDependency(appCtx, dependencyKey)) {
          const factory = invokeFactoryHandler(dependencyKey, appCtx, listDependenciesFn, resolveDependency);
          injectables.push(factory);
          return;
        }
        if (isHelperDependency(appCtx, dependencyKey)) {
          if (param.type === "component" || param.type === "helper") {
            const helper = invokeHelperHandler(dependencyKey, appCtx, listDependenciesFn, resolveDependency, param.component);
            injectables.push(helper);
            return;
          } else {
            throw new Error(`Helper dependency "${dependencyKey}" can only be injected into components or helpers`);
          }
        }
        if (param.type === "component") {
          const componentProxy = resolveComponentDependencyWithNameOrAlias(dependencyKey, param.component, appCtx);
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
  function assertIsNotDependeningOnItsParents(component, dependencyKey, appCtx, options) {
    const parentNames = recursivelyGetParentNames(appCtx, component.id, options);
    if (parentNames.has(dependencyKey)) {
      throw new Error(`Circular dependency detected: Component "${component.name}" cannot depend on its parent "${dependencyKey}".`);
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
        const grandparents = recursivelyGetParentNames(appCtx, parentId, options);
        grandparents.forEach((name) => parentNames.add(name));
      }
    }
    return parentNames;
  }
  function resolveComponentDependencyWithNameOrAlias(dependencyKey, component, appCtx) {
    function execute({ withAlias }) {
      assertIsNotDependeningOnItsParents(component, dependencyKey, appCtx, {
        tryAlias: withAlias
      });
      let componentProxy2 = resolveComponentDependency(dependencyKey, component, appCtx, { matchUsingAlias: withAlias });
      return componentProxy2;
    }
    const componentProxy = execute({ withAlias: false });
    if (componentProxy !== null) {
      return componentProxy;
    }
    return execute({ withAlias: true });
  }
  function resolveComponentDependency(dependencyKey, component, appCtx, options) {
    if (component.name === dependencyKey) {
      throw new Error(`Circular dependency detected: Component "${component.name}" cannot depend on itself.`);
    }
    const matchedChildren = matchChildComponentsByName(component, dependencyKey, appCtx, options);
    if (matchedChildren.length > 0) {
      const wrapper = {};
      for (let i = 0; i < matchedChildren.length; i++) {
        const child = matchedChildren[i];
        const proxy = invokeComponentHandler(child.name, child, appCtx, listDependencies, composeDependencyResolver(appCtx, listDependencies));
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
  function invokeComponentHandler(name, componentObject, appCtx, listDependenciesFn, resolveDependenciesFn) {
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
      component: componentObject
    });
    const exposedProxy = handler(...injectables);
    componentObject.proxy = exposedProxy;
    return exposedProxy;
  }
  function invokeFactoryHandler(name, appCtx, listDependenciesFn, resolveDependenciesFn) {
    let handler = appCtx.__getFactoryHandler(name);
    if (handler === null) {
      throw new Error(`Missing factory handler ${name}`);
    }
    const dependencies = listDependenciesFn(handler);
    const injectables = resolveDependenciesFn({
      dependencies,
      type: "factory"
    });
    const factory = handler(...injectables);
    if (typeof factory === "function") {
      return factory;
    }
    throw new Error(`Factory ${name} handler must return class reference`);
  }
  function invokeServiceHandler(name, appCtx, listDependenciesFn, resolveDependenciesFn) {
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
      type: "service"
    });
    const serviceObject = handler(...injectables);
    if (serviceObject === void 0 || serviceObject === null) {
      throw new Error(`Service ${name} must not return ${typeof serviceObject}`);
    }
    appCtx.__addRecordToRegistry(name, serviceObject);
    return serviceObject;
  }
  function invokeHelperHandler(name, appCtx, listDependenciesFn, resolveDependenciesFn, component) {
    let handler = appCtx.__getHelperHandler(name);
    if (handler === null) {
      throw new Error(`Missing helper handler ${name}`);
    }
    const dependencies = listDependenciesFn(handler);
    const injectables = resolveDependenciesFn({
      component,
      dependencies,
      type: "helper"
    });
    const helper = handler(...injectables);
    if (helper !== void 0 && helper !== null) {
      if (typeof helper !== "object") {
        throw new Error(`Helper ${name} must return an object`);
      }
    }
    return helper;
  }

  // out/services/namedElements.js
  function composeReferenceAttacher(appCtx, elementsSelector) {
    return function attachReferenceToNamedElements(referenceId, component) {
      [BLOCK_ELEMENT_ATTR].forEach((attribute) => {
        const namedElementAttribute = appCtx.__pluncAttributeKeyFormatter(attribute);
        const attributableElements = elementsSelector(component, `[${namedElementAttribute}]`);
        attributableElements.forEach((element) => {
          appCtx.__pluncAttributeValueSetter(element, ELEMENT_REFERENCE_ATTR, referenceId);
        });
      });
    };
  }

  // out/services/templateService.js
  function collectTemplateElements(contextElement) {
    const templatesMap = /* @__PURE__ */ new Map();
    const templateElements = Array.from(contextElement.querySelectorAll("template"));
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
  var bindContext = makePluncAppContextBinder(resolveConfiguration, createPluncApp, addToLibrary, getServiceHandlerFromLibrary, getComponentHandlerFromLibrary, getFactoryHandlerFromLibrary, getHelperHandlerFromLibrary, addToRegistry, getFromRegistryByIds, getFromRegistryById, getAllFromRegistry, addRecordToLineage, lookupLineage, whoAreTheChildren, whoIsTheParent, whoAreTheSiblings, parseAliasNotation, selectElement, selectAllElements, composeBlockElementSelector, composeComponentSelectorById, composeComponentProxyFactory, createComponentFactory, createScope);
  var plunc = window["plunc"] = {
    create: (applicationName, configuration = null) => {
      const instanceId = contexts.length + 1;
      const appContext = bindContext(instanceId, applicationName, configuration);
      contexts.push(appContext);
      return {
        component: composeComponentBinder(appContext),
        service: composeServiceBinder(appContext),
        factory: composeFactoryBinder(appContext),
        helper: composeHelperBinder(appContext)
      };
    }
  };
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
      if (contexts2.length === 0)
        return;
      const [appContext, ...rest] = contexts2;
      if (!(yield shouldInit(appContext)))
        return;
      const templatesMap = collectTemplateElements(document.body);
      const appStagingElement = createStagingAppElement(appContext, templatesMap);
      const componentIdGenerator = composeComponentIdGenerator(appContext.__getInstance());
      const referenceAttacher = composeReferenceAttacher(appContext, selectAllElements);
      const renderComponents = composeComponentRenderer(appContext, templatesMap, selectAllElements, componentIdGenerator, referenceAttacher);
      renderComponents(appStagingElement, "");
      const allComponentObjects = appContext.__getAllFromRegistry();
      for (const componentId in allComponentObjects) {
        const componentObject = allComponentObjects[componentId];
        if (!isComponentObject(componentObject))
          continue;
        const dependencyResolver = composeDependencyResolver(appContext, listDependencies);
        invokeComponentHandler(componentObject.name, componentObject, appContext, listDependencies, dependencyResolver);
      }
      bootstrap(rest);
    });
  }
  DOMHelper.ready(bootstrap.bind(null, contexts));
})();
//# sourceMappingURL=plunc.js.map
