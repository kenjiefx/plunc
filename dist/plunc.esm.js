// out/services/configuration.js
function o4(config) {
  var _a, _b, _c;
  const startFn = () => new Promise((resolve) => resolve(true));
  const endFn = () => new Promise((resolve) => resolve());
  return {
    prefix: (_a = config === null || config === void 0 ? void 0 : config.prefix) !== null && _a !== void 0 ? _a : "plunc-",
    startFn: (_b = config === null || config === void 0 ? void 0 : config.startFn) !== null && _b !== void 0 ? _b : startFn,
    endFn: (_c = config === null || config === void 0 ? void 0 : config.endFn) !== null && _c !== void 0 ? _c : endFn
  };
}

// out/container.js
function i2(createAppRepresentationInstance, createRegistryFn, addComponentToRegistryFn, getComponentByIdFromRegistryFn, getComponentsByIdFromRegistryFn, getAllComponentsFromRegistryFn, addServiceToRegistryFn, getServiceByIdFromRegistryFn, getServicesByIdFromRegistryFn, createLibraryFn, addToLibraryFn, getServiceHandlerFn, getComponentHandlerFn, getFactoryHandlerFn, getHelperHandlerFn, createLineageFn, addParentChildRecordFn, getComponentAncestorsFn, getComponentChildrenFn, getComponentParentFn, getComponentSiblingsFn, composePluncAttributeKeyFormatterFn, composePluncAttributeKeyGetterFn, composePluncAttributeKeySetterFn, aliasNotationParserFn, composeComponentIdGeneratorFn, selectElementFn, selectAllElementsFn, composeComponentSelectorByIdFn, composeElementSelectorsWithPluncAttributeFn, composeElementLockerFn, composeIsElementLockedCheckerFn, composeIsEventLockCheckerFn, composeEventLockerFn, disposeElementFn, composeChildComponentCleanerFn, composeBlockElementSelectorFn, createComponentInternalRepresentationFactoryFn, composeComponentProxyFactoryFn, pluncExpressionResolverFn, createStagingElementFn, setStagingElementInnerHtmlFn, getStagingElementInnerHtmlFn, commitStagingElementToFn) {
  return function i3(instanceId, applicationName, configuration = null) {
    const requiredConfiguration = o4(configuration);
    const registry = createRegistryFn();
    const library = createLibraryFn();
    const lineage = createLineageFn();
    const appRepresentation = createAppRepresentationInstance(instanceId, applicationName, requiredConfiguration, library, registry);
    const pluncAttributeKeyFormatter = composePluncAttributeKeyFormatterFn(requiredConfiguration);
    const pluncAttributeValueGetter = composePluncAttributeKeyGetterFn(pluncAttributeKeyFormatter);
    const pluncAttributeValueSetter = composePluncAttributeKeySetterFn(pluncAttributeKeyFormatter);
    const blockSelectorFactory = composeBlockElementSelectorFn(pluncAttributeKeyFormatter, selectAllElementsFn);
    const componentFactory = createComponentInternalRepresentationFactoryFn(aliasNotationParserFn);
    const n8 = composeComponentSelectorByIdFn(pluncAttributeKeyFormatter, selectElementFn);
    const componentProxyFactory = composeComponentProxyFactoryFn();
    return {
      c9: () => appRepresentation,
      f5: function(name, type, handler) {
        addToLibraryFn(library, name, type, handler);
      },
      f6: function(name) {
        return getServiceHandlerFn(library, name);
      },
      f7: function(name) {
        return getComponentHandlerFn(library, name);
      },
      f8: function(name) {
        return getFactoryHandlerFn(library, name);
      },
      f9: function(name) {
        return getHelperHandlerFn(library, name);
      },
      g0: function(id, component) {
        addComponentToRegistryFn(registry, id, component);
      },
      d7: function(id) {
        return getComponentByIdFromRegistryFn(registry, id);
      },
      g1: function(ids) {
        return getComponentsByIdFromRegistryFn(registry, ids);
      },
      f0: function() {
        return getAllComponentsFromRegistryFn(registry);
      },
      g2: function(name, service) {
        addServiceToRegistryFn(registry, name, service);
      },
      g3: function(name) {
        return getServiceByIdFromRegistryFn(registry, name);
      },
      g4: function(ids) {
        return getServicesByIdFromRegistryFn(registry, ids);
      },
      g5: function(parent, child) {
        addParentChildRecordFn(lineage, parent, child);
      },
      g6: function(child) {
        return getComponentAncestorsFn(lineage, child);
      },
      f1: function(parent) {
        return getComponentChildrenFn(lineage, parent);
      },
      d6: function(child) {
        return getComponentParentFn(lineage, child);
      },
      g7: function(child) {
        return getComponentSiblingsFn(lineage, child);
      },
      e4: pluncAttributeKeyFormatter,
      g8: pluncAttributeValueGetter,
      g9: pluncAttributeValueSetter,
      h0: aliasNotationParserFn,
      h1: composeComponentIdGeneratorFn(appRepresentation),
      h2: selectElementFn,
      e5: selectAllElementsFn,
      d3: n8,
      h3: composeElementSelectorsWithPluncAttributeFn(selectAllElementsFn, pluncAttributeKeyFormatter),
      h4: composeElementLockerFn(pluncAttributeKeyFormatter),
      h5: composeIsElementLockedCheckerFn(pluncAttributeKeyFormatter),
      h6: composeEventLockerFn(pluncAttributeKeyFormatter),
      h7: composeIsEventLockCheckerFn(pluncAttributeKeyFormatter),
      h8: disposeElementFn,
      f2: composeChildComponentCleanerFn(n8),
      d4: blockSelectorFactory,
      h9: componentFactory,
      d8: componentProxyFactory,
      i0: pluncExpressionResolverFn,
      e0: createStagingElementFn,
      e1: setStagingElementInnerHtmlFn,
      i1: getStagingElementInnerHtmlFn,
      e3: commitStagingElementToFn
    };
  };
}

// out/services/aliasNotation.js
function l9(name) {
  var _a;
  return {
    name: name.split(" as ")[0],
    alias: (_a = name.split(" as ")[1]) !== null && _a !== void 0 ? _a : null
  };
}

// out/services/pluncAttribute.js
var a2 = "plunc-app";
var a0 = "plunc-name";
var a7 = "plunc-set";
var a1 = "true";
var a4 = "plunc-event";
var a5 = "[PREFIX]component";
var b4 = "[PREFIX]cid";
var a8 = "[PREFIX]repeat";
var c3 = "[PREFIX]if";
var a9 = "[PREFIX]check";
var b0 = "[PREFIX]style";
var b1 = "[PREFIX]model";
var a6 = "[PREFIX]disable";
var c0 = "[PREFIX]click";
var b7 = "[PREFIX]change";
var c1 = "[PREFIX]touch";
var b2 = "[PREFIX]block";
var a3 = "[PREFIX]rid";
var c5 = "$scope";
var c6 = "$block";
var c4 = "$parent";
var c7 = "$patch";
var c8 = "$app";
var b8 = "$this";
var b9 = "$$index";
function w2(config) {
  const prefix = config.prefix;
  return function w3(key) {
    return key.replace("[PREFIX]", prefix);
  };
}

