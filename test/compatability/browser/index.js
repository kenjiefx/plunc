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

  // out/entities/plunc.js
  function createPluncApp(name, id, configuration, registry, library) {
    let ready = false;
    const config = configuration;
    function getConfig() {
      return config;
    }
    function getLibrary() {
      return library;
    }
    function getRegistry() {
      return registry;
    }
    function getName() {
      return name;
    }
    function getId() {
      return id;
    }
    function nowReady() {
      ready = true;
    }
    function isReady() {
      return ready;
    }
    return {
      getConfig,
      getLibrary,
      getRegistry,
      getName,
      getId,
      nowReady,
      isReady
    };
  }

  // out/utils/pluncAttribute.js
  var REPEAT_ELEMENT_ATTR = "repeat";
  function usePluncAttribute(instance) {
    function __testMangle(instance2) {
      return instance2.getConfig().prefix;
    }
    function create(key) {
      const prefix = __testMangle(instance);
      return `${prefix}${key}`;
    }
    function createWithValue(key, value) {
      const prefix = __testMangle(instance);
      return `${prefix}${key}="${value}"`;
    }
    return {
      create,
      createWithValue
    };
  }

  // out/renders/repeat.js
  function renderRepeats(componentTemplate, pluncApp, attributeManager, elementSelector) {
    const repeatAttr = attributeManager.create(REPEAT_ELEMENT_ATTR);
    const firstLevelRepeatElements = elementSelector.getFirstChildrenWithAttribute(componentTemplate, repeatAttr);
    console.log(firstLevelRepeatElements);
  }

  // out/utils/elementSelector.js
  function useElementSelector() {
    function select(context, selector) {
      return context.querySelector(selector);
    }
    function selectAll(context, selector) {
      return Array.from(context.querySelectorAll(selector));
    }
    function selectClosest(element, selector) {
      return element.closest(selector);
    }
    function getFirstChildrenWithAttribute(parent, attribute) {
      const selectedChildren = parent.querySelectorAll(`[${attribute}]`);
      const results = [];
      selectedChildren.forEach((element) => {
        if (element.parentElement === null) {
          results.push(element);
          return;
        }
        const closestAncestorWithAttribute = element.parentElement.closest(`[${attribute}]`);
        if (closestAncestorWithAttribute === null) {
          results.push(element);
        }
      });
      return results;
    }
    return {
      select,
      selectAll,
      selectClosest,
      getFirstChildrenWithAttribute
    };
  }

  // out/test/compatability/browser/index.js
  function run() {
    console.log("Browser compatibility tests running...");
    const testId = "repeat";
    const template = document.querySelector(`template[test-id="${testId}"]`);
    if (!template) {
      console.error(`Template with test-id="${testId}" not found.`);
      return;
    }
    const clone = template.content.cloneNode(true);
    const registry = {};
    const library = {};
    const pluncApp = createPluncApp(
      "TestApp",
      1,
      {
        prefix: "plunc-",
        startFn: () => __async(null, null, function* () {
          return true;
        }),
        endFn: () => __async(null, null, function* () {
        })
      },
      // @ts-ignore
      registry,
      library
    );
    const attrManager = usePluncAttribute(pluncApp);
    renderRepeats(clone, pluncApp, attrManager, useElementSelector());
  }
  run();
})();
//# sourceMappingURL=index.js.map
