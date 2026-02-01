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
      var step = (x) =>
        x.done
          ? resolve(x.value)
          : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // out/services/configuration.js
  function resolveConfiguration(config) {
    var _a, _b, _c;
    const startFn = () => new Promise((resolve) => resolve(true));
    const endFn = () => new Promise((resolve) => resolve());
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

  // out/container.js
  function composePluncAppContainerFactory(
    createAppRepresentationInstance,
    createRegistryFn,
    addComponentToRegistryFn,
    getComponentByIdFromRegistryFn,
    getComponentsByIdFromRegistryFn,
    getAllComponentsFromRegistryFn,
    addServiceToRegistryFn,
    getServiceByIdFromRegistryFn,
    getServicesByIdFromRegistryFn,
    createLibraryFn,
    addToLibraryFn,
    getServiceHandlerFn,
    getComponentHandlerFn,
    getFactoryHandlerFn,
    getHelperHandlerFn,
    createLineageFn,
    addParentChildRecordFn,
    getComponentAncestorsFn,
    getComponentChildrenFn,
    getComponentParentFn,
    getComponentSiblingsFn,
    composePluncAttributeKeyFormatterFn,
    composePluncAttributeKeyGetterFn,
    composePluncAttributeKeySetterFn,
    aliasNotationParserFn,
    composeComponentIdGeneratorFn,
    selectElementFn,
    selectAllElementsFn,
    composeComponentSelectorByIdFn,
    composeElementSelectorsWithPluncAttributeFn,
    composeElementLockerFn,
    composeIsElementLockedCheckerFn,
    composeIsEventLockCheckerFn,
    composeEventLockerFn,
    disposeElementFn,
    composeChildComponentCleanerFn,
    composeBlockElementSelectorFn,
    createComponentInternalRepresentationFactoryFn,
    composeComponentProxyFactoryFn,
    pluncExpressionResolverFn,
    createStagingElementFn,
    setStagingElementInnerHtmlFn,
    getStagingElementInnerHtmlFn,
    commitStagingElementToFn,
  ) {
    return function createPluncAppContainer(
      instanceId,
      applicationName,
      configuration = null,
    ) {
      const requiredConfiguration = resolveConfiguration(configuration);
      const registry = createRegistryFn();
      const library = createLibraryFn();
      const lineage = createLineageFn();
      const appRepresentation = createAppRepresentationInstance(
        instanceId,
        applicationName,
        requiredConfiguration,
        library,
        registry,
      );
      const pluncAttributeKeyFormatter = composePluncAttributeKeyFormatterFn(
        requiredConfiguration,
      );
      const pluncAttributeValueGetter = composePluncAttributeKeyGetterFn(
        pluncAttributeKeyFormatter,
      );
      const pluncAttributeValueSetter = composePluncAttributeKeySetterFn(
        pluncAttributeKeyFormatter,
      );
      const blockSelectorFactory = composeBlockElementSelectorFn(
        pluncAttributeKeyFormatter,
        selectAllElementsFn,
      );
      const componentFactory = createComponentInternalRepresentationFactoryFn(
        aliasNotationParserFn,
      );
      const selectComponentById = composeComponentSelectorByIdFn(
        pluncAttributeKeyFormatter,
        selectElementFn,
      );
      const componentProxyFactory = composeComponentProxyFactoryFn();
      return {
        __getAppRepresentationInstance: () => appRepresentation,
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
        __addComponentToRegistry: function (id, component) {
          addComponentToRegistryFn(registry, id, component);
        },
        __getComponentFromRegistryById: function (id) {
          return getComponentByIdFromRegistryFn(registry, id);
        },
        __getComponentsFromRegistryByIds: function (ids) {
          return getComponentsByIdFromRegistryFn(registry, ids);
        },
        __getAllComponentsFromRegistry: function () {
          return getAllComponentsFromRegistryFn(registry);
        },
        __addServiceToRegistry: function (name, service) {
          addServiceToRegistryFn(registry, name, service);
        },
        __getServiceFromRegistryById: function (name) {
          return getServiceByIdFromRegistryFn(registry, name);
        },
        __getServicesFromRegistryByIds: function (ids) {
          return getServicesByIdFromRegistryFn(registry, ids);
        },
        __addRecordToLineage: function (parent, child) {
          addParentChildRecordFn(lineage, parent, child);
        },
        __lookupLineage: function (child) {
          return getComponentAncestorsFn(lineage, child);
        },
        __whoAreTheChildren: function (parent) {
          return getComponentChildrenFn(lineage, parent);
        },
        __whoIsTheParent: function (child) {
          return getComponentParentFn(lineage, child);
        },
        __whoAreTheSiblings: function (child) {
          return getComponentSiblingsFn(lineage, child);
        },
        __pluncAttributeKeyFormatter: pluncAttributeKeyFormatter,
        __pluncAttributeValueGetter: pluncAttributeValueGetter,
        __pluncAttributeValueSetter: pluncAttributeValueSetter,
        __aliasNotationParser: aliasNotationParserFn,
        __generateComponentId: composeComponentIdGeneratorFn(appRepresentation),
        __querySelectElement: selectElementFn,
        __querySelectAllElements: selectAllElementsFn,
        __querySelectComponentById: selectComponentById,
        __querySelectAllByPluncAttribute:
          composeElementSelectorsWithPluncAttributeFn(
            selectAllElementsFn,
            pluncAttributeKeyFormatter,
          ),
        __lockElement: composeElementLockerFn(pluncAttributeKeyFormatter),
        __isElementLocked: composeIsElementLockedCheckerFn(
          pluncAttributeKeyFormatter,
        ),
        __lockElementToEvent: composeEventLockerFn(pluncAttributeKeyFormatter),
        __isElementLockedToEvent: composeIsEventLockCheckerFn(
          pluncAttributeKeyFormatter,
        ),
        __trashElement: disposeElementFn,
        __clearChildComponents:
          composeChildComponentCleanerFn(selectComponentById),
        __createBlockSelector: blockSelectorFactory,
        __createComponentInternalRepresentation: componentFactory,
        __createComponentProxy: componentProxyFactory,
        __resolveExpression: pluncExpressionResolverFn,
        __createStagingElement: createStagingElementFn,
        __setStagingElementInnerHtml: setStagingElementInnerHtmlFn,
        __getStagingElementInnerHtml: getStagingElementInnerHtmlFn,
        __commitStagingElementTo: commitStagingElementToFn,
      };
    };
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
  var GLOBAL_DIRECTIVE_FOR_APP_NAME = "plunc-app";
  var GLOBAL_DIRECTIVE_FOR_TEMPLATE_NAME = "plunc-name";
  var GLOBAL_LOCK_ID_DIRECTIVE = "plunc-set";
  var GLOBAL_LOCK_ID_DIRECTIVE_VALUE = "true";
  var GLOBAL_EVENT_LOCK_DIRECTIVE = "plunc-event";
  var COMPONENT_ELEMENT_DIRECTIVE = "[PREFIX]component";
  var COMPONENT_ID_DIRECTIVE = "[PREFIX]cid";
  var REPEAT_ELEMENT_DIRECTIVE = "[PREFIX]repeat";
  var IF_ELEMENT_DIRECTIVE = "[PREFIX]if";
  var CHECK_ELEMENT_DIRECTIVE = "[PREFIX]check";
  var STYLE_ELEMENT_DIRECTIVE = "[PREFIX]style";
  var MODEL_ELEMENT_DIRECTIVE = "[PREFIX]model";
  var DISABLE_ELEMENT_DIRECTIVE = "[PREFIX]disable";
  var CLICK_EVENT_DIRECTIVE = "[PREFIX]click";
  var CHANGE_EVENT_DIRECTIVE = "[PREFIX]change";
  var TOUCH_EVENT_DIRECTIVE = "[PREFIX]touch";
  var BLOCK_ELEMENT_DIRECTIVE = "[PREFIX]block";
  var COMPONENT_REFERENCE_DIRECTIVE = "[PREFIX]rid";
  var SCOPE_ARGUMENT_KEY = "$scope";
  var BLOCK_ARGUMENT_KEY = "$block";
  var PARENT_ARGUMENT_KEY = "$parent";
  var PATCH_ARGUMENT_KEY = "$patch";
  var APP_ARGUMENT_KEY = "$app";
  var COMPONENT_ARGUMENT_KEY = "$this";
  var REPEAT_REFERENCE_TOKEN = "$$index";
  function composePluncAttributeKeyFormatter(config) {
    const prefix = config.prefix;
    return function pluncAttributeFormatter(key) {
      return key.replace("[PREFIX]", prefix);
    };
  }

  // out/services/blockService.js
  function createSelectorUsingAttributes(
    name,
    componentInternalRepresentation,
    pluncAttributeKeyFormatter,
  ) {
    const blockAttributeKey = pluncAttributeKeyFormatter(
      BLOCK_ELEMENT_DIRECTIVE,
    );
    const referenceAttributeKey = pluncAttributeKeyFormatter(
      COMPONENT_REFERENCE_DIRECTIVE,
    );
    return `[${blockAttributeKey}="${name}"][${referenceAttributeKey}="${componentInternalRepresentation.id}"]`;
  }
  function composeBlockElementSelector(
    pluncAttributeKeyFormatter,
    querySelectAllElements,
  ) {
    return function composeSelector(
      blockName,
      componentInternalRepresentation,
    ) {
      const blockSelector = createSelectorUsingAttributes(
        blockName,
        componentInternalRepresentation,
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
            const exposed = component.getProxy();
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
  function createComponentInternalRepresentationFactory(aliasParser) {
    return function createComponentInternalRepresentation(
      id,
      nameThatMayHaveAlias,
    ) {
      const { name, alias } = aliasParser(nameThatMayHaveAlias);
      let proxy = null;
      let template = `<!-- Component ${id} Template -->`;
      const scope = {};
      function setProxy(p) {
        proxy = p;
      }
      function getProxy() {
        return proxy;
      }
      function setTemplate(t) {
        template = t;
      }
      function getTemplate() {
        return template;
      }
      return {
        id,
        name,
        alias,
        scope,
        setProxy,
        getProxy,
        setTemplate,
        getTemplate,
      };
    };
  }
  function composeComponentIdGenerator(pluncApp) {
    return function generateComponentId(childIteration, parentComponentId) {
      if (parentComponentId !== "") {
        return `${parentComponentId}.${childIteration.toString()}`;
      }
      return `${pluncApp.id.toString()}.${childIteration.toString()}`;
    };
  }
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
        COMPONENT_ID_DIRECTIVE,
        componentId,
      );
      appCtx.__addRecordToLineage(parentComponentId, componentId);
      const componentAlias = getComponentAlias(appCtx, componentWrapperElement);
      const componentInternalRepresentation =
        createOrGetComponentInternalRepresentation(
          componentId,
          componentName,
          componentAlias,
          appCtx,
        );
      assertNoCircularDependency(appCtx, componentInternalRepresentation);
      appCtx.__addComponentToRegistry(
        componentId,
        componentInternalRepresentation,
      );
      const componentTemplate = templatesMap.get(componentName);
      if (componentTemplate === void 0) {
        throw new Error(`Template not found for component: ${componentName}`);
      }
      componentWrapperElement.innerHTML = componentTemplate;
      attachReferenceToNamedElementsFn(componentId, componentWrapperElement);
      renderComponentsOfParent(componentWrapperElement, componentId);
      componentInternalRepresentation.setTemplate(
        componentWrapperElement.innerHTML,
      );
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
      COMPONENT_ELEMENT_DIRECTIVE,
    );
    return elementsSelector(target, `[${componentAttributeKey}]`);
  }
  function composeComponentSelectorById(
    pluncAttributeKeyFormatter,
    elementSelector,
  ) {
    return function selectComponentById(selectContext, componentId) {
      const attributeKey = pluncAttributeKeyFormatter(COMPONENT_ID_DIRECTIVE);
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
      COMPONENT_ELEMENT_DIRECTIVE,
    );
    if (!componentNameThatMayHaveAlias) {
      throw new Error(
        `Component element is missing the ${COMPONENT_ELEMENT_DIRECTIVE} attribute.`,
      );
    }
    return componentNameThatMayHaveAlias;
  }
  function assertNoCircularDependency(appCtx, componentInternalRepresentation) {
    const name = componentInternalRepresentation.name;
    const idsOfParents = appCtx.__lookupLineage(
      componentInternalRepresentation.id,
    );
    const parentNames = appCtx.__getComponentsFromRegistryByIds(idsOfParents);
    parentNames.forEach((parent) => {
      if (parent && "name" in parent && parent.name === name) {
        throw new Error(`Circular dependency detected for component: ${name}`);
      }
    });
  }
  function createOrGetComponentInternalRepresentation(
    componentId,
    name,
    alias,
    appCtx,
  ) {
    const existingComponent =
      appCtx.__getComponentFromRegistryById(componentId);
    if (existingComponent !== null) {
      return existingComponent;
    }
    return appCtx.__createComponentInternalRepresentation(
      componentId,
      alias ? `${name}:${alias}` : name,
    );
  }

  // out/directives/check.js
  function composeCheckDirectiveProcessor(appCtx) {
    return function processCheckDirective(elementCtx, dataCtx2) {
      const elementsToProcess = appCtx.__querySelectAllByPluncAttribute(
        elementCtx,
        CHECK_ELEMENT_DIRECTIVE,
      );
      elementsToProcess.forEach((element2) => {
        if (appCtx.__isElementLocked(element2)) {
          return;
        }
        const checkExpression = appCtx.__pluncAttributeValueGetter(
          element2,
          CHECK_ELEMENT_DIRECTIVE,
        );
        if (checkExpression === null || checkExpression.trim() === "") {
          return;
        }
        const evaluatedResult = appCtx.__resolveExpression(
          dataCtx2,
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
    return function processConditionalDirectives(elementCtx, dataCtx2) {
      const elementsToProcess = appCtx.__querySelectAllByPluncAttribute(
        elementCtx,
        IF_ELEMENT_DIRECTIVE,
      );
      elementsToProcess.forEach((element2) => {
        if (appCtx.__isElementLocked(element2)) {
          return;
        }
        const conditionExpression = appCtx.__pluncAttributeValueGetter(
          element2,
          IF_ELEMENT_DIRECTIVE,
        );
        if (conditionExpression === null || conditionExpression.trim() === "") {
          return;
        }
        const evaluationResult = appCtx.__resolveExpression(
          dataCtx2,
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
    return function processDisableDirective(elementCtx, dataCtx2) {
      const elementsToProcess = appCtx.__querySelectAllByPluncAttribute(
        elementCtx,
        DISABLE_ELEMENT_DIRECTIVE,
      );
      elementsToProcess.forEach((element2) => {
        if (appCtx.__isElementLocked(element2)) {
          return;
        }
        const disableExpression = appCtx.__pluncAttributeValueGetter(
          element2,
          DISABLE_ELEMENT_DIRECTIVE,
        );
        if (disableExpression === null || disableExpression.trim() === "") {
          return;
        }
        const evaluatedResult = appCtx.__resolveExpression(
          dataCtx2,
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

  // out/services/expressionResolver.js
  function resolvePluncExpression(dataCtx2, expression2, element2 = null) {
    const resolveType2 = getExpressionResolveType(expression2);
    return initExpressionResolver(
      dataCtx2,
      expression2,
      resolveType2,
      element2,
    );
  }
  function getExpressionResolveType(expression2) {
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
  function initExpressionResolver(
    dataCtx,
    expression,
    resolveType,
    element = null,
  ) {
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
        return evaluateObject(dataCtx, expression);
        break;
      case "function":
        let structure = expression.split("(");
        let expressionTest = structure[0].split(".");
        if (expressionTest.length > 1) {
          let refObject = resolvePluncExpression(
            dataCtx,
            getParentObjectExp(structure[0]),
          );
          let funcExpression = expression
            .split(".")
            .slice(expressionTest.length - 1)
            .join(".");
          return invokeFunction(refObject, dataCtx, funcExpression, element);
        }
        if (!Object.prototype.hasOwnProperty.call(dataCtx, structure[0])) {
          return "";
        }
        return invokeFunction(dataCtx, dataCtx, expression, element);
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
            return evaluatorMap[comparator](dataCtx, expression, comparator);
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
            let left = resolvePluncExpression(dataCtx, exp[0].trim());
            var right = resolvePluncExpression(dataCtx, exp[1].trim());
            finalExpression = left + operations[i] + right;
          }
        }
        return eval(finalExpression);
        break;
      default:
        break;
    }
  }
  function evaluateObject(dataCtx2, expression2) {
    if (expression2 === "$dataCtx") {
      return dataCtx2;
    }
    return expression2.split(".").reduce(function (o, x) {
      if (o === void 0) return;
      if (o === null) return;
      if (o[x] === void 0) return;
      return o[x];
    }, dataCtx2);
  }
  function invokeFunction(dataCtx2, object, expression2, element2) {
    if (dataCtx2 === void 0) return "";
    const splitExpression = expression2.match(/\(([^)]+)\)/);
    let struct = expression2.split("(");
    let name = struct[0];
    if (splitExpression !== null) {
      const argsVault = new Array();
      const splitArguments = splitExpression[1].split(",");
      for (let i2 = 0; i2 < splitArguments.length; i2++) {
        argsVault.push(
          resolvePluncExpression(object, splitArguments[i2].trim()),
        );
      }
      if (element2 !== null) {
        argsVault.push(element2);
      }
      if (!(dataCtx2[name] instanceof Function)) {
        return "";
      }
      return dataCtx2[name](...argsVault);
    }
    if (element2 !== null) {
      const argsVault = new Array();
      argsVault.push(element2);
      return dataCtx2[name](...argsVault);
    }
    if (!(dataCtx2[name] instanceof Function)) {
      return "";
    }
    return dataCtx2[name]();
  }
  function getParentObjectExp(expression2) {
    let pieces = expression2.split(".");
    if (pieces.length < 2) return "$dataCtx";
    pieces.pop();
    return pieces.join(".");
  }
  function getParentObjAsObject(base, expression2) {
    const parentObjExp = getParentObjectExp(expression2);
    return resolvePluncExpression(base, parentObjExp);
  }
  function getChildObjectExp(expression2) {
    let pieces = expression2.split(".");
    return pieces[pieces.length - 1];
  }
  function areTwoExpressionsTheSame(dataCtx2, expression2, comparator) {
    const [left, right2] = expression2.split(comparator).map((arm) => {
      return resolvePluncExpression(dataCtx2, arm.trim());
    });
    return left === right2;
  }
  function areTwoExpressionsNotTheSame(dataCtx2, expression2, comparator) {
    const [left, right2] = expression2.split(comparator).map((arm) => {
      return resolvePluncExpression(dataCtx2, arm.trim());
    });
    return left !== right2;
  }
  function isGreaterThanTheOther(dataCtx2, expression2, comparator) {
    const [left, right2] = expression2.split(comparator).map((arm) => {
      return resolvePluncExpression(dataCtx2, arm.trim());
    });
    return left > right2;
  }
  function isGreaterThanOrEqualToTheOther(dataCtx2, expression2, comparator) {
    const [left, right2] = expression2.split(comparator).map((arm) => {
      return resolvePluncExpression(dataCtx2, arm.trim());
    });
    return left >= right2;
  }
  function isLessThanTheOther(dataCtx2, expression2, comparator) {
    const [left, right2] = expression2.split(comparator).map((arm) => {
      return resolvePluncExpression(dataCtx2, arm.trim());
    });
    return left < right2;
  }
  function isLessThanOrEqualToTheOther(dataCtx2, expression2, comparator) {
    const [left, right2] = expression2.split(comparator).map((arm) => {
      return resolvePluncExpression(dataCtx2, arm.trim());
    });
    return left <= right2;
  }

  // out/services/pluncElement.js
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
      for (var i2 = 0; i2 < classes.length; i2++) {
        let aclass = classes[i2];
        aclass === className
          ? this.removeClass(className)
          : this.addClass(className);
      }
    }
  };

  // out/directives/events.js
  function bindEventListenerToElement(
    dataCtx2,
    bindToElement,
    fnExpression,
    eventType,
  ) {
    if (getExpressionResolveType(fnExpression) !== "function") return;
    bindToElement.addEventListener(eventType, () => {
      const pluncElement = new PluncElement(bindToElement);
      resolvePluncExpression(dataCtx2, fnExpression, pluncElement);
    });
  }
  function composeEventDirectiveProcessor(appCtx) {
    return function processEventDirectives(elementCtx, dataCtx2) {
      const events = [
        { type: "click", attr: CLICK_EVENT_DIRECTIVE },
        { type: "change", attr: CHANGE_EVENT_DIRECTIVE },
        { type: "keyup", attr: TOUCH_EVENT_DIRECTIVE },
      ];
      events.forEach((event) => {
        const elementsToProcess = appCtx.__querySelectAllByPluncAttribute(
          elementCtx,
          event.attr,
        );
        elementsToProcess.forEach((element2) => {
          if (appCtx.__isElementLockedToEvent(element2, event.type)) {
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
            dataCtx2,
            element2,
            fnExpression,
            event.type,
          );
          appCtx.__lockElementToEvent(element2, event.type);
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
  var assignModelValue = (dataCtx2, expression2, value) => {
    const parentObj = getParentObjAsObject(dataCtx2, expression2);
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
    dataCtx2,
    expression2,
    expressionValue,
  ) {
    const elementType = maybeRadioOrCheckboxElement.type.toLowerCase();
    if (elementType !== "radio" && elementType !== "checkbox") {
      return;
    }
    console.log({ dataCtx2, expression2, expressionValue });
    const radioOrCheckboxElement = maybeRadioOrCheckboxElement;
    if (expressionValue === void 0) {
      assignModelValue(dataCtx2, expression2, false);
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
    dataCtx2,
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
        assignModelValue(dataCtx2, expression2, inputElement.value);
      } else {
        inputElement.value = castAnyValueToString(expressionValue);
      }
    }
  }
  function handleNumberInputModel(
    maybeInputNumberElement,
    dataCtx2,
    expression2,
    expressionValue,
  ) {
    const elementType = maybeInputNumberElement.type.toLowerCase();
    if (elementType === "number") {
      const inputElement = maybeInputNumberElement;
      if (expressionValue === void 0) {
        assignModelValue(dataCtx2, expression2, 0);
        inputElement.value = "0";
      } else {
        inputElement.value = castAnyValueToString(expressionValue);
      }
    }
  }
  function composeModelHandlerExecutor(
    targetELement,
    dataCtx2,
    expression2,
    expressionValue,
  ) {
    return function executeHandler(handler) {
      handler(targetELement, dataCtx2, expression2, expressionValue);
    };
  }
  function handleDateInputModel(
    maybeDateInputElement,
    dataCtx2,
    expression2,
    expressionValue,
  ) {
    const elementType = maybeDateInputElement.type.toLowerCase();
    if (elementType === "date") {
      const dateInputElement = maybeDateInputElement;
      if (expressionValue === void 0) {
        const currentDate = getCurrentDate();
        assignModelValue(dataCtx2, expression2, currentDate);
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
    dataCtx2,
    expression2,
    expressionValue,
  ) {
    const elementType = maybeTimeInputElement.type.toLowerCase();
    if (elementType === "time") {
      const timeInputElement = maybeTimeInputElement;
      if (expressionValue === void 0) {
        const currentTime = getCurrentTime();
        assignModelValue(dataCtx2, expression2, currentTime);
        timeInputElement.value = currentTime;
      } else {
        const stringifiedValue = castAnyValueToString(expressionValue);
        assertTimeFormat(stringifiedValue);
        timeInputElement.value = stringifiedValue;
      }
    }
  }
  function composeModelDirectiveProcessor(appCtx) {
    return function processModelDirective(elementCtx, dataCtx2) {
      const elementsToProcess = appCtx.__querySelectAllByPluncAttribute(
        elementCtx,
        MODEL_ELEMENT_DIRECTIVE,
      );
      elementsToProcess.forEach((element2) => {
        const modelExpression = appCtx.__pluncAttributeValueGetter(
          element2,
          MODEL_ELEMENT_DIRECTIVE,
        );
        if (modelExpression === null || modelExpression.trim() === "") {
          return;
        }
        if (appCtx.__isElementLocked(element2)) {
          return;
        }
        let evaluationResult = appCtx.__resolveExpression(
          dataCtx2,
          modelExpression,
        );
        if (element2.tagName === "INPUT" || element2.tagName === "SELECT") {
          if (element2 instanceof HTMLInputElement) {
            const execute = composeModelHandlerExecutor(
              element2,
              dataCtx2,
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
              ? assignModelValue(dataCtx2, modelExpression, element2.value)
              : (element2.value = castAnyValueToString(evaluationResult));
          }
          element2.addEventListener("change", (event) => {
            const target = event.target;
            if (target instanceof HTMLInputElement) {
              const targetType = target.type.toLowerCase();
              if (targetType === "radio" || targetType === "checkbox") {
                const isChecked = target.checked;
                assignModelValue(dataCtx2, modelExpression, isChecked);
                return;
              }
              assignModelValue(dataCtx2, modelExpression, target.value);
            }
            if (target instanceof HTMLSelectElement) {
              assignModelValue(dataCtx2, modelExpression, target.value);
            }
          });
        } else if (
          element2.tagName === "TEXTAREA" &&
          element2 instanceof HTMLTextAreaElement
        ) {
          evaluationResult === void 0
            ? assignModelValue(dataCtx2, modelExpression, element2.value)
            : (element2.value = castAnyValueToString(evaluationResult));
          element2.addEventListener("change", (event) => {
            const target = event.target;
            if (!(target instanceof HTMLTextAreaElement)) return;
            const value = target.value;
            assignModelValue(dataCtx2, modelExpression, value);
          });
        }
        appCtx.__lockElement(element2);
      });
    };
  }

  // out/directives/placeholders.js
  function composePlaceholderResolver(appCtx) {
    return function resolvePlaceholders(elementCtx, dataCtx2) {
      const regEx = new RegExp("(?<=\\{{).+?(?=\\}})", "g");
      const htmlContent = elementCtx.innerHTML;
      const matchedPlaceholders = htmlContent.match(regEx);
      if (matchedPlaceholders === null) {
        return;
      }
      matchedPlaceholders.forEach((placeholder) => {
        const expression2 = placeholder.trim();
        let evaluationResult = appCtx.__resolveExpression(
          dataCtx2,
          expression2,
        );
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
    function processRepeatDirective(repeatableElementCtx, dataCtx2) {
      const scope = Object.assign({}, dataCtx2);
      const template = repeatableElementCtx.innerHTML;
      repeatableElementCtx.replaceChildren();
      let repeatExpression = appCtx.__pluncAttributeValueGetter(
        repeatableElementCtx,
        REPEAT_ELEMENT_DIRECTIVE,
      );
      if (repeatExpression === null || repeatExpression.trim() === "") {
        return;
      }
      let [dataSourceExpr, itemAlias] =
        dissectRepeatExpression(repeatExpression);
      if (dataSourceExpr === REPEAT_REFERENCE_TOKEN) {
        const repetitions = appCtx.__resolveExpression(scope, itemAlias);
        let times = countRepeatable(repetitions);
        scope["$$index"] = {};
        let k = 0;
        while (k < times) scope["$$index"]["props" + k++] = new Object();
      }
      const repeatableObject = appCtx.__resolveExpression(
        scope,
        dataSourceExpr,
      );
      if (!isIterableWithEntries(repeatableObject)) {
        return;
      }
      let indexNumber = 0;
      for (const [key, value] of Object.entries(repeatableObject)) {
        const repeatDataCtx = {
          $parent: dataCtx2,
          $index: indexNumber,
          [itemAlias]: value,
        };
        const repeatedElementCtx = appCtx.__createStagingElement(template);
        processDirectivesOnRepeatedElementFn(repeatedElementCtx, repeatDataCtx);
        appCtx.__commitStagingElementTo(
          repeatedElementCtx,
          repeatableElementCtx,
        );
        indexNumber++;
      }
    }
    return function processRepeatDirectives(
      elementCtx,
      dataCtx2,
      processDirectivesOnRepeatedElement,
    ) {
      const repeatElements = appCtx.__querySelectAllByPluncAttribute(
        elementCtx,
        REPEAT_ELEMENT_DIRECTIVE,
      );
      processDirectivesOnRepeatedElementFn = processDirectivesOnRepeatedElement;
      for (const repeatElement of repeatElements) {
        processRepeatDirective(repeatElement, dataCtx2);
      }
    };
  }

  // out/directives/style.js
  function composeStyleDirectiveProcessor(appCtx) {
    return function processStyleDirective(elementCtx, dataCtx2) {
      const elementsToProcess = appCtx.__querySelectAllByPluncAttribute(
        elementCtx,
        STYLE_ELEMENT_DIRECTIVE,
      );
      elementsToProcess.forEach((element2) => {
        if (appCtx.__isElementLocked(element2)) {
          return;
        }
        const styleExpression = appCtx.__pluncAttributeValueGetter(
          element2,
          STYLE_ELEMENT_DIRECTIVE,
        );
        if (styleExpression === null || styleExpression.trim() === "") {
          return;
        }
        const evaluatedResult = appCtx.__resolveExpression(
          dataCtx2,
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
      dataCtx2,
      skipEventProcessing = true,
    ) {
      processRepeat(targetElement, dataCtx2, processDirectives);
      processConditionals(targetElement, dataCtx2);
      resolvePlaceholders(targetElement, dataCtx2);
      processCheck(targetElement, dataCtx2);
      processStyles(targetElement, dataCtx2);
      processModels(targetElement, dataCtx2);
      processDisable(targetElement, dataCtx2);
      if (skipEventProcessing === false) {
        processEvents(targetElement, dataCtx2);
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
  function composeChildComponentCleaner(selectElementByComponentId) {
    return function cleanChildComponent(component, childIds) {
      for (let i2 = 0; i2 < childIds.length; i2++) {
        const childId = childIds[i2];
        const child = selectElementByComponentId(component, childId);
        if (child !== null) child.innerHTML = "";
      }
    };
  }
  function selectLiveAppRootElement(appName) {
    const appRootAttributeKey = `${GLOBAL_DIRECTIVE_FOR_APP_NAME}`;
    const selector = `[${appRootAttributeKey}="${appName}"]`;
    const element2 = document.querySelector(selector);
    if (!element2) {
      throw new Error(`Cannot find the app root element for app: ${appName}`);
    }
    return element2;
  }

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
        appCtx.__getAppRepresentationInstance().onReady(listener);
      },
    };
  }

  // out/apis/$block.js
  function composeBlockAPI(appCtx, componentObject) {
    return function $block(name, callback) {
      if (!appCtx.__getAppRepresentationInstance().isReady()) {
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
      const parentComponentObject =
        appCtx.__getComponentFromRegistryById(parentId);
      if (!parentComponentObject) return null;
      const wrapper = {};
      wrapper[parentId] = parentComponentObject;
      return appCtx.__createComponentProxy(wrapper);
    };
  }

  // out/apis/$patch.js
  function composePatchAPI(appCtx, componentObject) {
    return function $patch(blockName = null) {
      return __async(this, null, function* () {
        if (!appCtx.__getAppRepresentationInstance().isReady()) {
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
            appCtx.__setStagingElementInnerHtml(
              elementBindFrom,
              componentObject.getTemplate(),
            );
          } else {
            if (blockName === null) continue;
            const blockTemplate = getBlockTemplate(
              appCtx,
              componentObject,
              blockName,
            );
            appCtx.__setStagingElementInnerHtml(elementBindFrom, blockTemplate);
          }
          const processDirectives = composeDirectivesProcessor(appCtx);
          processDirectives(elementBindFrom, componentObject.scope, false);
          elementBindTo.innerHTML = "";
          appCtx.__commitStagingElementTo(elementBindFrom, elementBindTo);
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
      componentObject.getTemplate(),
    );
    const blockDirective = appCtx.__pluncAttributeKeyFormatter(
      BLOCK_ELEMENT_DIRECTIVE,
    );
    const referenceDirective = appCtx.__pluncAttributeKeyFormatter(
      COMPONENT_REFERENCE_DIRECTIVE,
    );
    const specificBlockSelector = `[${blockDirective}="${blockName}"][${referenceDirective}="${componentObject.id}"]`;
    const blockElement = appCtx.__querySelectAllElements(
      stagingElement,
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
          if (!appCtx.__getAppRepresentationInstance().isReady()) {
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
      const parent = appCtx.__getComponentFromRegistryById(parentId);
      if (parent !== null) {
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
      const child = appCtx.__getComponentFromRegistryById(childId);
      if (child !== null) {
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
    ComponentInternalRepresentation,
    appCtx,
    listDependenciesFn,
    resolveDependenciesFn,
  ) {
    const proxy = ComponentInternalRepresentation.getProxy();
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
      component: ComponentInternalRepresentation,
    });
    const exposedProxy = handler(...injectables);
    ComponentInternalRepresentation.setProxy(exposedProxy);
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
    const serviceInternalRepresentation =
      appCtx.__getServiceFromRegistryById(name);
    const handler = appCtx.__getServiceHandler(name);
    if (handler === null) {
      throw new Error(`Missing service handler ${name}`);
    }
    const dependencies = listDependenciesFn(handler);
    const injectables = resolveDependenciesFn({
      dependencies,
      type: "service",
    });
    let serviceExternalApi = handler(...injectables);
    if (serviceExternalApi === void 0 || serviceExternalApi === null) {
      serviceExternalApi = {};
    }
    appCtx.__addServiceToRegistry(name, serviceExternalApi);
    return serviceExternalApi;
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

  // out/errors/pluncError.js
  var PluncError = class extends Error {
    constructor(message) {
      const processedMessage = `Plunc: An error has occured! Please see https://kenjiefx.github.io/plunc/errors/${message}.html for more details.`;
      super(processedMessage);
      Object.setPrototypeOf(this, Error.prototype);
    }
  };

  // out/types.js
  var LibraryBrand = Symbol("LibraryBrand");
  var ComponentFamilyTreeBrand = Symbol("ComponentFamilyTreeBrand");
  var RegistryBrand = Symbol("RegistryBrand");

  // out/services/libraryService.js
  function createNewHandlerLibrary() {
    const library = {
      data: {
        component: /* @__PURE__ */ new Map(),
        service: /* @__PURE__ */ new Map(),
        factory: /* @__PURE__ */ new Map(),
        helper: /* @__PURE__ */ new Map(),
      },
      [LibraryBrand]: true,
    };
    return library;
  }
  function getInternalDataFromLibrary(library) {
    if ("data" in library) {
      return library;
    }
    throw new PluncError("ERR4");
  }
  function addHandlerToLibrary(library, name, type, handler) {
    const internalData = getInternalDataFromLibrary(library);
    switch (type) {
      case "component":
        internalData.data.component.set(name, handler);
        break;
      case "service":
        internalData.data.service.set(name, handler);
        break;
      case "factory":
        internalData.data.factory.set(name, handler);
        break;
      case "helper":
        internalData.data.helper.set(name, handler);
        break;
    }
  }
  function getComponentHandlerFromLibrary(library, name) {
    var _a;
    const internalData = getInternalDataFromLibrary(library);
    return (_a = internalData.data.component.get(name)) !== null &&
      _a !== void 0
      ? _a
      : null;
  }
  function getServiceHandlerFromLibrary(library, name) {
    var _a;
    const internalData = getInternalDataFromLibrary(library);
    return (_a = internalData.data.service.get(name)) !== null && _a !== void 0
      ? _a
      : null;
  }
  function getFactoryHandlerFromLibrary(library, name) {
    var _a;
    const internalData = getInternalDataFromLibrary(library);
    return (_a = internalData.data.factory.get(name)) !== null && _a !== void 0
      ? _a
      : null;
  }
  function getHelperHandlerFromLibrary(library, name) {
    var _a;
    const internalData = getInternalDataFromLibrary(library);
    return (_a = internalData.data.helper.get(name)) !== null && _a !== void 0
      ? _a
      : null;
  }

  // out/services/lineageService.js
  function getInternalComponentFamilyTree(tree) {
    if ("data" in tree) {
      return tree;
    }
    throw new PluncError("ERR5");
  }
  function createComponentLineage() {
    const genealogy = {
      data: {},
      [ComponentFamilyTreeBrand]: true,
    };
    return genealogy;
  }
  function addRecordToComponentLineage(tree, parentId, childId) {
    const internalTree = getInternalComponentFamilyTree(tree);
    if (internalTree.data[parentId] === void 0) {
      internalTree.data[parentId] = {
        parent: null,
        children: [],
      };
    }
    internalTree.data[parentId].children.push(childId);
    if (internalTree.data[childId] === void 0) {
      internalTree.data[childId] = {
        parent: parentId,
        children: [],
      };
    }
  }
  function lookupComponentLineage(tree, childId) {
    const internalTree = getInternalComponentFamilyTree(tree);
    if (internalTree.data[childId] === void 0) return [];
    const parents = [];
    let parent = internalTree.data[childId].parent;
    while (parent !== null) {
      parents.push(parent);
      parent = internalTree.data[parent].parent;
    }
    return parents;
  }
  function whoAreTheChildrenOfComponent(tree, parentId) {
    const internalTree = getInternalComponentFamilyTree(tree);
    if (internalTree.data[parentId] === void 0) return [];
    return internalTree.data[parentId].children;
  }
  function whoIsTheParentOfComponent(tree, childId) {
    const internalTree = getInternalComponentFamilyTree(tree);
    if (internalTree.data[childId] === void 0) return null;
    return internalTree.data[childId].parent;
  }
  function whoAreTheSiblingsOfComponent(tree, componentId) {
    const internalTree = getInternalComponentFamilyTree(tree);
    if (internalTree.data[componentId] === void 0) return [];
    const parentId = internalTree.data[componentId].parent;
    if (parentId === null) return [];
    const siblings = internalTree.data[parentId].children.filter(
      (childId) => childId !== componentId,
    );
    return siblings;
  }

  // out/services/lockService.js
  function composeElementLocker(attributeKeyFormatter) {
    return function lockElement(element2) {
      const attributeKey = attributeKeyFormatter(GLOBAL_LOCK_ID_DIRECTIVE);
      element2.setAttribute(attributeKey, GLOBAL_LOCK_ID_DIRECTIVE_VALUE);
    };
  }
  function composeIsElementLockedChecker(attributeKeyFormatter) {
    return function isElementLocked(element2) {
      const attributeKey = attributeKeyFormatter(GLOBAL_LOCK_ID_DIRECTIVE);
      return element2.getAttribute(attributeKey) !== null;
    };
  }
  function composeIsEventLockChecker(attributeKeyFormatter) {
    return function isElementLockedToEvent(element2, eventName) {
      const attribute = attributeKeyFormatter(GLOBAL_EVENT_LOCK_DIRECTIVE);
      const existing = element2.getAttribute(attribute);
      if (existing === null) return false;
      const events = existing.split(",");
      return events.includes(eventName);
    };
  }
  function composeEventLocker(attributeKeyFormatter) {
    return function lockElementToEvent(element2, eventName) {
      const attributeKey = attributeKeyFormatter(GLOBAL_EVENT_LOCK_DIRECTIVE);
      const existing = element2.getAttribute(attributeKey);
      if (existing === null) {
        element2.setAttribute(attributeKey, eventName);
        return;
      }
      let events = existing.split(",");
      for (let i2 = 0; i2 < events.length; i2++) {
        const event = events[i2];
        if (event !== eventName) {
          events.push(eventName);
        }
      }
      element2.setAttribute(attributeKey, events.join(","));
    };
  }

  // out/services/namedElements.js
  function composeReferenceAttacher(appCtx, elementsSelector) {
    return function attachReferenceToNamedElements(referenceId, component) {
      [BLOCK_ELEMENT_DIRECTIVE].forEach((attribute) => {
        const namedElementAttribute =
          appCtx.__pluncAttributeKeyFormatter(attribute);
        const attributableElements = elementsSelector(
          component,
          `[${namedElementAttribute}]`,
        );
        attributableElements.forEach((element2) => {
          appCtx.__pluncAttributeValueSetter(
            element2,
            COMPONENT_REFERENCE_DIRECTIVE,
            referenceId,
          );
        });
      });
    };
  }

  // out/services/pluncAppService.js
  function createPluncAppInternalRepresentation(
    id,
    name,
    config,
    library,
    registry,
  ) {
    const onReadyListeners = [];
    let ready = false;
    function emitReady() {
      ready = true;
      for (const listener of onReadyListeners) {
        listener();
      }
    }
    function isReady2() {
      return ready;
    }
    function onReady(listener) {
      onReadyListeners.push(listener);
    }
    function getReadyListeners() {
      return onReadyListeners;
    }
    return {
      config,
      library,
      registry,
      name,
      id,
      getReadyListeners,
      emitReady,
      isReady: isReady2,
      onReady,
    };
  }

  // out/services/registryService.js
  function createNewComponentAndServiceRegistry() {
    const registry = {
      data: {
        components: /* @__PURE__ */ new Map(),
        services: /* @__PURE__ */ new Map(),
      },
      [RegistryBrand]: true,
    };
    return registry;
  }
  function getInternalRegistryData(registry) {
    if ("data" in registry) {
      return registry;
    }
    throw new PluncError("ERR6");
  }
  function addComponentToRegistry(registry, id, component) {
    const internalRegistry = getInternalRegistryData(registry);
    internalRegistry.data.components.set(id, component);
  }
  function getComponentFromRegistryById(registry, id) {
    var _a;
    const internalRegistry = getInternalRegistryData(registry);
    return (_a = internalRegistry.data.components.get(id)) !== null &&
      _a !== void 0
      ? _a
      : null;
  }
  function getComponentsFromRegistryByIds(registry, ids) {
    const internalRegistry = getInternalRegistryData(registry);
    const components = [];
    ids.forEach((id) => {
      const component = internalRegistry.data.components.get(id);
      if (component) {
        components.push(component);
      }
    });
    return components;
  }
  function getAllComponentsFromRegistry(registry) {
    const internalRegistry = getInternalRegistryData(registry);
    return Array.from(internalRegistry.data.components.values());
  }
  function addServiceToRegistry(registry, name, service) {
    const internalRegistry = getInternalRegistryData(registry);
    internalRegistry.data.services.set(name, service);
  }
  function getServiceFromRegistryById(registry, name) {
    var _a;
    const internalRegistry = getInternalRegistryData(registry);
    return (_a = internalRegistry.data.services.get(name)) !== null &&
      _a !== void 0
      ? _a
      : null;
  }
  function getServicesFromRegistryByIds(registry, ids) {
    const internalRegistry = getInternalRegistryData(registry);
    const services = [];
    ids.forEach((id) => {
      const service = internalRegistry.data.services.get(id);
      if (service) {
        services.push(service);
      }
    });
    return services;
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
          reconcileChildrenFn(actualChildEl, tempChildEl);
          TChildRegistry[childId] = tempChildEl;
        }
      }
      targetScope.innerHTML = "";
      reconcileChildrenFn(sourceScope, targetScope);
      for (const childId in TChildRegistry) {
        const actualChildEl = findByComponentId(targetScope, childId);
        if (actualChildEl === null) continue;
        const tempChildEl = TChildRegistry[childId];
        reconcileChildrenFn(tempChildEl, actualChildEl);
      }
    };
  }

  // out/services/stagingElement.js
  function createStagingElement(innerHtml) {
    const element2 = document.implementation.createHTMLDocument().body;
    Object.defineProperty(element2, "$plStgCS", {
      value: false,
      writable: true,
      enumerable: false,
      configurable: false,
    });
    if (innerHtml) {
      element2.innerHTML = innerHtml;
    }
    return element2;
  }
  function setStagingElementInnerHtml(stagingElement, html) {
    if (stagingElement.$plStgCS) {
      throw new PluncError("ERR1");
    }
    stagingElement.innerHTML = html;
  }
  function getStagingElementInnerHtml(stagingElement) {
    if (stagingElement.$plStgCS) {
      throw new PluncError("ERR2");
    }
    return stagingElement.innerHTML;
  }
  function commitStagingElementTo(stagingElement, targetElement) {
    if (stagingElement.$plStgCS) {
      throw new PluncError("ERR3");
    }
    while (stagingElement.firstChild) {
      targetElement.appendChild(stagingElement.firstChild);
    }
    stagingElement.$plStgCS = true;
  }

  // out/services/templateService.js
  function collectTemplateElementsInnerHtml(contextElement) {
    const templatesMap = /* @__PURE__ */ new Map();
    const templateElements = Array.from(
      contextElement.querySelectorAll("template"),
    );
    const pluncAttr = `${GLOBAL_DIRECTIVE_FOR_TEMPLATE_NAME}`;
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
  var createContainer = composePluncAppContainerFactory(
    createPluncAppInternalRepresentation,
    createNewComponentAndServiceRegistry,
    addComponentToRegistry,
    getComponentFromRegistryById,
    getComponentsFromRegistryByIds,
    getAllComponentsFromRegistry,
    addServiceToRegistry,
    getServiceFromRegistryById,
    getServicesFromRegistryByIds,
    createNewHandlerLibrary,
    addHandlerToLibrary,
    getServiceHandlerFromLibrary,
    getComponentHandlerFromLibrary,
    getFactoryHandlerFromLibrary,
    getHelperHandlerFromLibrary,
    createComponentLineage,
    addRecordToComponentLineage,
    lookupComponentLineage,
    whoAreTheChildrenOfComponent,
    whoIsTheParentOfComponent,
    whoAreTheSiblingsOfComponent,
    composePluncAttributeKeyFormatter,
    composePluncAttributeValueGetter,
    composePluncAttributeValueSetter,
    parseAliasNotation,
    composeComponentIdGenerator,
    selectElement,
    selectAllElements,
    composeComponentSelectorById,
    composeElementSelectorsWithPluncAttribute,
    composeElementLocker,
    composeIsElementLockedChecker,
    composeIsEventLockChecker,
    composeEventLocker,
    disposeElement,
    composeChildComponentCleaner,
    composeBlockElementSelector,
    createComponentInternalRepresentationFactory,
    composeComponentProxyFactory,
    resolvePluncExpression,
    createStagingElement,
    setStagingElementInnerHtml,
    getStagingElementInnerHtml,
    commitStagingElementTo,
  );
  var plunc = (window["plunc"] = {
    create: (applicationName, configuration = null) => {
      const instanceId = contexts.length + 1;
      const appContainer = createContainer(
        instanceId,
        applicationName,
        configuration,
      );
      contexts.push(appContainer);
      return {
        component: composeComponentBinder(appContainer),
        service: composeServiceBinder(appContainer),
        factory: composeFactoryBinder(appContainer),
        helper: composeHelperBinder(appContainer),
      };
    },
  });
  function shouldInit(appContainer) {
    return __async(this, null, function* () {
      return appContainer.__getAppRepresentationInstance().config.startFn();
    });
  }
  function bootstrap(contexts2) {
    return __async(this, null, function* () {
      if (contexts2.length === 0) return;
      const [appContainer, ...rest] = contexts2;
      if (!(yield shouldInit(appContainer))) return;
      const templatesMap = collectTemplateElementsInnerHtml(document.body);
      const appStagingElement = createStagingElement(
        templatesMap.get(appContainer.__getAppRepresentationInstance().name),
      );
      const componentIdGenerator = composeComponentIdGenerator(
        appContainer.__getAppRepresentationInstance(),
      );
      const referenceAttacher = composeReferenceAttacher(
        appContainer,
        selectAllElements,
      );
      const renderComponents = composeComponentRenderer(
        appContainer,
        templatesMap,
        selectAllElements,
        componentIdGenerator,
        referenceAttacher,
      );
      renderComponents(appStagingElement, "");
      const allComponentInternalRepresentation =
        appContainer.__getAllComponentsFromRegistry();
      for (const componentId in allComponentInternalRepresentation) {
        const componentInternalRepresentation =
          allComponentInternalRepresentation[componentId];
        const dependencyResolver = composeDependencyResolver(
          appContainer,
          listDependencies,
        );
        invokeComponentHandler(
          componentInternalRepresentation.name,
          componentInternalRepresentation,
          appContainer,
          listDependencies,
          dependencyResolver,
        );
      }
      for (const componentId in allComponentInternalRepresentation) {
        const componentInternalRepresentation =
          allComponentInternalRepresentation[componentId];
        const targetComponentElement = appContainer.__querySelectComponentById(
          appStagingElement,
          componentInternalRepresentation.id,
        );
        if (targetComponentElement === null) continue;
        const tempElement = document.implementation.createHTMLDocument().body;
        tempElement.innerHTML = targetComponentElement.innerHTML;
        const idsOfChildren = appContainer.__whoAreTheChildren(
          componentInternalRepresentation.id,
        );
        appContainer.__clearChildComponents(tempElement, idsOfChildren);
        const processDirectives = composeDirectivesProcessor(appContainer);
        processDirectives(
          tempElement,
          componentInternalRepresentation.scope,
          false,
        );
        const reconcileComponent = composeComponentReconciler(
          reconcileChildren,
          appContainer.__querySelectComponentById,
        );
        reconcileComponent(tempElement, targetComponentElement, idsOfChildren);
      }
      const appElement = selectLiveAppRootElement(
        appContainer.__getAppRepresentationInstance().name,
      );
      appElement.replaceChildren();
      appContainer.__commitStagingElementTo(appStagingElement, appElement);
      appContainer.__getAppRepresentationInstance().emitReady();
      const readyListeners = appContainer
        .__getAppRepresentationInstance()
        .getReadyListeners();
      for (let i2 = 0; i2 < readyListeners.length; i2++) {
        const listener = readyListeners[i2];
        listener();
      }
      bootstrap(rest);
    });
  }
  DOMHelper.ready(bootstrap.bind(null, contexts));
})();
//# sourceMappingURL=plunc.js.map