// out/services/blockService.js
function m0(name, componentInternalRepresentation, pluncAttributeKeyFormatter) {
  const blockAttributeKey = pluncAttributeKeyFormatter(b2);
  const referenceAttributeKey = pluncAttributeKeyFormatter(a3);
  return `[${blockAttributeKey}="${name}"][${referenceAttributeKey}="${componentInternalRepresentation.id}"]`;
}
function m1(pluncAttributeKeyFormatter, querySelectAllElements) {
  return function m2(blockName, componentInternalRepresentation) {
    const blockSelector = m0(blockName, componentInternalRepresentation, pluncAttributeKeyFormatter);
    return function m3(context) {
      return querySelectAllElements(context, blockSelector);
    };
  };
}

// out/services/componentProxy.js
function m5() {
  return function m6(wrapper) {
    const handler = {
      get: function get(target, name) {
        for (const id in target) {
          const component = target[id];
          const exposed = component.m4();
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
function m9(aliasParser) {
  return function h9(id, nameThatMayHaveAlias) {
    const { name, alias } = aliasParser(nameThatMayHaveAlias);
    let proxy = null;
    let template = `<!-- Component ${id} Template -->`;
    const scope = {};
    function m7(p) {
      proxy = p;
    }
    function m4() {
      return proxy;
    }
    function m8(t) {
      template = t;
    }
    function e2() {
      return template;
    }
    return {
      id,
      name,
      alias,
      scope,
      m7,
      m4,
      m8,
      e2
    };
  };
}
function n2(pluncApp) {
  return function h1(childIteration, parentComponentId) {
    if (parentComponentId !== "") {
      return `${parentComponentId}.${childIteration.toString()}`;
    }
    return `${pluncApp.id.toString()}.${childIteration.toString()}`;
  };
}
function n3(appCtx, templatesMap, elementsSelector, h1, attachReferenceToNamedElementsFn) {
  function n4(componentWrapperElement, componentId, parentComponentId) {
    const componentName = n9(appCtx, componentWrapperElement);
    appCtx.g9(componentWrapperElement, b4, componentId);
    appCtx.g5(parentComponentId, componentId);
    const componentAlias = o0(appCtx, componentWrapperElement);
    const componentInternalRepresentation = o3(componentId, componentName, componentAlias, appCtx);
    o2(appCtx, componentInternalRepresentation);
    appCtx.g0(componentId, componentInternalRepresentation);
    const componentTemplate = templatesMap.get(componentName);
    if (componentTemplate === void 0) {
      throw new Error(`Template not found for component: ${componentName}`);
    }
    componentWrapperElement.innerHTML = componentTemplate;
    attachReferenceToNamedElementsFn(componentId, componentWrapperElement);
    n5(componentWrapperElement, componentId);
    componentInternalRepresentation.m8(componentWrapperElement.innerHTML);
  }
  function n5(parentElement, parentComponentId) {
    const componentWrapperElements = n6(parentElement, appCtx, elementsSelector);
    let componentIterator = 0;
    componentWrapperElements.forEach((componentWrapperElement) => {
      const componentId = h1(componentIterator, parentComponentId);
      componentIterator++;
      n4(componentWrapperElement, componentId, parentComponentId);
    });
  }
  return n5;
}
function n6(target, appCtx, elementsSelector) {
  const componentAttributeKey = appCtx.e4(a5);
  return elementsSelector(target, `[${componentAttributeKey}]`);
}
function n7(pluncAttributeKeyFormatter, elementSelector) {
  return function n8(selectContext, componentId) {
    const attributeKey = pluncAttributeKeyFormatter(b4);
    const selector = `[${attributeKey}="${componentId}"]`;
    return elementSelector(selectContext, selector);
  };
}
function n9(appCtx, componentElement) {
  const componentNameThatMayHaveAlias = o1(appCtx, componentElement);
  return appCtx.h0(componentNameThatMayHaveAlias).name;
}
function o0(appCtx, componentElement) {
  const componentNameThatMayHaveAlias = o1(appCtx, componentElement);
  return appCtx.h0(componentNameThatMayHaveAlias).alias;
}
function o1(appCtx, componentElement) {
  const componentNameThatMayHaveAlias = appCtx.g8(componentElement, a5);
  if (!componentNameThatMayHaveAlias) {
    throw new Error(`Component element is missing the ${a5} attribute.`);
  }
  return componentNameThatMayHaveAlias;
}
function o2(appCtx, componentInternalRepresentation) {
  const name = componentInternalRepresentation.name;
  const idsOfParents = appCtx.g6(componentInternalRepresentation.id);
  const parentNames = appCtx.g1(idsOfParents);
  parentNames.forEach((parent) => {
    if (parent && "name" in parent && parent.name === name) {
      throw new Error(`Circular dependency detected for component: ${name}`);
    }
  });
}
function o3(componentId, name, alias, appCtx) {
  const existingComponent = appCtx.d7(componentId);
  if (existingComponent !== null) {
    return existingComponent;
  }
  return appCtx.h9(componentId, alias ? `${name}:${alias}` : name);
}

// out/directives/check.js
function i4(appCtx) {
  return function i5(elementCtx, dataCtx2) {
    const elementsToProcess = appCtx.h3(elementCtx, a9);
    elementsToProcess.forEach((element2) => {
      if (appCtx.h5(element2)) {
        return;
      }
      const checkExpression = appCtx.g8(element2, a9);
      if (checkExpression === null || checkExpression.trim() === "") {
        return;
      }
      const evaluatedResult = appCtx.i0(dataCtx2, checkExpression);
      if (typeof evaluatedResult === "boolean") {
        evaluatedResult ? element2.setAttribute("checked", "true") : element2.removeAttribute("checked");
      }
      appCtx.h4(element2);
    });
  };
}

// out/directives/conditionals.js
function i6(appCtx) {
  return function i7(elementCtx, dataCtx2) {
    const elementsToProcess = appCtx.h3(elementCtx, c3);
    elementsToProcess.forEach((element2) => {
      if (appCtx.h5(element2)) {
        return;
      }
      const conditionExpression = appCtx.g8(element2, c3);
      if (conditionExpression === null || conditionExpression.trim() === "") {
        return;
      }
      const evaluationResult = appCtx.i0(dataCtx2, conditionExpression);
      if (typeof evaluationResult === "boolean" && evaluationResult === false) {
        appCtx.h8(element2, `condition evaluated to false`);
      }
      appCtx.h4(element2);
    });
  };
}

// out/directives/disable.js
function i8(appCtx) {
  return function i9(elementCtx, dataCtx2) {
    const elementsToProcess = appCtx.h3(elementCtx, a6);
    elementsToProcess.forEach((element2) => {
      if (appCtx.h5(element2)) {
        return;
      }
      const disableExpression = appCtx.g8(element2, a6);
      if (disableExpression === null || disableExpression.trim() === "") {
        return;
      }
      const evaluatedResult = appCtx.i0(dataCtx2, disableExpression);
      if (typeof evaluatedResult === "boolean") {
        evaluatedResult ? element2.setAttribute("disabled", "true") : element2.removeAttribute("disabled");
      }
      appCtx.h4(element2);
    });
  };
}

// out/services/expressionResolver.js
function p9(dataCtx2, expression2, element2 = null) {
  const resolveType2 = q0(expression2);
  return q1(dataCtx2, expression2, resolveType2, element2);
}
function q0(expression2) {
  if (/^'.*'$/.test(expression2))
    return "S";
  if (!isNaN(expression2))
    return "N";
  if (expression2.includes("(") && expression2.includes("=="))
    return "C";
  if (expression2.includes("(") && expression2.includes("is "))
    return "C";
  if (expression2.includes("(") && expression2.includes(">"))
    return "C";
  if (expression2.includes("(") && expression2.includes("<"))
    return "C";
  if (expression2.includes("("))
    return "F";
  if (expression2.includes("=="))
    return "C";
  if (expression2.includes("is "))
    return "C";
  if (expression2.includes(">"))
    return "C";
  if (expression2.includes("<"))
    return "C";
  if (expression2.includes("+") || expression2.includes("-") || expression2.includes("/") || expression2.includes("*") || expression2.includes("%")) {
    return "OP";
  }
  if (expression2 == "false" || expression2 == "true" || expression2 == "null") {
    return "B";
  }
  return "OB";
}
function q1(dataCtx, expression, resolveType, element = null) {
  switch (resolveType) {
    case "S":
      return expression.slice(1, -1);
      break;
    case "B":
      if (expression == "true")
        return true;
      if (expression == "false")
        return false;
      if (expression == "null")
        return null;
      break;
    case "OB":
      return q2(dataCtx, expression);
      break;
    case "F":
      let structure = expression.split("(");
      let expressionTest = structure[0].split(".");
      if (expressionTest.length > 1) {
        let refObject = p9(dataCtx, q4(structure[0]));
        let funcExpression = expression.split(".").slice(expressionTest.length - 1).join(".");
        return q3(refObject, dataCtx, funcExpression, element);
      }
      if (!Object.prototype.hasOwnProperty.call(dataCtx, structure[0])) {
        return "";
      }
      return q3(dataCtx, dataCtx, expression, element);
      break;
    case "C":
      const evaluatorMap = {
        "!==": q8,
        "==": q7,
        "is not ": q8,
        "is ": q7,
        ">=": r0,
        ">": q9,
        "<=": r2,
        "<": r1
      };
      for (const comparator in evaluatorMap) {
        if (expression.includes(comparator)) {
          return evaluatorMap[comparator](dataCtx, expression, comparator);
        }
      }
      return false;
      break;
    case "N":
      return Number(expression);
      break;
    case "OP":
      let finalExpression = expression;
      let operations = ["+", "-", "*", "/", "%"];
      for (var i = 0; i < operations.length; i++) {
        if (expression.includes(operations[i])) {
          let exp = expression.split(operations[i]);
          let left = p9(dataCtx, exp[0].trim());
          var right = p9(dataCtx, exp[1].trim());
          finalExpression = left + operations[i] + right;
        }
      }
      return eval(finalExpression);
      break;
    default:
      break;
  }
}
function q2(dataCtx2, expression2) {
  if (expression2 === "$dataCtx") {
    return dataCtx2;
  }
  return expression2.split(".").reduce(function(o, x) {
    if (o === void 0)
      return;
    if (o === null)
      return;
    if (o[x] === void 0)
      return;
    return o[x];
  }, dataCtx2);
}
function q3(dataCtx2, object, expression2, element2) {
  if (dataCtx2 === void 0)
    return "";
  const splitExpression = expression2.match(/\(([^)]+)\)/);
  let struct = expression2.split("(");
  let name = struct[0];
  if (splitExpression !== null) {
    const argsVault = new Array();
    const splitArguments = splitExpression[1].split(",");
    for (let i3 = 0; i3 < splitArguments.length; i3++) {
      argsVault.push(p9(object, splitArguments[i3].trim()));
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
function q4(expression2) {
  let pieces = expression2.split(".");
  if (pieces.length < 2)
    return "$dataCtx";
  pieces.pop();
  return pieces.join(".");
}
function q5(base, expression2) {
  const parentObjExp = q4(expression2);
  return p9(base, parentObjExp);
}
function q6(expression2) {
  let pieces = expression2.split(".");
  return pieces[pieces.length - 1];
}
function q7(dataCtx2, expression2, comparator) {
  const [left, right2] = expression2.split(comparator).map((arm) => {
    return p9(dataCtx2, arm.trim());
  });
  return left === right2;
}
function q8(dataCtx2, expression2, comparator) {
  const [left, right2] = expression2.split(comparator).map((arm) => {
    return p9(dataCtx2, arm.trim());
  });
  return left !== right2;
}
function q9(dataCtx2, expression2, comparator) {
  const [left, right2] = expression2.split(comparator).map((arm) => {
    return p9(dataCtx2, arm.trim());
  });
  return left > right2;
}
function r0(dataCtx2, expression2, comparator) {
  const [left, right2] = expression2.split(comparator).map((arm) => {
    return p9(dataCtx2, arm.trim());
  });
  return left >= right2;
}
function r1(dataCtx2, expression2, comparator) {
  const [left, right2] = expression2.split(comparator).map((arm) => {
    return p9(dataCtx2, arm.trim());
  });
  return left < right2;
}
function r2(dataCtx2, expression2, comparator) {
  const [left, right2] = expression2.split(comparator).map((arm) => {
    return p9(dataCtx2, arm.trim());
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
    this.$element = element2;
    this.state = null;
    this.w5(pcount !== null && pcount !== void 0 ? pcount : 1);
  }
  /** Wraps the parent element within `PluncElement` object */
  w5(count) {
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
    for (var i3 = 0; i3 < classes.length; i3++) {
      let aclass = classes[i3];
      aclass === className ? this.removeClass(className) : this.addClass(className);
    }
  }
};

// out/directives/events.js
function j0(dataCtx2, bindToElement, fnExpression, eventType) {
  if (q0(fnExpression) !== "F")
    return;
  bindToElement.addEventListener(eventType, () => {
    const pluncElement = new PluncElement(bindToElement);
    p9(dataCtx2, fnExpression, pluncElement);
  });
}
function j1(appCtx) {
  return function j2(elementCtx, dataCtx2) {
    const events = [
      { t: "click", a: c0 },
      { t: "change", a: b7 },
      { t: "keyup", a: c1 }
    ];
    events.forEach((event) => {
      const elementsToProcess = appCtx.h3(elementCtx, event.a);
      elementsToProcess.forEach((element2) => {
        if (appCtx.h7(element2, event.t)) {
          return;
        }
        const fnExpression = appCtx.g8(element2, event.a);
        if (fnExpression === null || fnExpression.trim() === "") {
          return;
        }
        j0(dataCtx2, element2, fnExpression, event.t);
        appCtx.h6(element2, event.t);
      });
    });
  };
}

// out/directives/model.js
function j3(date) {
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
function j4(time) {
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
function j5(dataCtx2, expression2, value) {
  const parentObj = q5(dataCtx2, expression2);
  const childObjExpression = q6(expression2);
  if (void 0 !== parentObj)
    parentObj[childObjExpression] = value;
}
function j6(element2, state) {
  typeof state == "boolean" && state ? element2.setAttribute("checked", "") : element2.removeAttribute("checked");
}
function j7() {
  const date = new Date(Date.now());
  const nmonth = date.getMonth() + 1;
  const month = nmonth < 10 ? `0${nmonth}` : nmonth;
  const result = `${date.getFullYear()}-${month}-${date.getDate()}`;
  j3(result);
  return result;
}
function j8() {
  const input = new Date(Date.now());
  const hours = input.getHours() < 10 ? `0${input.getHours()}` : input.getHours();
  const minutes = input.getMinutes() < 10 ? `0${input.getMinutes()}` : input.getMinutes();
  const result = hours + ":" + minutes;
  j4(result);
  return result;
}
function j9(value) {
  if (value === null || value === void 0) {
    return "";
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
function k0(maybeRadioOrCheckboxElement, dataCtx2, expression2, expressionValue) {
  const elementType = maybeRadioOrCheckboxElement.type.toLowerCase();
  if (elementType !== "radio" && elementType !== "checkbox") {
    return;
  }
  const radioOrCheckboxElement = maybeRadioOrCheckboxElement;
  if (expressionValue === void 0) {
    j5(dataCtx2, expression2, false);
    j6(radioOrCheckboxElement, false);
  } else if (typeof expressionValue === "boolean") {
    j6(radioOrCheckboxElement, expressionValue);
  } else {
    console.warn(`Model directive assigned to checkbox/radio input elements must be of boolean type.`);
  }
}
function k1(maybeInputElement, dataCtx2, expression2, expressionValue) {
  const elementType = maybeInputElement.type.toLowerCase();
  if (elementType === "text" || elementType === "email" || elementType === "password" || elementType === "search" || elementType === "url" || elementType === "tel") {
    const inputElement = maybeInputElement;
    if (expressionValue === void 0) {
      j5(dataCtx2, expression2, inputElement.value);
    } else {
      inputElement.value = j9(expressionValue);
    }
  }
}
function k2(maybeInputNumberElement, dataCtx2, expression2, expressionValue) {
  const elementType = maybeInputNumberElement.type.toLowerCase();
  if (elementType === "number") {
    const inputElement = maybeInputNumberElement;
    if (expressionValue === void 0) {
      j5(dataCtx2, expression2, 0);
      inputElement.value = "0";
    } else {
      inputElement.value = j9(expressionValue);
    }
  }
}
function k3(targetELement, dataCtx2, expression2, expressionValue) {
  return function k4(handler) {
    handler(targetELement, dataCtx2, expression2, expressionValue);
  };
}
function k5(maybeDateInputElement, dataCtx2, expression2, expressionValue) {
  const elementType = maybeDateInputElement.type.toLowerCase();
  if (elementType === "date") {
    const dateInputElement = maybeDateInputElement;
    if (expressionValue === void 0) {
      const currentDate = j7();
      j5(dataCtx2, expression2, currentDate);
      dateInputElement.value = currentDate;
    } else {
      const stringifiedValue = j9(expressionValue);
      j3(stringifiedValue);
      dateInputElement.value = stringifiedValue;
    }
  }
}
function k6(maybeTimeInputElement, dataCtx2, expression2, expressionValue) {
  const elementType = maybeTimeInputElement.type.toLowerCase();
  if (elementType === "time") {
    const timeInputElement = maybeTimeInputElement;
    if (expressionValue === void 0) {
      const currentTime = j8();
      j5(dataCtx2, expression2, currentTime);
      timeInputElement.value = currentTime;
    } else {
      const stringifiedValue = j9(expressionValue);
      j4(stringifiedValue);
      timeInputElement.value = stringifiedValue;
    }
  }
}
function k7(appCtx) {
  return function k8(elementCtx, dataCtx2) {
    const elementsToProcess = appCtx.h3(elementCtx, b1);
    elementsToProcess.forEach((element2) => {
      const modelExpression = appCtx.g8(element2, b1);
      if (modelExpression === null || modelExpression.trim() === "") {
        return;
      }
      if (appCtx.h5(element2)) {
        return;
      }
      let evaluationResult = appCtx.i0(dataCtx2, modelExpression);
      if (element2.tagName === "INPUT" || element2.tagName === "SELECT") {
        if (element2 instanceof HTMLInputElement) {
          const execute = k3(element2, dataCtx2, modelExpression, evaluationResult);
          execute(k0);
          execute(k1);
          execute(k2);
          execute(k5);
          execute(k6);
        }
        if (element2 instanceof HTMLSelectElement) {
          evaluationResult === void 0 ? j5(dataCtx2, modelExpression, element2.value) : element2.value = j9(evaluationResult);
        }
        element2.addEventListener("change", (event) => {
          const target = event.target;
          if (target instanceof HTMLInputElement) {
            const targetType = target.type.toLowerCase();
            if (targetType === "radio" || targetType === "checkbox") {
              const isChecked = target.checked;
              j5(dataCtx2, modelExpression, isChecked);
              return;
            }
            j5(dataCtx2, modelExpression, target.value);
          }
          if (target instanceof HTMLSelectElement) {
            j5(dataCtx2, modelExpression, target.value);
          }
        });
      } else if (element2.tagName === "TEXTAREA" && element2 instanceof HTMLTextAreaElement) {
        evaluationResult === void 0 ? j5(dataCtx2, modelExpression, element2.value) : element2.value = j9(evaluationResult);
        element2.addEventListener("change", (event) => {
          const target = event.target;
          if (!(target instanceof HTMLTextAreaElement))
            return;
          const value = target.value;
          j5(dataCtx2, modelExpression, value);
        });
      }
      appCtx.h4(element2);
    });
  };
}

// out/directives/placeholders.js
function k9(appCtx) {
  return function l0(elementCtx, dataCtx2) {
    const regEx = /(?<=\{{).+?(?=\}})/g;
    const htmlContent = elementCtx.innerHTML;
    const matchedPlaceholders = htmlContent.match(regEx);
    if (matchedPlaceholders === null) {
      return;
    }
    matchedPlaceholders.forEach((placeholder) => {
      const expression2 = placeholder.trim();
      let evaluationResult = appCtx.i0(dataCtx2, expression2);
      if (evaluationResult === null || evaluationResult === void 0) {
        evaluationResult = "";
      }
      const placeholderTag = `{{${placeholder}}}`;
      elementCtx.innerHTML = elementCtx.innerHTML.replace(placeholderTag, String(evaluationResult));
    });
  };
}

// out/directives/repeat.js
function l1(expression2) {
  if (expression2.includes("until ")) {
    return [b9, expression2.split("until")[1].trim()];
  }
  return [
    expression2.split(" as ")[0].trim(),
    expression2.split(" as ")[1].trim()
  ];
}
function l2(repetitions) {
  if (repetitions instanceof Array)
    return repetitions.length;
  if (typeof repetitions === "number" && Number.isInteger(repetitions))
    return repetitions;
  throw new Error(`Repeatable elements must have repeatable values`);
}
function l3(value) {
  return value !== null && (typeof value === "object" || Array.isArray(value));
}
function l4(appCtx) {
  let processDirectivesOnRepeatedElementFn = () => {
  };
  function l5(repeatableElementCtx, dataCtx2) {
    const scope = Object.assign({}, dataCtx2);
    const template = repeatableElementCtx.innerHTML;
    repeatableElementCtx.replaceChildren();
    let repeatExpression = appCtx.g8(repeatableElementCtx, a8);
    if (repeatExpression === null || repeatExpression.trim() === "") {
      return;
    }
    let [dataSourceExpr, itemAlias] = l1(repeatExpression);
    if (dataSourceExpr === b9) {
      const repetitions = appCtx.i0(scope, itemAlias);
      let times = l2(repetitions);
      scope["$$index"] = {};
      let k = 0;
      while (k < times)
        scope["$$index"]["props" + k++] = new Object();
    }
    const repeatableObject = appCtx.i0(scope, dataSourceExpr);
    if (!l3(repeatableObject)) {
      return;
    }
    let indexNumber = 0;
    for (const [key, value] of Object.entries(repeatableObject)) {
      const repeatDataCtx = {
        $parent: dataCtx2,
        $index: indexNumber,
        [itemAlias]: value
      };
      const repeatedElementCtx = appCtx.e0(template);
      processDirectivesOnRepeatedElementFn(repeatedElementCtx, repeatDataCtx);
      appCtx.e3(repeatedElementCtx, repeatableElementCtx);
      indexNumber++;
    }
  }
  return function l6(elementCtx, dataCtx2, processDirectivesOnRepeatedElement) {
    const repeatElements = appCtx.h3(elementCtx, a8);
    processDirectivesOnRepeatedElementFn = processDirectivesOnRepeatedElement;
    for (const repeatElement of repeatElements) {
      l5(repeatElement, dataCtx2);
    }
  };
}

// out/directives/style.js
function l7(appCtx) {
  return function l8(elementCtx, dataCtx2) {
    const elementsToProcess = appCtx.h3(elementCtx, b0);
    elementsToProcess.forEach((element2) => {
      if (appCtx.h5(element2)) {
        return;
      }
      const styleExpression = appCtx.g8(element2, b0);
      if (styleExpression === null || styleExpression.trim() === "") {
        return;
      }
      const evaluatedResult = appCtx.i0(dataCtx2, styleExpression);
      if (typeof evaluatedResult === "string" && evaluatedResult.trim() !== "") {
        const classNames = evaluatedResult.split(" ").map((cn) => cn.trim());
        classNames.forEach((cn) => {
          if (cn !== "") {
            element2.classList.add(cn);
          }
        });
      }
      appCtx.h4(element2);
    });
  };
}

// out/services/directivesProcessor.js
function o5(appCtx) {
  const processRepeat = l4(appCtx);
  const processCheck = i4(appCtx);
  const processConditionals = i6(appCtx);
  const processDisable = i8(appCtx);
  const processEvents = j1(appCtx);
  const processModels = k7(appCtx);
  const l0 = k9(appCtx);
  const processStyles = l7(appCtx);
  function o6(targetElement, dataCtx2, skipEventProcessing = true) {
    processRepeat(targetElement, dataCtx2, o6);
    processConditionals(targetElement, dataCtx2);
    l0(targetElement, dataCtx2);
    processCheck(targetElement, dataCtx2);
    processStyles(targetElement, dataCtx2);
    processModels(targetElement, dataCtx2);
    processDisable(targetElement, dataCtx2);
    if (skipEventProcessing === false) {
      processEvents(targetElement, dataCtx2);
    }
  }
  return o6;
}

// out/services/disposeService.js
function o7(element2, comment) {
  if (null !== element2) {
    element2.innerHTML = "";
    if (element2.parentNode !== null) {
      element2.outerHTML = "<!-- plunc.js: " + element2.outerHTML + " | " + comment + " -->";
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
      for (var i3 = 0; i3 < document.styleSheets.length; i3++)
        if (document.styleSheets[i3].disabled) {
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
        for (var i3 = 0; i3 < links.length; i3++) {
          if (links[i3].getAttribute("rel") == "stylesheet") {
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

// out/services/elementService.js
function o8(context, selector) {
  return context.querySelector(selector);
}
function o9(context, selector) {
  return Array.from(context.querySelectorAll(selector));
}
function p0(selectAllElementFn, formatPluncAttributeFn) {
  return function p1(context, pluncAttributeKey, pluncAttributeValue) {
    const attributeKey = formatPluncAttributeFn(pluncAttributeKey);
    const valuePart = pluncAttributeValue ? `="${pluncAttributeValue}"` : "";
    const selector = `[${attributeKey}${valuePart}]`;
    return selectAllElementFn(context, selector);
  };
}
function p2(formatPluncAttributeFn) {
  return function p3(element2, key) {
    const attributeKey = formatPluncAttributeFn(key);
    return element2.getAttribute(attributeKey);
  };
}
function p4(formatPluncAttributeFn) {
  return function p5(element2, key, value) {
    const attributeKey = formatPluncAttributeFn(key);
    element2.setAttribute(attributeKey, value);
  };
}
function p6(selectElementByComponentId) {
  return function p7(component, childIds) {
    for (let i3 = 0; i3 < childIds.length; i3++) {
      const childId = childIds[i3];
      const child = selectElementByComponentId(component, childId);
      if (child !== null)
        child.innerHTML = "";
    }
  };
}
function p8(appName) {
  const appRootAttributeKey = `${a2}`;
  const selector = `[${appRootAttributeKey}="${appName}"]`;
  const element2 = document.querySelector(selector);
  if (!element2) {
    throw new Error(`Cannot find the app root element for app: ${appName}`);
  }
  return element2;
}

// out/services/handlerBinder.js
function r3(appContext) {
  return function r4(name, handler) {
    appContext.f5(name, "component", handler);
  };
}
function r5(appContext) {
  return function r6(name, handler) {
    appContext.f5(name, "service", handler);
  };
}
function r7(appContext) {
  return function r8(name, handler) {
    appContext.f5(name, "factory", handler);
  };
}
function r9(appContext) {
  return function s0(name, handler) {
    appContext.f5(name, "helper", handler);
  };
}

// out/apis/$app.js
function d1(appCtx) {
  return {
    ready: (listener) => {
      appCtx.c9().d0(listener);
    }
  };
}

// out/errors/pluncError.js
var PluncError = class extends Error {
  constructor(message) {
    const processedMessage = `Plunc: An error has occured! Please see https://kenjiefx.github.io/plunc/errors/${message}.html for more details.`;
    super(processedMessage);
    Object.setPrototypeOf(this, Error.prototype);
  }
};

// out/apis/$block.js
function d5(appCtx, componentObject) {
  return function $block(name, callback) {
    if (!appCtx.c9().d2()) {
      throw new PluncError("ERR8");
    }
    const liveComponentElement = appCtx.d3(
      // Components are id'd uniquely accross different app instances,
      // so it's safe to query the document body directly.
      document.body,
      componentObject.id
    );
    if (!liveComponentElement) {
      throw new PluncError("ERR9");
    }
    const selectAllBlockElements = appCtx.d4(name, componentObject);
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
function d9(appCtx, componentObject) {
  return function $parent() {
    const parentId = appCtx.d6(componentObject.id);
    if (parentId === null)
      return null;
    const parentComponentObject = appCtx.d7(parentId);
    if (!parentComponentObject)
      return null;
    const wrapper = {};
    wrapper[parentId] = parentComponentObject;
    return appCtx.d8(wrapper);
  };
}

// out/apis/$patch.js
function e6(appCtx, componentObject) {
  return async function $patch(blockName = null) {
    if (!appCtx.c9().d2()) {
      throw new PluncError("ERR10");
    }
    const liveComponentElement = appCtx.d3(
      // Components are id'd uniquely accross different app instances,
      // so it's safe to query the document body directly.
      document.body,
      componentObject.id
    );
    if (!liveComponentElement) {
      throw new PluncError("ERR9");
    }
    const { targetType, patchTargetNodes } = e7(blockName, liveComponentElement, componentObject, appCtx);
    for (const patchTargetNode of patchTargetNodes) {
      const elementBindTo = patchTargetNode;
      if (elementBindTo === null)
        continue;
      let elementBindFrom = appCtx.e0();
      if (targetType === "COMPONENT") {
        appCtx.e1(elementBindFrom, componentObject.e2());
      } else {
        if (blockName === null)
          continue;
        const blockTemplate = e8(appCtx, componentObject, blockName);
        appCtx.e1(elementBindFrom, blockTemplate);
      }
      const o6 = o5(appCtx);
      o6(elementBindFrom, componentObject.scope, false);
      elementBindTo.innerHTML = "";
      appCtx.e3(elementBindFrom, elementBindTo);
    }
  };
}
function e7(blockName, liveComponentElement, componentObject, appCtx) {
  if (blockName !== null) {
    const selectAllBlockElements = appCtx.d4(blockName, componentObject);
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
function e8(appCtx, componentObject, blockName) {
  const stagingElement = appCtx.e0(componentObject.e2());
  const blockDirective = appCtx.e4(b2);
  const referenceDirective = appCtx.e4(a3);
  const specificBlockSelector = `[${blockDirective}="${blockName}"][${referenceDirective}="${componentObject.id}"]`;
  const blockElement = appCtx.e5(stagingElement, specificBlockSelector);
  if (blockElement.length === 0) {
    throw new PluncError("ERR11");
  }
  return blockElement[0].innerHTML;
}

// out/apis/$this.js
function e9(appCtx, componentObject) {
  return function $this() {
    return {
      id: componentObject.id,
      name: componentObject.name,
      alias: componentObject.alias,
      element: () => {
        if (!appCtx.c9().d2()) {
          throw new PluncError("ERR12");
        }
        const elementNode = appCtx.d3(
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
function s1(handler) {
  const handlerStr = handler.toString().split("{")[0];
  if (handlerStr.charAt(0) !== "(") {
    const param = handlerStr.split("=>")[0];
    if (param === handlerStr) {
      return [];
    }
    return [param.trim()];
  }
  const matchedFn = handlerStr.match(/(?<=\().+?(?=\))/g);
  if (matchedFn === null || /[(={})]/g.test(matchedFn[0])) {
    return [];
  }
  return matchedFn[0].split(",").map((item) => {
    return item.trim();
  });
}
function s2(appCtx, listDependenciesFn) {
  return function s3(param) {
    const injectables = [];
    param.dependencies.forEach((dependencyKey) => {
      if (s4(dependencyKey)) {
        injectables.push(s9(param));
        return;
      }
      if (s5(dependencyKey)) {
        injectables.push(t0(dependencyKey, param, appCtx));
        return;
      }
      if (s6(appCtx, dependencyKey)) {
        const serviceObject = t8(dependencyKey, appCtx, listDependenciesFn, s3);
        injectables.push(serviceObject);
        return;
      }
      if (s7(appCtx, dependencyKey)) {
        const factory = t7(dependencyKey, appCtx, listDependenciesFn, s3);
        injectables.push(factory);
        return;
      }
      if (s8(appCtx, dependencyKey)) {
        if (param.type === "component" || param.type === "helper") {
          const helper = t9(dependencyKey, appCtx, listDependenciesFn, s3, param.component);
          injectables.push(helper);
          return;
        } else {
          throw new Error(`Helper dependency "${dependencyKey}" can only be injected into components or helpers`);
        }
      }
      if (param.type === "component") {
        const componentProxy = t3(dependencyKey, param.component, appCtx);
        injectables.push(componentProxy);
        return;
      }
      console.warn(`Unresolved dependency: "${dependencyKey}"`);
      injectables.push(null);
    });
    return injectables;
  };
}
function s4(value) {
  return value === c5;
}
function s5(value) {
  return value.startsWith("$");
}
function s6(appCtx, value) {
  const service = appCtx.f6(value);
  return service !== null;
}
function s7(appCtx, value) {
  const factory = appCtx.f8(value);
  return factory !== null;
}
function s8(appCtx, value) {
  const helper = appCtx.f9(value);
  return helper !== null;
}
function s9(param) {
  if (param.type === "component" || param.type === "helper") {
    return param.component.scope;
  }
  return null;
}
function t0(dependencyKey, param, appCtx) {
  if (param.type === "service" || param.type === "factory") {
    return {};
  }
  switch (dependencyKey) {
    case c6:
      return d5(appCtx, param.component);
    case c7:
      return e6(appCtx, param.component);
    case c4:
      return d9(appCtx, param.component);
    case c8:
      return d1(appCtx);
    case b8:
      return e9(appCtx, param.component);
    default:
      return {};
  }
}
function t1(component, dependencyKey, appCtx, options) {
  const parentNames = t2(appCtx, component.id, options);
  if (parentNames.has(dependencyKey)) {
    throw new Error(`Circular dependency detected: Component "${component.name}" cannot depend on its parent "${dependencyKey}".`);
  }
}
function t2(appCtx, componentId, options) {
  const parentNames = /* @__PURE__ */ new Set();
  const parentId = appCtx.d6(componentId);
  if (parentId !== null) {
    const parent = appCtx.d7(parentId);
    if (parent !== null) {
      if (options.tryAlias) {
        if (parent.alias !== null) {
          parentNames.add(parent.alias);
        }
      } else {
        parentNames.add(parent.name);
      }
      const grandparents = t2(appCtx, parentId, options);
      grandparents.forEach((name) => parentNames.add(name));
    }
  }
  return parentNames;
}
function t3(dependencyKey, component, appCtx) {
  function execute({ withAlias }) {
    t1(component, dependencyKey, appCtx, {
      tryAlias: withAlias
    });
    let componentProxy2 = t4(dependencyKey, component, appCtx, { matchUsingAlias: withAlias });
    return componentProxy2;
  }
  const componentProxy = execute({ withAlias: false });
  if (componentProxy !== null) {
    return componentProxy;
  }
  return execute({ withAlias: true });
}
function t4(dependencyKey, component, appCtx, options) {
  if (component.name === dependencyKey) {
    throw new Error(`Circular dependency detected: Component "${component.name}" cannot depend on itself.`);
  }
  const matchedChildren = t5(component, dependencyKey, appCtx, options);
  if (matchedChildren.length > 0) {
    const wrapper = {};
    for (let i3 = 0; i3 < matchedChildren.length; i3++) {
      const child = matchedChildren[i3];
      const proxy = t6(child.name, child, appCtx, s1, s2(appCtx, s1));
      wrapper[child.id] = child;
    }
    return appCtx.d8(wrapper);
  }
  return null;
}
function t5(parent, name, appCtx, options) {
  const childrenIds = appCtx.f1(parent.id);
  const matchedChildren = [];
  childrenIds.forEach((childId) => {
    const child = appCtx.d7(childId);
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
function t6(name, ComponentInternalRepresentation, appCtx, listDependenciesFn, resolveDependenciesFn) {
  const proxy = ComponentInternalRepresentation.m4();
  if (proxy !== null) {
    return proxy;
  }
  const handler = appCtx.f7(name);
  if (handler === null) {
    throw new Error(`Missing component handler ${name}`);
  }
  const dependencies = listDependenciesFn(handler);
  const injectables = resolveDependenciesFn({
    dependencies,
    type: "component",
    component: ComponentInternalRepresentation
  });
  const exposedProxy = handler(...injectables);
  ComponentInternalRepresentation.m7(exposedProxy);
  return exposedProxy;
}
function t7(name, appCtx, listDependenciesFn, resolveDependenciesFn) {
  let handler = appCtx.f8(name);
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
function t8(name, appCtx, listDependenciesFn, resolveDependenciesFn) {
  const serviceInternalRepresentation = appCtx.g3(name);
  const handler = appCtx.f6(name);
  if (handler === null) {
    throw new Error(`Missing service handler ${name}`);
  }
  const dependencies = listDependenciesFn(handler);
  const injectables = resolveDependenciesFn({
    dependencies,
    type: "service"
  });
  let serviceExternalApi = handler(...injectables);
  if (serviceExternalApi === void 0 || serviceExternalApi === null) {
    serviceExternalApi = {};
  }
  appCtx.g2(name, serviceExternalApi);
  return serviceExternalApi;
}
function t9(name, appCtx, listDependenciesFn, resolveDependenciesFn, component) {
  let handler = appCtx.f9(name);
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

// out/types.js
var LibraryBrand = /* @__PURE__ */ Symbol("LibraryBrand");
var ComponentFamilyTreeBrand = /* @__PURE__ */ Symbol("ComponentFamilyTreeBrand");
var RegistryBrand = /* @__PURE__ */ Symbol("RegistryBrand");

// out/services/libraryService.js
function u0() {
  const library = {
    data: {
      component: /* @__PURE__ */ new Map(),
      service: /* @__PURE__ */ new Map(),
      factory: /* @__PURE__ */ new Map(),
      helper: /* @__PURE__ */ new Map()
    },
    [LibraryBrand]: true
  };
  return library;
}
function u1(library) {
  if ("data" in library) {
    return library;
  }
  throw new PluncError("ERR4");
}
function u2(library, name, type, handler) {
  const internalData = u1(library);
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
function u3(library, name) {
  var _a;
  const internalData = u1(library);
  return (_a = internalData.data.component.get(name)) !== null && _a !== void 0 ? _a : null;
}
function u4(library, name) {
  var _a;
  const internalData = u1(library);
  return (_a = internalData.data.service.get(name)) !== null && _a !== void 0 ? _a : null;
}
function u5(library, name) {
  var _a;
  const internalData = u1(library);
  return (_a = internalData.data.factory.get(name)) !== null && _a !== void 0 ? _a : null;
}
function u6(library, name) {
  var _a;
  const internalData = u1(library);
  return (_a = internalData.data.helper.get(name)) !== null && _a !== void 0 ? _a : null;
}

// out/services/lineageService.js
function u7(tree) {
  if ("data" in tree) {
    return tree;
  }
  throw new PluncError("ERR5");
}
function u8() {
  const genealogy = {
    data: {},
    [ComponentFamilyTreeBrand]: true
  };
  return genealogy;
}
function u9(tree, parentId, childId) {
  const internalTree = u7(tree);
  if (internalTree.data[parentId] === void 0) {
    internalTree.data[parentId] = {
      parent: null,
      children: []
    };
  }
  internalTree.data[parentId].children.push(childId);
  if (internalTree.data[childId] === void 0) {
    internalTree.data[childId] = {
      parent: parentId,
      children: []
    };
  }
}
function v0(tree, childId) {
  const internalTree = u7(tree);
  if (internalTree.data[childId] === void 0)
    return [];
  const parents = [];
  let parent = internalTree.data[childId].parent;
  while (parent !== null) {
    parents.push(parent);
    parent = internalTree.data[parent].parent;
  }
  return parents;
}
function v1(tree, parentId) {
  const internalTree = u7(tree);
  if (internalTree.data[parentId] === void 0)
    return [];
  return internalTree.data[parentId].children;
}
function v2(tree, childId) {
  const internalTree = u7(tree);
  if (internalTree.data[childId] === void 0)
    return null;
  return internalTree.data[childId].parent;
}
function v3(tree, componentId) {
  const internalTree = u7(tree);
  if (internalTree.data[componentId] === void 0)
    return [];
  const parentId = internalTree.data[componentId].parent;
  if (parentId === null)
    return [];
  const siblings = internalTree.data[parentId].children.filter((childId) => childId !== componentId);
  return siblings;
}

// out/services/lockService.js
function v4(attributeKeyFormatter) {
  return function lockElement(element2) {
    const attributeKey = attributeKeyFormatter(a7);
    element2.setAttribute(attributeKey, a1);
  };
}
function v5(attributeKeyFormatter) {
  return function h5(element2) {
    const attributeKey = attributeKeyFormatter(a7);
    return element2.getAttribute(attributeKey) !== null;
  };
}
function v6(attributeKeyFormatter) {
  return function h7(element2, eventName) {
    const attribute = attributeKeyFormatter(a4);
    const existing = element2.getAttribute(attribute);
    if (existing === null)
      return false;
    const events = existing.split(",");
    return events.includes(eventName);
  };
}
function v7(attributeKeyFormatter) {
  return function h6(element2, eventName) {
    const attributeKey = attributeKeyFormatter(a4);
    const existing = element2.getAttribute(attributeKey);
    if (existing === null) {
      element2.setAttribute(attributeKey, eventName);
      return;
    }
    let events = existing.split(",");
    for (let i3 = 0; i3 < events.length; i3++) {
      const event = events[i3];
      if (event !== eventName) {
        events.push(eventName);
      }
    }
    element2.setAttribute(attributeKey, events.join(","));
  };
}

// out/services/namedElements.js
function v8(appCtx, elementsSelector) {
  return function v9(referenceId, component) {
    [b2].forEach((attribute) => {
      const namedElementAttribute = appCtx.e4(attribute);
      const attributableElements = elementsSelector(component, `[${namedElementAttribute}]`);
      attributableElements.forEach((element2) => {
        appCtx.g9(element2, a3, referenceId);
      });
    });
  };
}

// out/services/pluncAppService.js
function w0(id, name, config, library, registry) {
  const onReadyListeners = [];
  let ready = false;
  function f3() {
    ready = true;
    for (const listener of onReadyListeners) {
      listener();
    }
  }
  function d2() {
    return ready;
  }
  function d0(listener) {
    onReadyListeners.push(listener);
  }
  function f4() {
    return onReadyListeners;
  }
  return {
    config,
    library,
    registry,
    name,
    id,
    f4,
    f3,
    d2,
    d0
  };
}

// out/services/registryService.js
function w6() {
  const registry = {
    data: {
      components: /* @__PURE__ */ new Map(),
      services: /* @__PURE__ */ new Map()
    },
    [RegistryBrand]: true
  };
  return registry;
}
function w7(registry) {
  if ("data" in registry) {
    return registry;
  }
  throw new PluncError("ERR6");
}
function g0(registry, id, component) {
  const internalRegistry = w7(registry);
  internalRegistry.data.components.set(id, component);
}
function d7(registry, id) {
  var _a;
  const internalRegistry = w7(registry);
  return (_a = internalRegistry.data.components.get(id)) !== null && _a !== void 0 ? _a : null;
}
function g1(registry, ids) {
  const internalRegistry = w7(registry);
  const components = [];
  ids.forEach((id) => {
    const component = internalRegistry.data.components.get(id);
    if (component) {
      components.push(component);
    }
  });
  return components;
}
function f0(registry) {
  const internalRegistry = w7(registry);
  return Array.from(internalRegistry.data.components.values());
}
function g2(registry, name, service) {
  const internalRegistry = w7(registry);
  internalRegistry.data.services.set(name, service);
}
function g3(registry, name) {
  var _a;
  const internalRegistry = w7(registry);
  return (_a = internalRegistry.data.services.get(name)) !== null && _a !== void 0 ? _a : null;
}
function g4(registry, ids) {
  const internalRegistry = w7(registry);
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
function w8(source, target) {
  if (source === null)
    return;
  while (source.childNodes.length > 0) {
    target.appendChild(source.childNodes[0]);
  }
}
function x0(reconcileChildrenFn, findByComponentId) {
  return function x1(sourceScope, targetScope, childComponentIds) {
    const TChildRegistry = {};
    for (let i3 = 0; i3 < childComponentIds.length; i3++) {
      const childId = childComponentIds[i3];
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
      if (actualChildEl === null)
        continue;
      const tempChildEl = TChildRegistry[childId];
      reconcileChildrenFn(tempChildEl, actualChildEl);
    }
  };
}

// out/services/stagingElement.js
function e0(innerHtml) {
  const element2 = document.implementation.createHTMLDocument().body;
  Object.defineProperty(element2, "$plStgCS", {
    value: false,
    writable: true,
    enumerable: false,
    configurable: false
  });
  if (innerHtml) {
    element2.innerHTML = innerHtml;
  }
  return element2;
}
function e1(stagingElement, html) {
  if (stagingElement.$plStgCS) {
    throw new PluncError("ERR1");
  }
  stagingElement.innerHTML = html;
}
function i1(stagingElement) {
  if (stagingElement.$plStgCS) {
    throw new PluncError("ERR2");
  }
  return stagingElement.innerHTML;
}
function e3(stagingElement, targetElement) {
  if (stagingElement.$plStgCS) {
    throw new PluncError("ERR3");
  }
  while (stagingElement.firstChild) {
    targetElement.appendChild(stagingElement.firstChild);
  }
  stagingElement.$plStgCS = true;
}

// out/services/templateService.js
function x2(contextElement) {
  const templatesMap = /* @__PURE__ */ new Map();
  const templateElements = Array.from(contextElement.querySelectorAll("template"));
  const pluncAttr = `${a0}`;
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
var createContainer = i2(w0, w6, g0, d7, g1, f0, g2, g3, g4, u0, u2, u4, u3, u5, u6, u8, u9, v0, v1, v2, v3, w2, p2, p4, l9, n2, o8, o9, n7, p0, v4, v5, v6, v7, o7, p6, m1, m9, m5, p9, e0, e1, i1, e3);
var plunc = {
  create: (applicationName, configuration = null) => {
    const instanceId = contexts.length + 1;
    const appContainer = createContainer(instanceId, applicationName, configuration);
    contexts.push(appContainer);
    return {
      component: r3(appContainer),
      service: r5(appContainer),
      factory: r7(appContainer),
      helper: r9(appContainer)
    };
  }
};
if (typeof window !== "undefined") {
  window.plunc = plunc;
}
var bootstrap_default = plunc;
async function shouldInit(appContainer) {
  return appContainer.c9().config.startFn();
}
async function bootstrap(contexts2) {
  if (contexts2.length === 0)
    return;
  const [appContainer, ...rest] = contexts2;
  if (!await shouldInit(appContainer))
    return;
  const templatesMap = x2(document.body);
  const appStagingElement = e0(templatesMap.get(appContainer.c9().name));
  const componentIdGenerator = n2(appContainer.c9());
  const referenceAttacher = v8(appContainer, o9);
  const renderComponents = n3(appContainer, templatesMap, o9, componentIdGenerator, referenceAttacher);
  renderComponents(appStagingElement, "");
  const allComponentInternalRepresentation = appContainer.f0();
  for (const componentId in allComponentInternalRepresentation) {
    const componentInternalRepresentation = allComponentInternalRepresentation[componentId];
    const dependencyResolver = s2(appContainer, s1);
    t6(componentInternalRepresentation.name, componentInternalRepresentation, appContainer, s1, dependencyResolver);
  }
  for (const componentId in allComponentInternalRepresentation) {
    const componentInternalRepresentation = allComponentInternalRepresentation[componentId];
    const targetComponentElement = appContainer.d3(appStagingElement, componentInternalRepresentation.id);
    if (targetComponentElement === null)
      continue;
    const tempElement = document.implementation.createHTMLDocument().body;
    tempElement.innerHTML = targetComponentElement.innerHTML;
    const idsOfChildren = appContainer.f1(componentInternalRepresentation.id);
    appContainer.f2(tempElement, idsOfChildren);
    const o6 = o5(appContainer);
    o6(tempElement, componentInternalRepresentation.scope, false);
    const reconcileComponent = x0(w8, appContainer.d3);
    reconcileComponent(tempElement, targetComponentElement, idsOfChildren);
  }
  const appElement = p8(appContainer.c9().name);
  appElement.replaceChildren();
  appContainer.e3(appStagingElement, appElement);
  appContainer.c9().f3();
  const readyListeners = appContainer.c9().f4();
  for (let i3 = 0; i3 < readyListeners.length; i3++) {
    const listener = readyListeners[i3];
    listener();
  }
  bootstrap(rest);
}
DOMHelper.ready(bootstrap.bind(null, contexts));
export {
  bootstrap_default as default
};
