/*
==========================================
Plunc JS (Beta Version 0.8.6)
MIT License
Copyright (c) 2022 Kenjie Terrado

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Special Credits to the amazing authors of DomReady libarary!
==========================================
*/

(()=>{

  /**
   * Returns the element within the DOM body with the attribute
   * `plunc-app`, or depending of what prefix being used
   */
  const e48 = (instance) => {
      const name = `${instance.x88()}`;
      const selector = `
      [${XAttr.e42(APP_ATTR, instance, name)}]
    `;
      const elements = document.querySelectorAll(`${selector.trim()}`);
      if (elements.length === 0)
          throw new Error('100');
      if (elements.length > 1)
          throw new Error('101');
      return elements[0];
  };
  class ApplicationAPI {
      constructor() {
          Object.defineProperty(this, "listeners", {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0
          });
          this.listeners = {
              ready: []
          };
      }
      ready(listener) {
          this.listeners.ready.push(listener);
          return (this.listeners.ready.length) - 1;
      }
      a60(key) {
          var _a;
          return (_a = this.listeners[key]) !== null && _a !== void 0 ? _a : [];
      }
  }
  const a49 = (instance) => {
      return instance.a95();
  };
  
  
  
  const x78 = (component, instance, name, callback) => {
      if (!instance.a89()) {
          throw new Error(`cannot use $block outside $app.ready`);
      }
      const blockAttribute = XAttr.e42(BLOCK_ELEMENT_ATTR, instance, name);
      const cElement = XAttr.x43(e48(instance), instance, component.e100());
      if (cElement === null) {
          throw new Error('unknown component element');
      }
      const refAttribute = XAttr.e42(ELEMENT_REFERENCE_ATTR, instance, component.e100());
      const blocks = cElement.querySelectorAll(`[${blockAttribute}][${refAttribute}]`);
      if (blocks.length === 0) {
          callback(null);
          return;
      }
      for (let i = 0; i < blocks.length; i++) {
          callback(new PluncElement(blocks[i]));
      }
  };
  const a23 = () => {
      return {};
  };
  
  
  
  const x61 = (component, lineage, instance) => {
      return {
          id: component.e100(),
          name: component.x88(),
          alias: component.a79(),
          element: () => {
              if (!instance.a89()) {
                  throw new Error(`cannot invoke component.get().element() outside $app.ready`);
              }
              let elementNode = XAttr.x43(e48(instance), instance, component.e100());
              if (elementNode === null) {
                  return null;
              }
              return new PluncElement(elementNode);
          }
      };
  };
  
  
  const x75 = (component, lineage, instance) => {
      const parentid = lineage.parent(component.e100());
      if (parentid === null)
          return null;
      const parent = instance.x80().e90(parentid);
      if (parent === null)
          return null;
      if (!(parent instanceof Component))
          return null;
      const wrapper = {};
      wrapper[parentid] = parent;
      return x24(wrapper);
  };
  
  
  
  
  
  
  const a81 = (component, instance, lineage, block = null) => {
      return new Promise(async (resolve, reject) => {
          try {
              if (!instance.a89()) {
                  throw new Error(`cannot use $patch outside $app.ready`);
              }
              let mode = 'component';
              let patchableNodes = [XAttr.x43(e48(instance), instance, component.e100())];
              if (block !== null) {
                  mode = 'block';
                  const elementsButNotChild = x1(XAttr.e42(BLOCK_ELEMENT_ATTR, instance, block), component, lineage, instance);
                  if (elementsButNotChild === null) {
                      return;
                  }
                  patchableNodes = Array.from(elementsButNotChild);
              }
              if (patchableNodes.length === 0 || patchableNodes[0] === null) {
                  return resolve();
              }
              for (let i = 0; i < patchableNodes.length; i++) {
                  const elementBindTo = patchableNodes[i];
                  if (elementBindTo === null)
                      continue;
                  let elementBindFrom = x44();
                  if (mode === 'component') {
                      elementBindFrom.innerHTML = await e50(component.e100(), elementBindTo, instance, lineage);
                  }
                  else {
                      if (block === null)
                          continue;
                      const template = x57(instance, component.x88(), block);
                      if (template === null)
                          continue;
                      /** Re-attach reference id to block elements nested within the block element to patch */
                      const implementation = document.implementation.createHTMLDocument();
                      implementation.body.innerHTML = template;
                      e7(component.e100(), implementation, instance);
                      elementBindFrom.innerHTML = implementation.body.innerHTML;
                      e2(elementBindTo, elementBindFrom, instance, lineage);
                  }
                  a16(elementBindFrom, lineage.children(component.e100()), instance);
                  await x62(elementBindFrom, component, instance);
                  if (elementBindTo === null)
                      continue;
                  const childIds = lineage.children(component.e100());
                  x36(elementBindFrom, elementBindTo, instance, childIds);
                  /**
                   * Find all unrendered child component. This happens usually because of
                   * conditional statements such xif
                   */
                  for (let k = 0; k < childIds.length; k++) {
                      const childId = childIds[k];
                      const childComponent = XAttr.x43(elementBindTo, instance, childId);
                      if (childComponent === null)
                          continue;
                      if (childComponent.innerHTML.trim() === '') {
                          await x4(childComponent, instance.x80().e90(childId), lineage, instance);
                      }
                  }
              }
              resolve();
          }
          catch (error) {
              console.error(`plunc.js $patch error: ${error.message}`);
              reject(error);
          }
      });
  };
  const x4 = (elementToBindTo, component, lineage, instance) => {
      return new Promise(async (resolve, reject) => {
          try {
              const elementBindFrom = x44();
              elementBindFrom.innerHTML = await e50(component.e100(), elementToBindTo, instance, lineage);
              await x62(elementBindFrom, component, instance);
              const childIds = lineage.children(component.e100());
              for (let i = 0; i < childIds.length; i++) {
                  const childId = childIds[i];
                  const childComponent = XAttr.x43(elementBindFrom, instance, childId);
                  if (childComponent !== null) {
                      await x4(childComponent, instance.x80().e90(childId), lineage, instance);
                  }
              }
              x36(elementBindFrom, elementToBindTo, instance, childIds);
              resolve();
          }
          catch (error) {
              reject(error);
          }
      });
  };
  const e2 = (liveBlockElements, templateBlockElement, instance, lineage) => {
      /** Takes all child component within the live block element */
      const liveChildComponents = XAttr.a31(liveBlockElements, instance, COMPONENT_ELEMENT_ATTR);
      const templateChildComponents = XAttr.a31(templateBlockElement, instance, COMPONENT_ELEMENT_ATTR);
      for (let z = 0; z < liveChildComponents.length; z++) {
          const liveChildComponent = liveChildComponents[z];
          const liveChildComponentId = XAttr.x82(liveChildComponent, instance, STRAWBERRY_ID_ATTR);
          const pluncIdAttr = XAttr.e96(STRAWBERRY_ID_ATTR, instance);
          if (liveChildComponentId === null) {
              throw new Error();
          }
          templateChildComponents[z].setAttribute(pluncIdAttr, liveChildComponentId);
          x36(liveChildComponent, templateChildComponents[z], instance, lineage.children(liveChildComponentId));
      }
  };
  var XAttr;
  (function (XAttr) {
      /**
       * Creates a component attribute with value. Example: `xcomponent="@ComponentName"`
       */
      XAttr.e76 = (name, instance) => {
          const prefix = instance.a97().prefix;
          return `${prefix}${COMPONENT_ELEMENT_ATTR}="@${name}"`;
      };
      /**
       * Creates an attribute with any key. Example: `xsomekeyhere`
       */
      XAttr.e96 = (key, instance) => {
          const prefix = instance.a97().prefix;
          return `${prefix}${key}`;
      };
      /**
       * Creates an attribute with any key, with any value. Example: `xsomekeyhere="value"`
       */
      XAttr.e42 = (key, instance, value) => {
          const prefix = instance.a97().prefix;
          return `${prefix}${key}="${value}"`;
      };
      XAttr.x82 = (element, instance, key) => {
          const prefix = instance.a97().prefix;
          return element.getAttribute(`${prefix}${key}`);
      };
      XAttr.x43 = (element, instance, cid) => {
          const prefix = instance.a97().prefix;
          const attr = `${prefix}id="${cid}"`;
          return element.querySelector(`[${attr}]`);
      };
      XAttr.a31 = (element, instance, name) => {
          const attr = XAttr.e96(name, instance);
          return element.querySelectorAll(`[${attr}]`);
      };
  })(XAttr || (XAttr = {}));
  const APP_ATTR = 'app';
  const TEMPL_NAME_ATTR = 'name';
  const SERVICE_OBJECT = 'service_object';
  const FACTORY_OBJECT = 'factory_object';
  const COMPONENT_OBJECT = 'component_object';
  const COMPONENT_ELEMENT_ATTR = 'component';
  const REPEAT_ELEMENT_ATTR = 'repeat';
  const IF_ELEMENT_ATTR = 'if';
  const HIDE_ELEMENT_ATTR = 'hide';
  const SHOW_ELEMENT_ATTR = 'show';
  const CHECK_ELEMENT_ATTR = 'check';
  const STYLE_ELEMENT_ATTR = 'style';
  const MODEL_ELEMENT_ATTR = 'model';
  const DISABLE_ELEMENT_ATTR = 'disable';
  const CLICK_EVENT_ATTR = 'click';
  const CHANGE_EVENT_ATTR = 'change';
  const TOUCH_EVENT_ATTR = 'touch';
  const BLOCK_ELEMENT_ATTR = 'block';
  const SCOPE_ARGUMENT_KEY = '$scope';
  const BLOCK_ARGUMENT_KEY = '$block';
  const PARENT_ARGUMENT_KEY = '$parent';
  const CHILDREN_ARGUMENT_KEY = '$children';
  const PATCH_ARGUMENT_KEY = '$patch';
  const APP_ARGUMENT_KEY = '$app';
  const COMPONENT_ARGUMENT_KEY = '$this';
  const STRAWBERRY_ID_ATTR = 'id';
  const REPEAT_REFERENCE_TOKEN = '$$index';
  const LOCK_ID_ATTR_KEY = 'set';
  const LOCK_ID_ATTR_VALUE = 'true';
  const EVENT_ELEMENT_ATTR = 'event';
  const ELEMENT_REFERENCE_ATTR = 'rid';
  
  
  
  const a45 = (instance, id, existing = '') => {
      if (existing !== '') {
          return `${existing}.${id.toString()}`;
      }
      return `${instance.e100().toString()}.${id.toString()}`;
  };
  const e50 = (id, component, instance, lineage) => {
      return new Promise(async (resolve, reject) => {
          try {
              /** First, we'll check if component has declared template */
              const mayHaveAlias = XAttr.x82(component, instance, COMPONENT_ELEMENT_ATTR);
              if (mayHaveAlias === null)
                  return resolve('');
              const name = a32(mayHaveAlias).name;
              /** Get component template */
              const cTempl = x83(instance, name);
              /** Component implementation element */
              const implementation = document.implementation.createHTMLDocument();
              implementation.body.innerHTML = cTempl;
              e7(id, implementation, instance);
              await e58(id, implementation, instance, lineage);
              resolve(implementation.body.innerHTML);
          }
          catch (error) {
              reject(error);
          }
      });
  };
  const e7 = (id, implementation, instance) => {
      const refAttr = XAttr.e96(ELEMENT_REFERENCE_ATTR, instance);
      const attrList = [BLOCK_ELEMENT_ATTR];
      const allElements = [];
      /** Retrieving all elements with plunc-block */
      attrList.forEach(attr => {
          const elements = Array.from(implementation.body.querySelectorAll(`[${XAttr.e96(attr, instance)}]`));
          for (let i = 0; i < elements.length; i++) {
              const element = elements[i];
              const name = XAttr.x82(element, instance, attr);
              e8(name);
          }
          allElements.push(...elements);
      });
      /** For each named elements, we'll add reference ids */
      allElements.forEach(element => {
          element.setAttribute(refAttr, id);
      });
  };
  const e8 = (name) => {
      const message = `named element name must not be empty or `
          + `contain invalid characters`;
      if (name === null) {
          throw new Error(message);
      }
      if (!(typeof name === 'string')) {
          throw new Error(message);
      }
      if (name.includes("\\")) {
          throw new Error(message);
      }
  };
  const e58 = async (parentId, parent, instance, lineage) => {
      return new Promise(async (resolve, reject) => {
          let compiled = '';
          const cattr = COMPONENT_ELEMENT_ATTR;
          const selector = XAttr.e96(cattr, instance);
          const children = parent.querySelectorAll(`[${selector}]`);
          for (let i = 0; i < children.length; i++) {
              const child = children[i];
              /** Child components must have names */
              const mayHaveAlias = XAttr.x82(child, instance, cattr);
              if (mayHaveAlias === null)
                  continue;
              /** Setting ids to child components */
              const childId = a45(instance, i, parentId);
              child.setAttribute(XAttr.e96('id', instance), childId);
              lineage.begat(parentId, childId);
              /** Creates the Child component object if not existing */
              let childObj;
              const existing = instance.x80().e90(childId);
              if (existing !== null && existing instanceof Component) {
                  childObj = existing;
              }
              else {
                  childObj = new Component(childId, mayHaveAlias);
              }
              a11(lineage, childObj, instance);
              instance.x80().a84(childId, childObj);
              child.innerHTML = await e50(childId, child, instance, lineage);
          }
          resolve();
      });
  };
  /**
   * A step that checks whether the child component
   * is its own parent or grand parent.
   * @param lineage Lineage object
   * @param component Component object
   * @param instance PluncApp instance
   */
  const a11 = (lineage, component, instance) => {
      const name = component.x88();
      const idsOfParents = lineage.lookup(component.e100());
      const parents = instance.x80().e85(idsOfParents);
      parents.forEach(parentC => {
          if (parentC.x88() === name) {
              throw new Error(`plunc.js circular dependency of component
          "${name}" detected in registry`);
          }
      });
  };
  const a32 = (name) => {
      var _a;
      return {
          name: name.split(' as ')[0],
          alias: (_a = name.split(' as ')[1]) !== null && _a !== void 0 ? _a : null
      };
  };
  const a63 = (config) => {
      var _a, _b, _c;
      const startFn = () => new Promise(resolve => resolve(true));
      const endFn = () => new Promise(resolve => resolve());
      return {
          prefix: (_a = config === null || config === void 0 ? void 0 : config.prefix) !== null && _a !== void 0 ? _a : 'plunc-',
          startFn: (_b = config === null || config === void 0 ? void 0 : config.startFn) !== null && _b !== void 0 ? _b : startFn,
          endFn: (_c = config === null || config === void 0 ? void 0 : config.endFn) !== null && _c !== void 0 ? _c : endFn
      };
  };
  
  
  
  
  
  
  
  
  /**
   * Resolves an array of dependencies. This function iterates
   * over existing components, services, factories, and
   * helpers in the library, and known argument keys,
   * matching them by the names.
   * @param param - @see DependencyResolverParams
   * @returns
   */
  const x20 = (params) => {
      return new Promise(async (resolve, reject) => {
          try {
              const injectables = [];
              for (let i = 0; i < params.dependencies.length; i++) {
                  const dependency = params.dependencies[i];
                  if (dependency === SCOPE_ARGUMENT_KEY) {
                      if (params.type === 'component' || params.type === 'helper') {
                          injectables.push(params.scope);
                          continue;
                      }
                      injectables.push(null);
                      continue;
                  }
                  if (dependency.charAt(0) === '$') {
                      if (params.type === 'service' || params.type === 'factory') {
                          injectables.push({});
                          continue;
                      }
                      switch (dependency) {
                          case BLOCK_ARGUMENT_KEY:
                              injectables.push((name, callback) => {
                                  return x78(params.component, params.instance, name, callback);
                              });
                              break;
                          case PATCH_ARGUMENT_KEY:
                              injectables.push((element = null) => {
                                  return a81(params.component, params.instance, params.lineage, element);
                              });
                              break;
                          case PARENT_ARGUMENT_KEY:
                              injectables.push(x75(params.component, params.lineage, params.instance));
                              break;
                          case APP_ARGUMENT_KEY:
                              injectables.push(a49(params.instance));
                              break;
                          case CHILDREN_ARGUMENT_KEY:
                              injectables.push(a23());
                              break;
                          case COMPONENT_ARGUMENT_KEY:
                              injectables.push(x61(params.component, params.lineage, params.instance));
                              break;
                          default:
                              injectables.push({});
                              break;
                      }
                      continue;
                  }
                  /**
                   * We'll check if the dependency points to service by
                   * checking the library if the name exists
                   */
                  const service = params.instance.e91().e92(dependency);
                  if (service !== null) {
                      const injectable = await x12(dependency, params.instance);
                      injectables.push(injectable);
                      continue;
                  }
                  /**
                   * Next, we'll check if the dependency points to a factory
                   */
                  const factory = params.instance.e91().x93(dependency);
                  if (factory !== null) {
                      const injectable = await a13(dependency, params.instance);
                      injectables.push(injectable);
                      continue;
                  }
                  /**
                   * Next, we'll check if the dependency points to a helper
                   */
                  if (params.type === 'helper' || params.type === 'component') {
                      const helper = params.instance.e91().x98(dependency);
                      if (helper !== null && params.scope !== null) {
                          const injectable = await e17(params.component, params.scope, dependency, params.lineage, params.instance);
                          injectables.push(injectable);
                          continue;
                      }
                  }
                  /**
                   * Lastly, we'll check if the dependency points to a child component
                   */
                  if (params.type === 'component') {
                      const children = params.lineage.children(params.component.e100())
                          .filter(childId => {
                          const child = params.instance.x80().e90(childId);
                          return (child.x88() === dependency);
                      }).map(childId => {
                          return params.instance.x80().e90(childId);
                      });
                      if (children.length > 0) {
                          const wrapper = {};
                          for (let i = 0; i < children.length; i++) {
                              const child = children[i];
                              await e10(child, params.instance, params.lineage);
                              wrapper[child.e100()] = child;
                          }
                          const proxy = x24(wrapper);
                          injectables.push(proxy);
                          continue;
                      }
                      /**
                       * Perhaps, it's an alias to a child component?
                       */
                      const aliasChildren = params.lineage.children(params.component.e100())
                          .filter(childId => {
                          const child = params.instance.x80().e90(childId);
                          return (child.a79() === dependency);
                      }).map(childId => {
                          return params.instance.x80().e90(childId);
                      });
                      if (aliasChildren.length > 0) {
                          const wrapper = {};
                          for (let i = 0; i < aliasChildren.length; i++) {
                              const child = aliasChildren[i];
                              await e10(child, params.instance, params.lineage);
                              wrapper[child.e100()] = child;
                          }
                          const proxy = x24(wrapper);
                          injectables.push(proxy);
                          continue;
                      }
                  }
                  /**
                   * If all else fails to match, we'll push a `null` value, and throw
                   * a warning
                   */
                  injectables.push(null);
                  console.warn(`plunc.js "${dependency}" not found`);
              }
              resolve(injectables);
          }
          catch (error) {
              reject(error);
          }
      });
  };
  /**
   * Processes a function string and returns an array
   * of arguments or dependencies of the function.
   * @param handler - a typeof function
   * @returns
   */
  const x21 = (handler) => {
      return new Promise(async (resolve, reject) => {
          try {
              const handlerStr = handler.toString().split('{')[0];
              if (handlerStr.charAt(0) !== '(') {
                  const param = handlerStr.split('=>')[0];
                  if (param === handlerStr) {
                      resolve([]);
                      return;
                  }
                  resolve([param.trim()]);
                  return;
              }
              const matchedFn = handlerStr.match(/(?<=\().+?(?=\))/g);
              if (matchedFn === null || /[(={})]/g.test(matchedFn[0])) {
                  return resolve([]);
              }
              resolve(matchedFn[0].split(',').map(item => {
                  return item.trim();
              }));
          }
          catch (error) {
              reject(error);
          }
      });
  };
  const x24 = (wrapper) => {
      const handler = {
          get: function get(target, name) {
              for (const id in target) {
                  const component = target[id];
                  const exposed = component.a71();
                  if (exposed === null) {
                      const name = component.x88();
                      throw new Error(`cannot invoke component`
                          + ` "${name}}" before $app is ready`);
                  }
                  if (!(name in exposed)) {
                      throw new Error(`calling undefined member "${name}" `
                          + `in component "${component.x88()}"`);
                  }
                  return exposed[name];
              }
          }
      };
      return new Proxy(wrapper, handler);
  };
  // Everything that has to do with properly supporting our document ready event. Brought over from the most awesome jQuery.
  const userAgent = navigator.userAgent.toLowerCase();
  // Figure out what browser is being used
  const browser = {
      version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
      safari: /webkit/.test(userAgent),
      opera: /opera/.test(userAgent),
      msie: (/msie/.test(userAgent)) && (!/opera/.test(userAgent)),
      mozilla: (/mozilla/.test(userAgent)) && (!/(compatible|webkit)/.test(userAgent))
  };
  let readyBound = false;
  let isReady = false;
  let readyList = [];
  // Handle when the DOM is ready
  function domReady() {
      // Make sure that the DOM is not already loaded
      if (!isReady) {
          // Remember that the DOM is ready
          isReady = true;
          if (readyList) {
              for (var fn = 0; fn < readyList.length; fn++) {
                  readyList[fn].call(window, []);
              }
              readyList = [];
          }
      }
  }
  ;
  // From Simon Willison. A safe way to fire onload w/o screwing up everyone else.
  function addLoadEvent(func) {
      var oldonload = window.onload;
      if (typeof window.onload != 'function') {
          window.onload = func;
      }
      else {
          window.onload = function () {
              // @ts-ignore
              if (oldonload)
                  oldonload();
              func();
          };
      }
  }
  ;
  // does the heavy work of working through the browsers idiosyncracies (let's call them that) to hook onload.
  function bindReady() {
      if (readyBound) {
          return;
      }
      readyBound = true;
      // Mozilla, Opera (see further below for it) and webkit nightlies currently support this event
      if (document.addEventListener && !browser.opera) {
          // Use the handy event callback
          document.addEventListener("DOMContentLoaded", domReady, false);
      }
      // If IE is used and is not in a frame
      // Continually check to see if the document is ready
      if (browser.msie && window == top)
          (function () {
              if (isReady)
                  return;
              try {
                  // If IE is used, use the trick by Diego Perini
                  // http://javascript.nwbox.com/IEContentLoaded/
                  // @ts-ignore
                  document.documentElement.doScroll("left");
              }
              catch (error) {
                  setTimeout(arguments.callee, 0);
                  return;
              }
              // and execute any waiting functions
              domReady();
          })();
      if (browser.opera) {
          document.addEventListener("DOMContentLoaded", function () {
              if (isReady)
                  return;
              for (var i = 0; i < document.styleSheets.length; i++)
                  if (document.styleSheets[i].disabled) {
                      setTimeout(arguments.callee, 0);
                      return;
                  }
              // and execute any waiting functions
              domReady();
          }, false);
      }
      if (browser.safari) {
          var numStyles;
          (function () {
              if (isReady)
                  return;
              // @ts-ignore
              if (document.readyState != "loaded" && document.readyState != "complete") {
                  setTimeout(arguments.callee, 0);
                  return;
              }
              if (numStyles === undefined) {
                  var links = document.getElementsByTagName("link");
                  for (var i = 0; i < links.length; i++) {
                      if (links[i].getAttribute('rel') == 'stylesheet') {
                          numStyles++;
                      }
                  }
                  var styles = document.getElementsByTagName("style");
                  numStyles += styles.length;
              }
              if (document.styleSheets.length != numStyles) {
                  setTimeout(arguments.callee, 0);
                  return;
              }
              // and execute any waiting functions
              domReady();
          })();
      }
      // A fallback to window.onload, that will always work
      addLoadEvent(domReady);
  }
  ;
  // This is the public function that people can use to hook up ready.
  const DOMHelper = {
      ready: function (callback) {
          // Attach the listeners
          bindReady();
          // If the DOM is already ready, then execute the function immediately
          if (isReady)
              return callback.call(window, []);
          // Otherwis, add  the function to the wait list
          readyList.push(function () { return callback.call(window, []); });
      }
  };
  bindReady();
  
  
  /**
   * Clears all the contents of all existing child components
   * within a certain component.
   * @param cElement - the component element
   * @param childIds - All child ids
   * @param instance - PluncApp instance
   */
  const a16 = (cElement, childIds, instance) => {
      for (let i = 0; i < childIds.length; i++) {
          const childId = childIds[i];
          const childEl = XAttr.x43(cElement, instance, childId);
          if (childEl !== null)
              childEl.innerHTML = '';
      }
  };
  /**
   * Creates a temporary element
   * @returns Document
   */
  const x44 = () => {
      return document.implementation.createHTMLDocument().body;
  };
  /**
   * Copies an element from one to the other, while
   * at the same time ensuring that all the event
   * bindings to the source element remains intact.
   * @param bindFrom - Element
   * @param bindTo - Element
   */
  const a46 = (bindFrom, bindTo) => {
      if (bindFrom === null)
          return;
      while (bindFrom.childNodes.length > 0) {
          bindTo.appendChild(bindFrom.childNodes[0]);
      }
  };
  /**
   * Locking ensures that no further processing will be
   * made to the element. This is vital for cases when there
   * are repeat expressions, preserving the integrity.
   * @param element - element to be locked
   * @param instance - PluncApp instance
   */
  const a68 = (element, instance) => {
      const attr = XAttr.e96(LOCK_ID_ATTR_KEY, instance);
      element.setAttribute(attr, LOCK_ID_ATTR_VALUE);
  };
  /**
   * Checks if the element is locked. @see a68
   * @param element - element to be check
   * @param instance - PluncApp instance
   */
  const e47 = (element, instance) => {
      const attr = XAttr.e96(LOCK_ID_ATTR_KEY, instance);
      return (element.getAttribute(attr) !== null);
  };
  /**
   * Wraps comment block within an element.
   * @param element - Element to be disposed
   * @param comment - Comment you'd like to add
   */
  const x51 = (element, comment) => {
      if (null !== element) {
          element.innerHTML = '';
          if (element.parentNode !== null) {
              element.outerHTML = '<!-- plunc.js: ' + element.outerHTML + ' | ' + comment + ' -->';
          }
      }
  };
  /**
   * Copy element from one to another, preserving
   * child components
   * @param bindFromEl
   * @param bindToEl
   * @param instance
   * @param childIds
   */
  const x36 = (bindFromEl, bindToEl, instance, childIds) => {
      const TChildRegistry = {};
      for (let i = 0; i < childIds.length; i++) {
          const childId = childIds[i];
          const tempChildEl = x44();
          const actualChildEl = XAttr.x43(bindToEl, instance, childId);
          if (actualChildEl !== null) {
              a46(actualChildEl, tempChildEl);
              TChildRegistry[childId] = tempChildEl;
          }
      }
      bindToEl.innerHTML = '';
      a46(bindFromEl, bindToEl);
      for (const childId in TChildRegistry) {
          const actualChildEl = XAttr.x43(bindToEl, instance, childId);
          if (actualChildEl === null)
              continue;
          a46(TChildRegistry[childId], actualChildEl);
      }
  };
  const a18 = (element, eventName, instance) => {
      const attribute = XAttr.e96(EVENT_ELEMENT_ATTR, instance);
      let result = false;
      const existing = element.getAttribute(attribute);
      if (existing === null)
          return false;
      const events = existing.split(',');
      for (let i = 0; i < events.length; i++) {
          if (eventName === events[i]) {
              result = true;
          }
      }
      return result;
  };
  const x37 = (element, eventName, instance) => {
      const attribute = XAttr.e96(EVENT_ELEMENT_ATTR, instance);
      const existing = element.getAttribute(attribute);
      if (existing === null) {
          element.setAttribute(attribute, eventName);
          return;
      }
      let events = existing.split(',');
      for (var i = 0; i < events.length; i++) {
          if (eventName !== events[i]) {
              events.push(eventName);
          }
      }
      element.setAttribute(attribute, events.join(','));
  };
  const x1 = (attrWithValue, component, lineage, instance) => {
      const childIds = lineage.children(component.e100());
      let selector = '';
      for (let i = 0; i < childIds.length; i++) {
          const childId = childIds[i];
          const childAttrName = XAttr.e42(STRAWBERRY_ID_ATTR, instance, childId);
          selector += ':not([' + childAttrName + '])';
      }
      selector += ` > [${attrWithValue}]`;
      if (childIds.length === 0) {
          const xidAttrName = XAttr.e42(STRAWBERRY_ID_ATTR, instance, component.e100());
          selector = `[${xidAttrName}] [${attrWithValue}]`;
      }
      const componentElement = XAttr.x43(e48(instance), instance, component.e100());
      if (componentElement === null)
          return null;
      return componentElement.querySelectorAll(selector);
  };
  
  /**
   * Executes the handler/callback function of the component
   * @param component
   * @param instance
   * @param lineage
   * @returns
   */
  const e10 = (component, instance, lineage) => {
      return new Promise(async (resolve, reject) => {
          try {
              const name = component.x88();
              const handler = instance.e91().e76(name);
              if (handler === null) {
                  throw new Error(`missing component handler ${name}`);
              }
              const memoized = component.a71();
              if (memoized !== null) {
                  return resolve(memoized);
              }
              const dependencies = await x21(handler);
              const injectables = await x20({
                  dependencies: dependencies,
                  type: 'component',
                  scope: component.a86(),
                  instance: instance,
                  lineage: lineage,
                  component: component
              });
              const exposed = handler(...injectables);
              component.a72(exposed);
              resolve(exposed);
          }
          catch (error) {
              reject(error);
          }
      });
  };
  /**
   * Returns the name of the children of a component
   * @param component - Component
   * @param instance - PluncApp
   * @param lineage - Lineage
   */
  const a25 = (component, instance, lineage) => {
      const childIds = lineage.children(component.e100());
      const children = instance.x80().e85(childIds);
      return children.map(child => child.x88());
  };
  const x12 = (name, instance) => {
      return new Promise(async (resolve, reject) => {
          try {
              let service = instance.x80().e90(name);
              if (service !== null) {
                  return resolve(service);
              }
              const handler = instance.e91().e92(name);
              if (handler === null) {
                  throw new Error(`missing service handler ${name}`);
              }
              const dependencies = await x21(handler);
              const injectables = await x20({
                  dependencies: dependencies,
                  type: 'service',
                  instance: instance
              });
              service = handler(...injectables);
              if (service === undefined || service === null) {
                  throw new Error(`service ${name} must not return ${typeof service}`);
              }
              instance.x80().a84(name, service);
              resolve(service);
          }
          catch (error) {
              reject(error);
          }
      });
  };
  const a13 = (name, instance) => {
      return new Promise(async (resolve, reject) => {
          try {
              let handler = instance.e91().x93(name);
              if (handler === null) {
                  throw new Error(`missing factory handler ${name}`);
              }
              const dependencies = await x21(handler);
              const injectables = await x20({
                  dependencies: dependencies,
                  type: 'factory',
                  instance: instance
              });
              const factory = handler(...injectables);
              if (typeof factory === 'function') {
                  resolve(factory);
                  return;
              }
              throw new Error(`factory ${name} handler must return class reference`);
          }
          catch (error) {
              reject(error);
          }
      });
  };
  const e17 = (component, scope, name, lineage, instance) => {
      return new Promise(async (resolve, reject) => {
          try {
              let handler = instance.e91().x98(name);
              if (handler === null) {
                  throw new Error(`missing helper handler ${name}`);
              }
              const dependencies = await x21(handler);
              const injectables = await x20({
                  component: component,
                  dependencies: dependencies,
                  type: 'helper',
                  scope: scope,
                  instance: instance,
                  lineage: lineage
              });
              const helper = handler(...injectables);
              resolve(helper);
          }
          catch (error) {
              reject(error);
          }
      });
  };
  class TypeofFactory {
  }
  const a69 = (app) => {
      return app.a97().startFn();
  };
  
  
  
  /**
   * Retrieves the HTML content of a template.
   * @throw Error when there are no instance of the template
   * or there are two or more. Template names should be unique
   * throughout the application.
   * @param instance PluncApp
   * @param mayHaveAlias name of te template
   */
  const x83 = (instance, mayHaveAlias) => {
      const name = a32(mayHaveAlias).name;
      const selector = `
      template[${XAttr.e42(TEMPL_NAME_ATTR, instance, name)}]
    `;
      const templateEl = document.querySelectorAll(`${selector.trim()}`);
      if (templateEl.length === 0)
          throw new Error(`102:${name}`);
      if (templateEl.length > 1)
          throw new Error(`103:${name}`);
      return templateEl[0].innerHTML;
  };
  const x57 = (instance, component, block) => {
      const cTempl = x83(instance, component);
      const cElem = x44();
      cElem.innerHTML = cTempl;
      const blockAttr = XAttr.e42(BLOCK_ELEMENT_ATTR, instance, block);
      const blockEl = cElem.querySelector(`[${blockAttr}]`);
      if (blockEl === null)
          return null;
      return blockEl.innerHTML;
  };
  
  
  class Component {
      constructor(id, mayHaveAlias) {
          Object.defineProperty(this, "id", {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0
          });
          Object.defineProperty(this, "name", {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0
          });
          Object.defineProperty(this, "alias", {
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
          Object.defineProperty(this, "exposed", {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0
          });
          const parsedName = a32(mayHaveAlias);
          this.id = id;
          this.name = parsedName.name;
          this.alias = parsedName.alias;
          this.scope = new Scope;
          this.exposed = null;
      }
      x88() {
          return this.name;
      }
      e100() {
          return this.id;
      }
      a86() {
          return this.scope;
      }
      a70(scope) {
          this.scope = scope;
      }
      a72(object) {
          if (this.exposed === null) {
              this.exposed = object;
          }
      }
      a71() {
          return this.exposed;
      }
      a79() {
          return this.alias;
      }
  }
  /**
   * The `PluncElement` class provides a wrapper around the Element object,
   * offering additional abstraction for managing states, scope, and other
   * non-default features.
   */
  class PluncElement {
      /**
       * @param element - The Element
       * @param pcount - The number of iteration of parent created
       */
      constructor(element, pcount = null) {
          /**
           * A reference to the element itself.
           * (Shouldn't be minified, as publicly-accessible)
           */
          Object.defineProperty(this, "$element", {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0
          });
          /**
           * A reference to parent element, wrapped in this `PluncElement` object
           * (Shouldn't be minified, as publicly-accessible)
           */
          Object.defineProperty(this, "$parent", {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0
          });
          /** The state of the element */
          Object.defineProperty(this, "state", {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0
          });
          /** The scope/context this element belongs to */
          Object.defineProperty(this, "scope", {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0
          });
          this.$element = element;
          this.state = null;
          this.e73(pcount !== null && pcount !== void 0 ? pcount : 1);
      }
      /** Wraps the parent element within `PluncElement` object */
      e73(count) {
          const parentElement = this.$element.parentElement;
          if (count > 3 || parentElement === null)
              return;
          this.$parent = new PluncElement(parentElement, count++);
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
          return this.$element.className.split(' ');
      }
      removeClass(className) {
          this.$element.classList.remove(className);
      }
      toggleClass(className) {
          const classes = this.listClass();
          for (var i = 0; i < classes.length; i++) {
              let aclass = classes[i];
              (aclass === className) ?
                  this.removeClass(className) :
                  this.addClass(className);
          }
      }
  }
  /**
   * A dictionary of handlers of components, services,
   * factories, and helpers.
   */
  class Library {
      constructor() {
          Object.defineProperty(this, "handlers", {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0
          });
          this.handlers = {};
      }
      a84(name, type, handler) {
          const namespace = this.a77(type, name);
          this.handlers[namespace] = handler;
      }
      a77(type, name) {
          return `${type}.${name}`;
      }
      e76(name) {
          const namespace = this.a77('component', name);
          return this.handlers[namespace];
      }
      e92(name) {
          var _a;
          const namespace = this.a77('service', name);
          return ((_a = this.handlers[namespace]) !== null && _a !== void 0 ? _a : null);
      }
      x93(name) {
          var _a;
          const namespace = this.a77('factory', name);
          return ((_a = this.handlers[namespace]) !== null && _a !== void 0 ? _a : null);
      }
      x98(name) {
          var _a;
          const namespace = this.a77('helper', name);
          return ((_a = this.handlers[namespace]) !== null && _a !== void 0 ? _a : null);
      }
  }
  /**
   * A record of components referenced by their IDs
   * of their parents, children, and siblings
  */
  class Lineage {
      constructor() {
          Object.defineProperty(this, "genealogy", {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0
          });
          this.genealogy = {};
      }
      /**
       * In genealogy, "begat" is an archaic term commonly used in historical
       * texts to indicate parentage, specifically that a man fathered a child.
       * Similarly, this function registers lineage of parent component and its
       * child components.
       * @param parent
       * @param child
       * @returns
       */
      begat(parent, child) {
          if (this.genealogy[parent] === undefined) {
              this.genealogy[parent] = {
                  parent: null,
                  children: []
              };
          }
          if (child === null)
              return;
          this.genealogy[parent].children.push(child);
          if (this.genealogy[child] === undefined) {
              this.genealogy[child] = {
                  parent: parent,
                  children: []
              };
          }
      }
      /**
       * This method lists all the parents, and the parents of the parents
       * of the child component in a form of array of Component Ids.
       * @param child
       * @returns
       */
      lookup(child) {
          if (this.genealogy[child] === undefined)
              return [];
          const parents = [];
          let parent = this.genealogy[child].parent;
          while (parent !== null) {
              parents.push(parent);
              parent = this.genealogy[parent].parent;
          }
          return parents;
      }
      children(parent) {
          if (this.genealogy[parent] === undefined)
              return [];
          const children = [];
          return this.genealogy[parent].children;
      }
      parent(child) {
          if (this.genealogy[child] === undefined)
              return null;
          return this.genealogy[child].parent;
      }
  }
  
  
  
  class PluncApp {
      constructor(name, id, configuration) {
          Object.defineProperty(this, "id", {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0
          });
          Object.defineProperty(this, "name", {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0
          });
          Object.defineProperty(this, "config", {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0
          });
          Object.defineProperty(this, "library", {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0
          });
          Object.defineProperty(this, "registry", {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0
          });
          Object.defineProperty(this, "api", {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0
          });
          Object.defineProperty(this, "ready", {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0
          });
          this.name = name;
          this.id = id;
          this.config = configuration;
          this.library = new Library;
          this.registry = new Registry;
          this.api = new ApplicationAPI;
          this.ready = false;
      }
      a97() {
          return this.config;
      }
      e91() {
          return this.library;
      }
      x80() {
          return this.registry;
      }
      x88() {
          return this.name;
      }
      e100() {
          return this.id;
      }
      a95() {
          return this.api;
      }
      x87() {
          this.ready = true;
      }
      a89() {
          return this.ready;
      }
  }
  class Registry {
      constructor() {
          Object.defineProperty(this, "data", {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0
          });
          this.data = {};
      }
      a84(id, object) {
          this.data[id] = object;
      }
      e85(ids) {
          const components = [];
          for (const id in this.data) {
              if (ids.includes(id)) {
                  components.push(this.data[id]);
              }
          }
          return components;
      }
      e90(id) {
          var _a;
          return (_a = this.data[id]) !== null && _a !== void 0 ? _a : null;
      }
      e99() {
          return this.data;
      }
  }
  
  var Resolver;
  (function (Resolver) {
      /**
       * Resolves an expression based on a given object
       * @param object baseObj
       * @param string expression
       *
       * @returns the value of the resolved expression
       */
      Resolver.a33 = (scope, expression, element = null) => {
          const resolveType = Resolver.x52(expression);
          return x94(scope, expression, resolveType, element);
      };
      /**
       * Determines the type of an expression
       * @param string expression
       * @returns type of expression
       *
       * @NOTE: the expression should always have to be a string!
       */
      Resolver.x52 = (expression) => {
          if (/^'.*'$/.test(expression))
              return 'string';
          if (!isNaN(expression))
              return 'number';
          if (expression.includes('(') && expression.includes('=='))
              return 'conditional';
          if (expression.includes('(') && expression.includes('is '))
              return 'conditional';
          if (expression.includes('(') && expression.includes('>'))
              return 'conditional';
          if (expression.includes('(') && expression.includes('<'))
              return 'conditional';
          if (expression.includes('('))
              return 'function';
          if (expression.includes('=='))
              return 'conditional';
          if (expression.includes('is '))
              return 'conditional';
          if (expression.includes('>'))
              return 'conditional';
          if (expression.includes('<'))
              return 'conditional';
          if (expression.includes('+') ||
              expression.includes('-') ||
              expression.includes('/') ||
              expression.includes('*') ||
              expression.includes('%')) {
              return 'operation';
          }
          if (expression == 'false' || expression == 'true' || expression == 'null') {
              return 'boolean';
          }
          return 'object';
      };
      const x94 = (scope, expression, resolveType, element = null) => {
          switch (resolveType) {
              case 'string':
                  return expression.slice(1, -1);
                  break;
              case 'boolean':
                  if (expression == 'true')
                      return true;
                  if (expression == 'false')
                      return false;
                  if (expression == 'null')
                      return null;
                  break;
              case 'object':
                  return a74(scope, expression);
                  break;
              case 'function':
                  let structure = expression.split('(');
                  /** Checks to see if structure of a function resembles an object **/
                  let expressionTest = structure[0].split('.');
                  /** If the said function is a method of an object **/
                  if (expressionTest.length > 1) {
                      let refObject = Resolver.a33(scope, a26(structure[0]));
                      let funcExpression = expression.split('.')
                          .slice(((expressionTest.length) - 1))
                          .join('.');
                      return x53(refObject, scope, funcExpression, element);
                  }
                  if (!scope.hasOwnProperty(structure[0])) {
                      return '';
                  }
                  return x53(scope, scope, expression, element);
                  break;
              case 'conditional':
                  const evaluatorMap = {
                      '!==': e5,
                      '==': x9,
                      'is not ': e5,
                      'is ': x9,
                      '>=': a3,
                      '>': a14,
                      '<=': e6,
                      '<': x27
                  };
                  for (const comparator in evaluatorMap) {
                      if (expression.includes(comparator)) {
                          return evaluatorMap[comparator](scope, expression, comparator);
                      }
                  }
                  return false;
                  break;
              case 'number':
                  return Number(expression);
                  break;
              case 'operation':
                  let finalExpression = expression;
                  let operations = ['+', '-', '*', '/', '%'];
                  for (var i = 0; i < operations.length; i++) {
                      if (expression.includes(operations[i])) {
                          let exp = expression.split(operations[i]);
                          let left = Resolver.a33(scope, exp[0].trim());
                          var right = Resolver.a33(scope, exp[1].trim());
                          finalExpression = left + operations[i] + right;
                      }
                  }
                  return eval(finalExpression);
                  break;
              default:
                  break;
          }
      };
      const a74 = (scope, expression) => {
          if (expression === '$scope') {
              return scope;
          }
          return expression.split('.').reduce(function (o, x) {
              if (o === undefined)
                  return;
              if (o === null)
                  return;
              if (o[x] === undefined)
                  return;
              return o[x];
          }, scope);
      };
      /**
       * Invokes/calls a given function based on the function expression
       *
       * @param object refObject - The object where the function to invoke is a member of
       * @param object argScope - The object where we can reference the argument expression
       * of the function to invoke
       * @param string functionExpression - The function expression, for example
       * myFunction(arg)
       */
      const x53 = (scope, object, expression, element) => {
          /**
           * @TODO Need to check cases where this returns undefined
           * One example,this returns undefined in cases when the
           * repeats are nested together
           */
          if (scope === undefined)
              return '';
          /** Parses function structure **/
          const splitExpression = expression.match(/\(([^)]+)\)/);
          let struct = expression.split('(');
          let name = struct[0];
          /** If function has an argument */
          if (splitExpression !== null) {
              const argsVault = new Array;
              const splitArguments = splitExpression[1].split(',');
              for (let i = 0; i < splitArguments.length; i++) {
                  argsVault.push(Resolver.a33(object, splitArguments[i]));
              }
              if (element !== null) {
                  argsVault.push(new PluncElement(element));
              }
              // Checks if the given is a function
              if (!(scope[name] instanceof Function)) {
                  return '';
              }
              return scope[name](...argsVault);
          }
          // When there is no argument added to the function, and
          // if there is an element passed to the Resolver
          // that means that we need to add the element as one of the
          // arguments of the referenced function to call
          if (element !== null) {
              // Function argument holder
              const argsVault = new Array;
              argsVault.push(new PluncElement(element));
              return scope[name](...argsVault);
          }
          if (!(scope[name] instanceof Function)) {
              return '';
          }
          // If it has no argument, and no Element object is required to
          // be passed as argument to the referenced function to call
          return scope[name]();
      };
      const a26 = (expression) => {
          let pieces = expression.split('.');
          if (pieces.length < 2)
              return '$scope';
          pieces.pop();
          return pieces.join('.');
      };
      Resolver.x19 = (base, expression) => {
          const parentObjExp = a26(expression);
          return Resolver.a33(base, parentObjExp);
      };
      Resolver.a34 = (expression) => {
          let pieces = expression.split('.');
          return pieces[pieces.length - 1];
      };
      const x9 = (scope, expression, comparator) => {
          const [left, right] = expression.split(comparator).map(arm => {
              return Resolver.a33(scope, arm.trim());
          });
          return (left === right);
      };
      const e5 = (scope, expression, comparator) => {
          const [left, right] = expression.split(comparator).map(arm => {
              return Resolver.a33(scope, arm.trim());
          });
          return (left !== right);
      };
      const a14 = (scope, expression, comparator) => {
          const [left, right] = expression.split(comparator).map(arm => {
              return Resolver.a33(scope, arm.trim());
          });
          return (left > right);
      };
      const a3 = (scope, expression, comparator) => {
          const [left, right] = expression.split(comparator).map(arm => {
              return Resolver.a33(scope, arm.trim());
          });
          return (left >= right);
      };
      const x27 = (scope, expression, comparator) => {
          const [left, right] = expression.split(comparator).map(arm => {
              return Resolver.a33(scope, arm.trim());
          });
          return (left < right);
      };
      const e6 = (scope, expression, comparator) => {
          const [left, right] = expression.split(comparator).map(arm => {
              return Resolver.a33(scope, arm.trim());
          });
          return (left <= right);
      };
  })(Resolver || (Resolver = {}));
  /**
   * The scope object
   */
  class Scope {
      constructor() {
      }
  }
  class Service {
  }
  
  
  
  const a64 = (element, component, instance) => {
      return new Promise(async (resolve, reject) => {
          try {
              const attribute = CHECK_ELEMENT_ATTR;
              const nodes = XAttr.a31(element, instance, attribute);
              for (let i = 0; i < nodes.length; i++) {
                  const node = nodes[i];
                  if (e47(node, instance))
                      continue;
                  const argument = XAttr.x82(node, instance, attribute);
                  const scope = component.a86();
                  if (scope === null || argument === null || argument.trim() === '')
                      continue;
                  const evaluated = Resolver.a33(scope, argument);
                  if (typeof evaluated === 'boolean') {
                      evaluated ? node.setAttribute('checked', '') : node.removeAttribute('checked');
                  }
                  a68(node, instance);
              }
              resolve();
          }
          catch (error) {
              reject(error);
          }
      });
  };
  
  
  
  const x28 = (element, component, instance) => {
      return new Promise(async (resolve, reject) => {
          try {
              const attr = IF_ELEMENT_ATTR;
              /** Retrieving all elements with ifs conditional */
              const nodes = XAttr.a31(element, instance, attr);
              for (let i = 0; i < nodes.length; i++) {
                  const node = nodes[i];
                  if (!e47(node, instance)) {
                      const condition = XAttr.x82(node, instance, attr);
                      const scope = component.a86();
                      if (scope === null || condition === null)
                          continue;
                      const result = Resolver.a33(scope, condition);
                      if (typeof result === 'boolean' && !result) {
                          x51(node, 'false');
                      }
                      a68(node, instance);
                  }
              }
              resolve();
          }
          catch (error) {
              reject(error);
          }
      });
  };
  
  
  
  const e54 = (element, component, instance) => {
      return new Promise(async (resolve, reject) => {
          try {
              const attribute = DISABLE_ELEMENT_ATTR;
              const nodes = XAttr.a31(element, instance, attribute);
              for (let i = 0; i < nodes.length; i++) {
                  const node = nodes[i];
                  if (e47(node, instance))
                      continue;
                  const argument = XAttr.x82(node, instance, attribute);
                  const scope = component.a86();
                  if (scope === null || argument === null || argument.trim() === '')
                      continue;
                  const evaluated = Resolver.a33(scope, argument);
                  if (typeof evaluated === 'boolean') {
                      evaluated ? node.setAttribute('disabled', 'true') : node.removeAttribute('disabled');
                  }
                  a68(node, instance);
              }
              resolve();
          }
          catch (error) {
              reject(error);
          }
      });
  };
  
  
  
  /**
   * This function adds event listener to elements which is bound to a function
   * within the component scope
   */
  const e29 = (scope, bindToElement, fnExpression, eventType) => {
      if (Resolver.x52(fnExpression) !== 'function')
          return;
      bindToElement.addEventListener(eventType, () => {
          Resolver.a33(scope, fnExpression, bindToElement);
      });
  };
  const a65 = (element, component, instance) => {
      return new Promise(async (resolve, reject) => {
          try {
              const events = [
                  { type: 'click', attr: CLICK_EVENT_ATTR },
                  { type: 'change', attr: CHANGE_EVENT_ATTR },
                  { type: 'keyup', attr: TOUCH_EVENT_ATTR }
              ];
              for (let i = 0; i < events.length; i++) {
                  const event = events[i];
                  const nodes = XAttr.a31(element, instance, event.attr);
                  for (let k = 0; k < nodes.length; k++) {
                      const node = nodes[k];
                      const fnExpression = XAttr.x82(node, instance, event.attr);
                      if (a18(node, event.type, instance))
                          continue;
                      const scope = component.a86();
                      if (scope === null || fnExpression == null)
                          continue;
                      e29(scope, node, fnExpression, event.type);
                      x37(node, event.type, instance);
                  }
              }
              resolve();
          }
          catch (error) {
              reject(error);
          }
      });
  };
  
  
  
  
  
  
  
  
  const x62 = (element, component, instance, skipEvents = false) => {
      return new Promise(async (resolve, reject) => {
          try {
              await e59(element, component, instance);
              await x28(element, component, instance);
              await e30(element, component, instance);
              await a64(element, component, instance);
              await a66(element, component, instance);
              await e67(element, component, instance);
              await e54(element, component, instance);
              if (!skipEvents) {
                  await a65(element, component, instance);
              }
              resolve();
          }
          catch (error) {
              reject(error);
          }
      });
  };
  
  
  /**
   * The HTML5 <input type="date"> element typically returns
   * the date value as a string in the YYYY-MM-DD format.
   * This behavior is part of the HTML5 specification,
   * and most modern browsers adhere to this standard.
   * @param date - supposedly date in YYYY-MM-DD format
   */
  function a38(date) {
      var _a, _b, _c;
      const message = `models assigned to Date input elements `
          + `must follow standard HTML5 format YYYY-MM-DD`;
      const structure = date.split('-');
      const year = (_a = structure[0]) !== null && _a !== void 0 ? _a : null;
      if (year === null || year.length < 4) {
          throw new Error(message);
      }
      const month = (_b = structure[1]) !== null && _b !== void 0 ? _b : null;
      if (month === null || parseInt(month) > 12) {
          throw new Error(month);
      }
      const day = (_c = structure[2]) !== null && _c !== void 0 ? _c : null;
      if (day === null || parseInt(day) > 31) {
          throw new Error(day);
      }
  }
  /**
   * For the HTML5 <input type="time"> element, the standard format
   * for the value returned is HH:MM, where HH is the hour in
   * 24-hour format (00-23) and MM is the minutes (00-59).
   * This format is specified by the HTML5 standard
   * and is supported by most modern browsers.
   * @param time - supposedly date in HH:MM format
   */
  function a39(time) {
      var _a, _b;
      const message = `models assigned to Time input elements `
          + `must follow standard HTML5 format HH:MM`;
      const structure = time.split(':');
      const hours = (_a = structure[0]) !== null && _a !== void 0 ? _a : null;
      if (hours === null || hours.length < 2 || (parseInt(hours) > 23)) {
          throw new Error(message);
      }
      const minutes = (_b = structure[1]) !== null && _b !== void 0 ? _b : null;
      if (minutes === null || minutes.length < 2 || parseInt(minutes) > 59) {
          throw new Error(message);
      }
  }
  const a40 = (scope, expression, value) => {
      const parentObj = Resolver.x19(scope, expression);
      const childObjExpression = Resolver.a34(expression);
      if (undefined !== parentObj)
          parentObj[childObjExpression] = value;
  };
  const e41 = (element, state) => {
      (typeof state == 'boolean' && state) ?
          element.setAttribute('checked', '') :
          element.removeAttribute('checked');
  };
  const a55 = () => {
      const date = new Date(Date.now());
      const nmonth = (date.getMonth() + 1);
      const month = (nmonth < 10) ? `0${nmonth}` : nmonth;
      const result = `${date.getFullYear()}-${month}-${date.getDate()}`;
      a38(result);
      return result;
  };
  const x56 = () => {
      const input = new Date(Date.now());
      const hours = (input.getHours() < 10) ? `0${input.getHours()}` : input.getHours();
      const minutes = (input.getMinutes() < 10) ? `0${input.getMinutes()}` : input.getMinutes();
      const result = hours + ':' + minutes;
      a39(result);
      return result;
  };
  const e67 = (element, component, instance) => {
      return new Promise(async (resolve, reject) => {
          try {
              const attribute = MODEL_ELEMENT_ATTR;
              const nodes = XAttr.a31(element, instance, attribute);
              for (let i = 0; i < nodes.length; i++) {
                  const node = nodes[i];
                  if (node === null)
                      continue;
                  const argument = XAttr.x82(node, instance, attribute);
                  const scope = component.a86();
                  if (scope === null || argument === null || argument.trim() === '')
                      continue;
                  const evaluated = Resolver.a33(scope, argument);
                  let IsValueTypeOfString = true;
                  if (node.tagName === 'INPUT' || node.tagName === 'SELECT') {
                      if ((node instanceof HTMLInputElement)) {
                          const type = node.type;
                          /** Radio buttons and checkboxes */
                          if (type === 'radio' || type === 'checkbox') {
                              IsValueTypeOfString = false;
                              (evaluated === undefined) ?
                                  a40(scope, argument, false) :
                                  e41(node, evaluated);
                          }
                          /** Text inputs, but not textarea */
                          if (type === 'text' || type === 'password' || type === ' email') {
                              (evaluated === undefined) ?
                                  a40(scope, argument, node.value) :
                                  node.value = evaluated;
                          }
                          /**
                           * Input type number value is always typeof string natively
                           */
                          if (type === 'number') {
                              let value = evaluated;
                              if (evaluated === undefined) {
                                  value = '0';
                              }
                              a40(scope, argument, value);
                              node.value = value;
                          }
                          /** Date input */
                          if (type === 'date') {
                              /** When evaluated is undefined, we will assign Date today */
                              let inputDate = a55();
                              if (evaluated !== undefined) {
                                  a38(evaluated);
                                  inputDate = evaluated;
                              }
                              else {
                                  a40(scope, argument, inputDate);
                              }
                              node.value = inputDate;
                          }
                          /** Time input */
                          if (type === 'time') {
                              /** When evaluated is undefined, we will assign Date today */
                              let inputTime = x56();
                              if (evaluated !== undefined) {
                                  a39(evaluated);
                                  inputTime = evaluated;
                              }
                              else {
                                  a40(scope, argument, inputTime);
                              }
                              node.value = inputTime;
                          }
                      }
                      /** Select element */
                      if ((node instanceof HTMLSelectElement)) {
                          (evaluated === undefined) ?
                              a40(scope, argument, node.value) :
                              node.value = evaluated;
                      }
                      node.addEventListener('change', (event) => {
                          const target = event.target;
                          if (target instanceof HTMLInputElement) {
                              const value = (IsValueTypeOfString) ? target.value : target.checked;
                              a40(scope, argument, value);
                          }
                          if (target instanceof HTMLSelectElement) {
                              a40(scope, argument, target.value);
                          }
                      });
                  }
                  else if (node.tagName === 'TEXTAREA' && node instanceof HTMLTextAreaElement) {
                      (evaluated === undefined) ?
                          a40(scope, argument, node.value) :
                          node.value = evaluated;
                      node.addEventListener('change', (event) => {
                          const target = event.target;
                          if (!(target instanceof HTMLTextAreaElement))
                              return;
                          const value = target.value;
                          a40(scope, argument, value);
                      });
                  }
              }
              resolve();
          }
          catch (error) {
              reject(error);
          }
      });
  };
  
  const e30 = (element, component, instance) => {
      return new Promise(async (resolve, reject) => {
          try {
              const regularExp = /(?<=\{{).+?(?=\}})/g;
              let template = element.innerHTML;
              element.innerHTML = '';
              /** Match all regex in the innerHTML string of the element **/
              const placeholders = template.match(regularExp);
              /** When there are matches */
              if (placeholders !== null) {
                  for (let i = 0; i < placeholders.length; i++) {
                      const scope = component.a86();
                      if (scope === null)
                          continue;
                      let resolvedExp = Resolver.a33(scope, placeholders[i].trim());
                      if (resolvedExp === undefined) {
                          resolvedExp = '';
                      }
                      template = template.replace('{{' + placeholders[i] + '}}', resolvedExp);
                  }
              }
              element.innerHTML = template;
              resolve();
          }
          catch (error) {
              reject(error);
          }
      });
  };
  
  
  
  
  
  /**
   * Dissects repeat expression into two parts, refObjName and aliasObjName.
   * For example, `users as user` will be dissected
   * into `['users', 'user']`. Similarly, `item until 3`
   * will be dissected into `['item', 3]`
   * @param expression
   * @returns
   */
  const x35 = (expression) => {
      if (expression.includes('until ')) {
          return [
              REPEAT_REFERENCE_TOKEN,
              expression.split('until')[1].trim()
          ];
      }
      return [
          expression.split(' as ')[0].trim(),
          expression.split(' as ')[1].trim()
      ];
  };
  const a22 = (repetitions) => {
      if (repetitions instanceof Array)
          return repetitions.length;
      if (typeof repetitions === 'number' && Number.isInteger(repetitions))
          return repetitions;
      throw new Error(`repeatable elements must have repeatable values`);
  };
  /**
   * This function simply checks if a value is iterable
   * with `Object.entries`.
   * @param value
   */
  const a15 = (value) => {
      return value !== null && (typeof value === 'object' || Array.isArray(value));
  };
  const e59 = (element, component, instance) => {
      return new Promise(async (resolve, reject) => {
          try {
              /** Retrieving all repeatable elements */
              const repeatables = XAttr.a31(element, instance, REPEAT_ELEMENT_ATTR);
              const scope = component.a86();
              if (scope === null)
                  return resolve();
              for (let i = 0; i < repeatables.length; i++) {
                  const repeatable = repeatables[i];
                  const template = repeatable.innerHTML;
                  repeatable.innerHTML = '';
                  let expression = XAttr.x82(repeatable, instance, REPEAT_ELEMENT_ATTR);
                  if (expression === null || expression.trim() === '')
                      continue;
                  let [refObjName, aliasObjName] = x35(expression);
                  if (refObjName === REPEAT_REFERENCE_TOKEN) {
                      /** This creates a new object that we can loop through **/
                      let repetitions = Resolver.a33(scope, aliasObjName);
                      /** How many repitions to be made */
                      let times = a22(repetitions);
                      scope['$$index'] = {};
                      let k = 0;
                      while (k < times)
                          scope['$$index']['props' + (k++)] = new Object;
                  }
                  const repeatableObj = Resolver.a33(scope, refObjName);
                  if (a15(repeatableObj)) {
                      let indexNumber = 0;
                      for (const [key, value] of Object.entries(repeatableObj)) {
                          /** Creating an invidual component for each repititions **/
                          const id = 'any';
                          let dummy = new Component(id, 'any');
                          dummy.a70({
                              $parent: scope,
                              $index: indexNumber++,
                              [aliasObjName]: repeatableObj[key]
                          });
                          const child = x44();
                          child.innerHTML = template;
                          await x62(child, dummy, instance, true);
                          a46(child, repeatable);
                      }
                  }
              }
              resolve();
          }
          catch (error) {
              reject(error);
          }
      });
  };
  
  
  
  /**
   * Collects all elements with the `plunc-style` attribute and evaluates the
   * expression provided as the attribute's value. The resulting string is
   * then added to the class list of each element.
   *
   * @example
   * `$scope.printClassNames = () => 'font-3'`
   * `<div plunc-style="printClassNames()">Hello world</div>`
   *
   * will result to:
   * `<div plunc-style="printClassNames()" class="font-3">Hello world</div>`
   *
   * @param element
   * @param component
   * @param instance
   */
  const a66 = (element, component, instance) => {
      return new Promise(async (resolve, reject) => {
          try {
              const attribute = STYLE_ELEMENT_ATTR;
              const nodes = XAttr.a31(element, instance, attribute);
              for (let i = 0; i < nodes.length; i++) {
                  const node = nodes[i];
                  if (e47(node, instance))
                      continue;
                  const argument = XAttr.x82(node, instance, attribute);
                  const scope = component.a86();
                  if (scope === null || argument === null || argument.trim() === '')
                      continue;
                  const evaluated = Resolver.a33(scope, argument);
                  if (evaluated !== null && evaluated !== '' && evaluated !== undefined) {
                      node.classList.add(evaluated);
                  }
                  a68(node, instance);
              }
              resolve();
          }
          catch (error) {
              reject(error);
          }
      });
  };
  
  
  
  
  
  
  
  
  
  
  
  
  
  /**
   * Stores all created PluncApp instances
   */
  const instances = [];
  /**
   * This value increments, serving as the unique id
   * of the PluncApp instance.
   */
  let instanceId = 0;
  /**
   * Attached to the window object to provide a simple interface to interact with
   * the Plunc library code. It allows for creating instances of the app, managing
   * components, and more. This aims to simplify and provide a clean and intuitive
   * interface for working with the application.
   */
  const AppPublicAPI = {
      create: (applName, config = null) => {
          const reqConf = a63(config);
          const instance = new PluncApp(applName, instanceId++, reqConf);
          instances.push(instance);
          return {
              /**
               * @see PluncAppInstance.component for definition
               * @param name
               * @param handler
               */
              component: (name, handler) => {
                  instance.e91()
                      .a84(name, 'component', handler);
              },
              /**
               * @see PluncAppInstance.service for definition
               * @param name
               * @param handler
               */
              service: (name, handler) => {
                  instance.e91()
                      .a84(name, 'service', handler);
              },
              /**
               * @see PluncAppInstance.factory for definition
               * @param name
               * @param handler
               */
              factory: (name, handler) => {
                  instance.e91()
                      .a84(name, 'factory', handler);
              },
              /**
               * @see PluncAppInstance.helper for definition
               * @param name
               * @param handler
               */
              helper: (name, handler) => {
                  instance.e91()
                      .a84(name, 'helper', handler);
              }
          };
      }
  };
  /**
   * Attached to the window object to provide a simple interface to interact with
   * the Plunc library code. It allows for creating instances of the app, managing
   * components, and more. This aims to simplify and provide a clean and intuitive
   * interface for working with the application.
   */
  const plunc = window['plunc'] = AppPublicAPI;
  DOMHelper.ready(async () => {
      for (let i = 0; i < instances.length; i++) {
          const instance = instances[i];
          try {
              const name = instance.x88();
              const shouldProceed = await a69(instance);
              if (!shouldProceed)
                  continue;
              /**
               * Creating a new document object where we operate on
               * templates and render all components.
               */
              const implementation = (document.implementation.createHTMLDocument(name));
              implementation.body.innerHTML = x83(instance, name);
              /**
               * Compiling all the components in the app template, as well
               * as the dependencies of these components.
               */
              const cAttr = XAttr.e96(COMPONENT_ELEMENT_ATTR, instance);
              const cEls = implementation.body.querySelectorAll(`[${cAttr}]`);
              let cId = 0;
              /** Creating a new lineage of components */
              const lineage = new Lineage();
              let compiledHtml = '';
              for (let j = 0; j < cEls.length; j++) {
                  const cEl = cEls[j];
                  const cNameMayHaveAlias = XAttr.x82(cEl, instance, COMPONENT_ELEMENT_ATTR);
                  /**
                   * Component without names will not be rendered
                   */
                  if (cNameMayHaveAlias === null)
                      continue;
                  /** Component IDs would have to be embedded to the plunc-id attribute */
                  const cElId = a45(instance, cId++);
                  const cElAttr = XAttr.e96('id', instance);
                  cEl.setAttribute(cElAttr, cElId);
                  lineage.begat(cElId, null);
                  /** Registering the component object */
                  const cObject = new Component(cElId, cNameMayHaveAlias);
                  instance.x80().a84(cElId, cObject);
                  /**
                   * Retrieving component templates, as well as the templates of their dependencies,
                   * and the dependencies of their dependencies.
                   */
                  cEl.innerHTML = await e50(cElId, cEl, instance, lineage);
              }
              /** All registered components */
              const cRegistered = instance.x80().e99();
              for (const id in cRegistered) {
                  await e10(cRegistered[id], instance, lineage);
              }
              const appEl = x44();
              appEl.innerHTML = implementation.body.innerHTML;
              for (const id in cRegistered) {
                  const component = cRegistered[id];
                  if (!(component instanceof Component))
                      continue;
                  const cId = component.e100();
                  const targetEl = XAttr.x43(appEl, instance, cId);
                  /**
                   * This happens for the following circumstances:
                   * - When the component is added inside an xif element
                   */
                  if (targetEl === null)
                      continue;
                  const tempEl = x44();
                  tempEl.innerHTML = targetEl.innerHTML;
                  a16(tempEl, lineage.children(cId), instance);
                  await x62(tempEl, component, instance);
                  x36(tempEl, targetEl, instance, lineage.children(cId));
              }
              const appElement = e48(instance);
              a46(appEl, appElement);
              instance.x87();
              const readys = instance.a95().a60('ready');
              for (let o = 0; o < readys.length; o++) {
                  readys[o]();
              }
          }
          catch (error) {
              const message = `plunc.js error: ${error.message}`;
              error.message = message;
              console.error(error);
          }
      }
  });
  })();
  