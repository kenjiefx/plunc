/*
==========================================
Plunc JS (Beta Version 0.7.22)
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



(() => {

  /**
   * Returns the element within the DOM body with the attribute
   * `plunc-app`, or depending of what prefix being used
   */
  const x47 = (instance) => {
      const name = `${instance.x86()}`;
      const selector = `
  [${XAttr.a41(APP_ATTR, instance, name)}]
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
      a59(key) {
          var _a;
          return (_a = this.listeners[key]) !== null && _a !== void 0 ? _a : [];
      }
  }
  const x48 = (instance) => {
      return instance.x93();
  };



  const e77 = (component, instance, name, callback) => {
      if (!instance.x87()) {
          throw new Error(`cannot use $block outside $app.ready`);
      }
      const blockAttribute = XAttr.a41(BLOCK_ELEMENT_ATTR, instance, name);
      const cElement = XAttr.x42(x47(instance), instance, component.e98());
      if (cElement === null) {
          throw new Error('unknown component element');
      }
      const refAttribute = XAttr.a41(ELEMENT_REFERENCE_ATTR, instance, component.e98());
      const blocks = cElement.querySelectorAll(`[${blockAttribute}][${refAttribute}]`);
      for (let i = 0; i < blocks.length; i++) {
          callback(new PluncElement(blocks[i]));
      }
  };
  const e23 = () => {
      return {};
  };


  const a74 = (component, lineage, instance) => {
      const parentid = lineage.parent(component.e98());
      if (parentid === null)
          return null;
      const parent = instance.x78().e88(parentid);
      if (parent === null)
          return null;
      if (!(parent instanceof Component))
          return null;
      const wrapper = {};
      wrapper[parentid] = parent;
      return e24(wrapper);
  };




  const e79 = (component, instance, lineage, block = null) => {
      return new Promise(async (resolve, reject) => {
          try {
              if (!instance.x87()) {
                  throw new Error(`cannot use $patch outside $app.ready`);
              }
              let mode = 'component';
              let patchableNodes = [XAttr.x42(x47(instance), instance, component.e98())];
              if (block !== null) {
                  mode = 'block';
                  const elementsButNotChild = x1(XAttr.a41(BLOCK_ELEMENT_ATTR, instance, block), component, lineage, instance);
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
                  let elementBindFrom = e43();
                  if (mode === 'component') {
                      elementBindFrom.innerHTML = await a49(component.e98(), elementBindTo, instance, lineage);
                  } else {
                      if (block === null)
                          continue;
                      const template = a56(instance, component.x86(), block);
                      if (template === null)
                          continue;
                      elementBindFrom.innerHTML = template;
                  }
                  e15(elementBindFrom, lineage.children(component.e98()), instance);
                  await a60(elementBindFrom, component, instance);
                  if (elementBindTo === null)
                      continue;
                  const childIds = lineage.children(component.e98());
                  e35(elementBindFrom, elementBindTo, instance, childIds);
                  /**
                   * Find all unrendered child component. This happens usually because of
                   * conditional statements such xif
                   */
                  for (let k = 0; k < childIds.length; k++) {
                      const childId = childIds[k];
                      const childComponent = XAttr.x42(elementBindTo, instance, childId);
                      if (childComponent === null)
                          continue;
                      if (childComponent.innerHTML.trim() === '') {
                          await e3(childComponent, instance.x78().e88(childId), lineage, instance);
                      }
                  }
              }
              resolve();
          } catch (error) {
              console.error(`plunc.js $patch error: ${error.message}`);
              reject(error);
          }
      });
  };
  const e3 = (elementToBindTo, component, lineage, instance) => {
      return new Promise(async (resolve, reject) => {
          try {
              const elementBindFrom = e43();
              elementBindFrom.innerHTML = await a49(component.e98(), elementToBindTo, instance, lineage);
              await a60(elementBindFrom, component, instance);
              const childIds = lineage.children(component.e98());
              for (let i = 0; i < childIds.length; i++) {
                  const childId = childIds[i];
                  const childComponent = XAttr.x42(elementBindFrom, instance, childId);
                  if (childComponent !== null) {
                      await e3(childComponent, instance.x78().e88(childId), lineage, instance);
                  }
              }
              e35(elementBindFrom, elementToBindTo, instance, childIds);
              resolve();
          } catch (error) {
              reject(error);
          }
      });
  };
  var XAttr;
  (function(XAttr) {
      /**
       * Creates a component attribute with value. Example: `xcomponent="@ComponentName"`
       */
      XAttr.x75 = (name, instance) => {
          const prefix = instance.x94().prefix;
          return `${prefix}${COMPONENT_ELEMENT_ATTR}="@${name}"`;
      };
      /**
       * Creates an attribute with any key. Example: `xsomekeyhere`
       */
      XAttr.a95 = (key, instance) => {
          const prefix = instance.x94().prefix;
          return `${prefix}${key}`;
      };
      /**
       * Creates an attribute with any key, with any value. Example: `xsomekeyhere="value"`
       */
      XAttr.a41 = (key, instance, value) => {
          const prefix = instance.x94().prefix;
          return `${prefix}${key}="${value}"`;
      };
      XAttr.e80 = (element, instance, key) => {
          const prefix = instance.x94().prefix;
          return element.getAttribute(`${prefix}${key}`);
      };
      XAttr.x42 = (element, instance, cid) => {
          const prefix = instance.x94().prefix;
          const attr = `${prefix}id="${cid}"`;
          return element.querySelector(`[${attr}]`);
      };
      XAttr.a31 = (element, instance, name) => {
          const attr = XAttr.a95(name, instance);
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
  const STRAWBERRY_ID_ATTR = 'id';
  const REPEAT_REFERENCE_TOKEN = '$$index';
  const LOCK_ID_ATTR_KEY = 'set';
  const LOCK_ID_ATTR_VALUE = 'true';
  const EVENT_ELEMENT_ATTR = 'event';
  const ELEMENT_REFERENCE_ATTR = 'rid';
  const a19 = (template) => {
      const chars = template.split('');
      let recLine = '';
      let expEndSymb = false;
      let expCloseTag = false;
      for (let i = 0; i < chars.length; i++) {
          const char = chars[i];
          recLine += char;
          if (char === '<' && !expEndSymb) {
              expEndSymb = true;
          }
          if (char === '>' && expEndSymb) {
              if (recLine.includes('plunc-component')) {
                  console.log(recLine);
                  expEndSymb = false;
                  continue;
              }
              //console.log(recLine)
              recLine = '';
              expEndSymb = false;
          }
      }
  };
  const a66 = (instance, template) => {
      const components = [];
      a19(template);
  };



  const a44 = (instance, id, existing = '') => {
      if (existing !== '') {
          return `${existing}.${id.toString()}`;
      }
      return `${instance.e98().toString()}.${id.toString()}`;
  };
  const a49 = (id, component, instance, lineage) => {
      return new Promise(async (resolve, reject) => {
          try {
              /** First, we'll check if component has declared template */
              const name = XAttr.e80(component, instance, COMPONENT_ELEMENT_ATTR);
              if (name === null)
                  return resolve('');
              /** Get component template */
              const cTempl = e81(instance, name);
              /** Component implementation element */
              const implementation = document.implementation.createHTMLDocument();
              implementation.body.innerHTML = cTempl;
              x6(id, implementation, instance);
              await a57(id, implementation, instance, lineage);
              resolve(implementation.body.innerHTML);
          } catch (error) {
              reject(error);
          }
      });
  };
  const x6 = (id, implementation, instance) => {
      const refAttr = XAttr.a95(ELEMENT_REFERENCE_ATTR, instance);
      const attrList = [BLOCK_ELEMENT_ATTR];
      const allElements = [];
      /** Retrieving all elements with plunc-block */
      attrList.forEach(attr => {
          const elements = Array.from(implementation.body.querySelectorAll(`[${XAttr.a95(attr, instance)}]`));
          for (let i = 0; i < elements.length; i++) {
              const element = elements[i];
              const name = XAttr.e80(element, instance, attr);
              a7(name);
          }
          allElements.push(...elements);
      });
      /** For each named elements, we'll add reference ids */
      allElements.forEach(element => {
          element.setAttribute(refAttr, id);
      });
  };
  const a7 = (name) => {
      const message = `named element name must not be empty or ` +
          `contain invalid characters`;
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
  const a57 = async (parentId, parent, instance, lineage) => {
      return new Promise(async (resolve, reject) => {
          let compiled = '';
          const cattr = COMPONENT_ELEMENT_ATTR;
          const selector = XAttr.a95(cattr, instance);
          const children = parent.querySelectorAll(`[${selector}]`);
          for (let i = 0; i < children.length; i++) {
              const child = children[i];
              /** Child components must have names */
              const name = XAttr.e80(child, instance, cattr);
              if (name === null)
                  continue;
              /** Setting ids to child components */
              const childId = a44(instance, i, parentId);
              child.setAttribute(XAttr.a95('id', instance), childId);
              lineage.begat(parentId, childId);
              const childObj = new Component(childId, name);
              x10(lineage, childObj, instance);
              instance.x78().e82(childId, childObj);
              child.innerHTML = await a49(childId, child, instance, lineage);
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
  const x10 = (lineage, component, instance) => {
      const name = component.x86();
      const idsOfParents = lineage.lookup(component.e98());
      const parents = instance.x78().e83(idsOfParents);
      parents.forEach(parentC => {
          if (parentC.x86() === name) {
              throw new Error(`plunc.js circular dependency of component
      "${name}" detected in registry`);
          }
      });
  };
  const e61 = (config) => {
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
                                  return e77(params.component, params.instance, name, callback);
                              });
                              break;
                          case PATCH_ARGUMENT_KEY:
                              injectables.push((element = null) => {
                                  return e79(params.component, params.instance, params.lineage, element);
                              });
                              break;
                          case PARENT_ARGUMENT_KEY:
                              injectables.push(a74(params.component, params.lineage, params.instance));
                              break;
                          case APP_ARGUMENT_KEY:
                              injectables.push(x48(params.instance));
                              break;
                          case CHILDREN_ARGUMENT_KEY:
                              injectables.push(e23());
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
                  const service = params.instance.a89().x90(dependency);
                  if (service !== null) {
                      const injectable = await a11(dependency, params.instance);
                      injectables.push(injectable);
                      continue;
                  }
                  /**
                   * Next, we'll check if the dependency points to a factory
                   */
                  const factory = params.instance.a89().x91(dependency);
                  if (factory !== null) {
                      const injectable = await e12(dependency, params.instance);
                      injectables.push(injectable);
                      continue;
                  }
                  /**
                   * Next, we'll check if the dependency points to a helper
                   */
                  if (params.type === 'helper' || params.type === 'component') {
                      const helper = params.instance.a89().e96(dependency);
                      if (helper !== null && params.scope !== null) {
                          const injectable = await a16(params.component, params.scope, dependency, params.lineage, params.instance);
                          injectables.push(injectable);
                          continue;
                      }
                  }
                  /**
                   * Lastly, we'll check if the dependency points to a child component
                   */
                  if (params.type === 'component') {
                      const children = params.lineage.children(params.component.e98())
                          .filter(childId => {
                              const child = params.instance.x78().e88(childId);
                              return (child.x86() === dependency);
                          }).map(childId => {
                              return params.instance.x78().e88(childId);
                          });
                      const wrapper = {};
                      for (let i = 0; i < children.length; i++) {
                          const child = children[i];
                          wrapper[child.e98()] = child;
                      }
                      const proxy = e24(wrapper);
                      injectables.push(proxy);
                      continue;
                  }
              }
              resolve(injectables);
          } catch (error) {
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
  const e21 = (handler) => {
      return new Promise(async (resolve, reject) => {
          try {
              const handlerStr = handler.toString().split('{')[0];
              const matchedFn = handlerStr.match(/(?<=\().+?(?=\))/g);
              if (matchedFn === null || /[(={})]/g.test(matchedFn[0])) {
                  return resolve([]);
              }
              resolve(matchedFn[0].split(',').map(item => {
                  return item.trim();
              }));
          } catch (error) {
              reject(error);
          }
      });
  };
  const e24 = (wrapper) => {
      const handler = {
          get: function get(target, name) {
              return function wrap() {
                  const args = Array.prototype.slice.call(arguments);
                  for (const id in target) {
                      const component = target[id];
                      const exposed = component.x70();
                      if (exposed === null) {
                          const name = component.x86();
                          throw new Error(`cannot invoke component` +
                              ` "${name}}" before $app is ready`);
                      }
                      if (!(name in exposed)) {
                          throw new Error(`calling undefined member "${name}" ` +
                              `in component "${component.x86()}"`);
                      }
                      if (exposed[name] instanceof Function) {
                          exposed[name](...args);
                      }
                  }
              };
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
  };
  // From Simon Willison. A safe way to fire onload w/o screwing up everyone else.
  function addLoadEvent(func) {
      var oldonload = window.onload;
      if (typeof window.onload != 'function') {
          window.onload = func;
      } else {
          window.onload = function() {
              // @ts-ignore
              if (oldonload)
                  oldonload();
              func();
          };
      }
  };
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
          (function() {
              if (isReady)
                  return;
              try {
                  // If IE is used, use the trick by Diego Perini
                  // http://javascript.nwbox.com/IEContentLoaded/
                  // @ts-ignore
                  document.documentElement.doScroll("left");
              } catch (error) {
                  setTimeout(arguments.callee, 0);
                  return;
              }
              // and execute any waiting functions
              domReady();
          })();
      if (browser.opera) {
          document.addEventListener("DOMContentLoaded", function() {
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
          (function() {
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
  };
  // This is the public function that people can use to hook up ready.
  const DOMHelper = {
      ready: function(callback) {
          // Attach the listeners
          bindReady();
          // If the DOM is already ready, then execute the function immediately
          if (isReady)
              return callback.call(window, []);
          // Otherwis, add  the function to the wait list
          readyList.push(function() {
              return callback.call(window, []);
          });
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
  const e15 = (cElement, childIds, instance) => {
      for (let i = 0; i < childIds.length; i++) {
          const childId = childIds[i];
          const childEl = XAttr.x42(cElement, instance, childId);
          if (childEl !== null)
              childEl.innerHTML = '';
      }
  };
  /**
   * Creates a temporary element
   * @returns Document
   */
  const e43 = () => {
      return document.implementation.createHTMLDocument().body;
  };
  /**
   * Copies an element from one to the other, while
   * at the same time ensuring that all the event
   * bindings to the source element remains intact.
   * @param bindFrom - Element
   * @param bindTo - Element
   */
  const e45 = (bindFrom, bindTo) => {
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
  const a67 = (element, instance) => {
      const attr = XAttr.a95(LOCK_ID_ATTR_KEY, instance);
      element.setAttribute(attr, LOCK_ID_ATTR_VALUE);
  };
  /**
   * Checks if the element is locked. @see a67
   * @param element - element to be check
   * @param instance - PluncApp instance
   */
  const a46 = (element, instance) => {
      const attr = XAttr.a95(LOCK_ID_ATTR_KEY, instance);
      return (element.getAttribute(attr) !== null);
  };
  /**
   * Wraps comment block within an element.
   * @param element - Element to be disposed
   * @param comment - Comment you'd like to add
   */
  const e50 = (element, comment) => {
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
  const e35 = (bindFromEl, bindToEl, instance, childIds) => {
      const TChildRegistry = {};
      for (let i = 0; i < childIds.length; i++) {
          const childId = childIds[i];
          const tempChildEl = e43();
          const actualChildEl = XAttr.x42(bindToEl, instance, childId);
          if (actualChildEl !== null) {
              e45(actualChildEl, tempChildEl);
              TChildRegistry[childId] = tempChildEl;
          }
      }
      bindToEl.innerHTML = '';
      e45(bindFromEl, bindToEl);
      for (const childId in TChildRegistry) {
          const actualChildEl = XAttr.x42(bindToEl, instance, childId);
          if (actualChildEl === null)
              continue;
          e45(TChildRegistry[childId], actualChildEl);
      }
  };
  const e17 = (element, eventName, instance) => {
      const attribute = XAttr.a95(EVENT_ELEMENT_ATTR, instance);
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
  const x36 = (element, eventName, instance) => {
      const attribute = XAttr.a95(EVENT_ELEMENT_ATTR, instance);
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
      const childIds = lineage.children(component.e98());
      let selector = '';
      for (let i = 0; i < childIds.length; i++) {
          const childId = childIds[i];
          const childAttrName = XAttr.a41(STRAWBERRY_ID_ATTR, instance, childId);
          selector += ':not([' + childAttrName + '])';
      }
      selector += ` > [${attrWithValue}]`;
      if (childIds.length === 0) {
          const xidAttrName = XAttr.a41(STRAWBERRY_ID_ATTR, instance, component.e98());
          selector = `[${xidAttrName}] [${attrWithValue}]`;
      }
      const componentElement = XAttr.x42(x47(instance), instance, component.e98());
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
  const e9 = (component, instance, lineage) => {
      return new Promise(async (resolve, reject) => {
          try {
              const name = component.x86();
              const handler = instance.a89().x75(name);
              if (handler === null) {
                  throw new Error(`missing component handler ${name}`);
              }
              const memoized = component.x70();
              if (memoized !== null) {
                  return resolve(memoized);
              }
              const dependencies = await e21(handler);
              const injectables = await x20({
                  dependencies: dependencies,
                  type: 'component',
                  scope: component.e84(),
                  instance: instance,
                  lineage: lineage,
                  component: component
              });
              const exposed = handler(...injectables);
              component.e71(exposed);
              resolve(exposed);
          } catch (error) {
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
  const e25 = (component, instance, lineage) => {
      const childIds = lineage.children(component.e98());
      const children = instance.x78().e83(childIds);
      return children.map(child => child.x86());
  };
  const a11 = (name, instance) => {
      return new Promise(async (resolve, reject) => {
          try {
              let service = instance.x78().e88(name);
              if (service !== null) {
                  return resolve(service);
              }
              const handler = instance.a89().x90(name);
              if (handler === null) {
                  throw new Error(`missing service handler ${name}`);
              }
              const dependencies = await e21(handler);
              const injectables = await x20({
                  dependencies: dependencies,
                  type: 'service',
                  instance: instance
              });
              service = handler(...injectables);
              if (service === undefined || service === null) {
                  throw new Error(`service ${name} must not return ${typeof service}`);
              }
              instance.x78().e82(name, service);
              resolve(service);
          } catch (error) {
              reject(error);
          }
      });
  };
  const e12 = (name, instance) => {
      return new Promise(async (resolve, reject) => {
          try {
              let handler = instance.a89().x91(name);
              if (handler === null) {
                  throw new Error(`missing factory handler ${name}`);
              }
              const dependencies = await e21(handler);
              const injectables = await x20({
                  dependencies: dependencies,
                  type: 'factory',
                  instance: instance
              });
              const factory = handler(...injectables);
              if (typeof factory === 'function' && /^\s*class\s+/.test(factory.toString())) {
                  resolve(factory);
                  return;
              }
              throw new Error(`factory ${name} handler must return class reference`);
          } catch (error) {
              reject(error);
          }
      });
  };
  const a16 = (component, scope, name, lineage, instance) => {
      return new Promise(async (resolve, reject) => {
          try {
              let handler = instance.a89().e96(name);
              if (handler === null) {
                  throw new Error(`missing helper handler ${name}`);
              }
              const dependencies = await e21(handler);
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
          } catch (error) {
              reject(error);
          }
      });
  };
  class TypeofFactory {}
  const a68 = (app) => {
      return app.x94().startFn();
  };


  /**
   * Retrieves the HTML content of a template.
   * @throw Error when there are no instance of the template
   * or there are two or more. Template names should be unique
   * throughout the application.
   * @param instance PluncApp
   * @param name name of te template
   */
  const e81 = (instance, name) => {
      const selector = `
  template[${XAttr.a41(TEMPL_NAME_ATTR, instance, name)}]
`;
      const templateEl = document.querySelectorAll(`${selector.trim()}`);
      if (templateEl.length === 0)
          throw new Error(`102:${name}`);
      if (templateEl.length > 1)
          throw new Error(`103:${name}`);
      return templateEl[0].innerHTML;
  };
  const a56 = (instance, component, block) => {
      const cTempl = e81(instance, component);
      const cElem = e43();
      cElem.innerHTML = cTempl;
      const blockAttr = XAttr.a41(BLOCK_ELEMENT_ATTR, instance, block);
      const blockEl = cElem.querySelector(`[${blockAttr}]`);
      if (blockEl === null)
          return null;
      return blockEl.innerHTML;
  };

  class Component {
      constructor(id, name) {
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
          this.id = id;
          this.name = name;
          this.scope = new Scope;
          this.exposed = null;
      }
      x86() {
          return this.name;
      }
      e98() {
          return this.id;
      }
      e84() {
          return this.scope;
      }
      x69(scope) {
          this.scope = scope;
      }
      e71(object) {
          if (this.exposed === null) {
              this.exposed = object;
          }
      }
      x70() {
          return this.exposed;
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
          this.e72(pcount !== null && pcount !== void 0 ? pcount : 1);
      }
      /** Wraps the parent element within `PluncElement` object */
      e72(count) {
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
              this.removeClass(className):
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
      e82(name, type, handler) {
          const namespace = this.e76(type, name);
          this.handlers[namespace] = handler;
      }
      e76(type, name) {
          return `${type}.${name}`;
      }
      x75(name) {
          const namespace = this.e76('component', name);
          return this.handlers[namespace];
      }
      x90(name) {
          var _a;
          const namespace = this.e76('service', name);
          return ((_a = this.handlers[namespace]) !== null && _a !== void 0 ? _a : null);
      }
      x91(name) {
          var _a;
          const namespace = this.e76('factory', name);
          return ((_a = this.handlers[namespace]) !== null && _a !== void 0 ? _a : null);
      }
      e96(name) {
          var _a;
          const namespace = this.e76('helper', name);
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
      x94() {
          return this.config;
      }
      a89() {
          return this.library;
      }
      x78() {
          return this.registry;
      }
      x86() {
          return this.name;
      }
      e98() {
          return this.id;
      }
      x93() {
          return this.api;
      }
      x85() {
          this.ready = true;
      }
      x87() {
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
      e82(id, object) {
          this.data[id] = object;
      }
      e83(ids) {
          const components = [];
          for (const id in this.data) {
              if (ids.includes(id)) {
                  components.push(this.data[id]);
              }
          }
          return components;
      }
      e88(id) {
          var _a;
          return (_a = this.data[id]) !== null && _a !== void 0 ? _a : null;
      }
      e97() {
          return this.data;
      }
  }

  var Resolver;
  (function(Resolver) {
      /**
       * Resolves an expression based on a given object
       * @param object baseObj
       * @param string expression
       *
       * @returns the value of the resolved expression
       */
      Resolver.x32 = (scope, expression, element = null) => {
          const resolveType = Resolver.e51(expression);
          return a92(scope, expression, resolveType, element);
      };
      /**
       * Determines the type of an expression
       * @param string expression
       * @returns type of expression
       *
       * @NOTE: the expression should always have to be a string!
       */
      Resolver.e51 = (expression) => {
          if (/^'.*'$/.test(expression))
              return 'string';
          if (!isNaN(expression))
              return 'number';
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
      const a92 = (scope, expression, resolveType, element = null) => {
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
                  return x73(scope, expression);
                  break;
              case 'function':
                  let structure = expression.split('(');
                  /** Checks to see if structure of a function resembles an object **/
                  let expressionTest = structure[0].split('.');
                  /** If the said function is a method of an object **/
                  if (expressionTest.length > 1) {
                      let refObject = Resolver.x32(scope, e26(structure[0]));
                      let funcExpression = expression.split('.')
                          .slice(((expressionTest.length) - 1))
                          .join('.');
                      return a52(refObject, scope, funcExpression, element);
                  }
                  if (!scope.hasOwnProperty(structure[0])) {
                      return '';
                  }
                  return a52(scope, scope, expression, element);
                  break;
              case 'conditional':
                  const evaluatorMap = {
                      '!==': e4,
                      '==': a8,
                      'is not ': e4,
                      'is ': a8,
                      '>=': x2,
                      '>': a13,
                      '<=': e5,
                      '<': e27
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
                          let left = Resolver.x32(scope, exp[0].trim());
                          var right = Resolver.x32(scope, exp[1].trim());
                          finalExpression = left + operations[i] + right;
                      }
                  }
                  return eval(finalExpression);
                  break;
              default:
                  break;
          }
      };
      const x73 = (scope, expression) => {
          if (expression === '$scope') {
              return scope;
          }
          return expression.split('.').reduce(function(o, x) {
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
      const a52 = (scope, object, expression, element) => {
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
                  argsVault.push(Resolver.x32(object, splitArguments[i]));
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
      const e26 = (expression) => {
          let pieces = expression.split('.');
          if (pieces.length < 2)
              return '$scope';
          pieces.pop();
          return pieces.join('.');
      };
      Resolver.e18 = (base, expression) => {
          const parentObjExp = e26(expression);
          return Resolver.x32(base, parentObjExp);
      };
      Resolver.x33 = (expression) => {
          let pieces = expression.split('.');
          return pieces[pieces.length - 1];
      };
      const a8 = (scope, expression, comparator) => {
          const [left, right] = expression.split(comparator).map(arm => {
              return Resolver.x32(scope, arm.trim());
          });
          return (left === right);
      };
      const e4 = (scope, expression, comparator) => {
          const [left, right] = expression.split(comparator).map(arm => {
              return Resolver.x32(scope, arm.trim());
          });
          return (left !== right);
      };
      const a13 = (scope, expression, comparator) => {
          const [left, right] = expression.split(comparator).map(arm => {
              return Resolver.x32(scope, arm.trim());
          });
          return (left > right);
      };
      const x2 = (scope, expression, comparator) => {
          const [left, right] = expression.split(comparator).map(arm => {
              return Resolver.x32(scope, arm.trim());
          });
          return (left >= right);
      };
      const e27 = (scope, expression, comparator) => {
          const [left, right] = expression.split(comparator).map(arm => {
              return Resolver.x32(scope, arm.trim());
          });
          return (left < right);
      };
      const e5 = (scope, expression, comparator) => {
          const [left, right] = expression.split(comparator).map(arm => {
              return Resolver.x32(scope, arm.trim());
          });
          return (left <= right);
      };
  })(Resolver || (Resolver = {}));
  /**
   * The scope object
   */
  class Scope {
      constructor() {}
  }
  class Service {}



  const e62 = (element, component, instance) => {
      return new Promise(async (resolve, reject) => {
          try {
              const attribute = CHECK_ELEMENT_ATTR;
              const nodes = XAttr.a31(element, instance, attribute);
              for (let i = 0; i < nodes.length; i++) {
                  const node = nodes[i];
                  if (a46(node, instance))
                      continue;
                  const argument = XAttr.e80(node, instance, attribute);
                  const scope = component.e84();
                  if (scope === null || argument === null || argument.trim() === '')
                      continue;
                  const evaluated = Resolver.x32(scope, argument);
                  if (typeof evaluated === 'boolean') {
                      evaluated ? node.setAttribute('checked', '') : node.removeAttribute('checked');
                  }
                  a67(node, instance);
              }
              resolve();
          } catch (error) {
              reject(error);
          }
      });
  };



  const a28 = (element, component, instance) => {
      return new Promise(async (resolve, reject) => {
          try {
              const attr = IF_ELEMENT_ATTR;
              /** Retrieving all elements with ifs conditional */
              const nodes = XAttr.a31(element, instance, attr);
              for (let i = 0; i < nodes.length; i++) {
                  const node = nodes[i];
                  if (!a46(node, instance)) {
                      const condition = XAttr.e80(node, instance, attr);
                      const scope = component.e84();
                      if (scope === null || condition === null)
                          continue;
                      const result = Resolver.x32(scope, condition);
                      if (typeof result === 'boolean' && !result) {
                          e50(node, 'false');
                      }
                      a67(node, instance);
                  }
              }
              resolve();
          } catch (error) {
              reject(error);
          }
      });
  };



  const a53 = (element, component, instance) => {
      return new Promise(async (resolve, reject) => {
          try {
              const attribute = DISABLE_ELEMENT_ATTR;
              const nodes = XAttr.a31(element, instance, attribute);
              for (let i = 0; i < nodes.length; i++) {
                  const node = nodes[i];
                  if (a46(node, instance))
                      continue;
                  const argument = XAttr.e80(node, instance, attribute);
                  const scope = component.e84();
                  if (scope === null || argument === null || argument.trim() === '')
                      continue;
                  const evaluated = Resolver.x32(scope, argument);
                  if (typeof evaluated === 'boolean') {
                      evaluated ? node.setAttribute('disabled', 'true') : node.removeAttribute('disabled');
                  }
                  a67(node, instance);
              }
              resolve();
          } catch (error) {
              reject(error);
          }
      });
  };



  /**
   * This function adds event listener to elements which is bound to a function
   * within the component scope
   */
  const x29 = (scope, bindToElement, fnExpression, eventType) => {
      if (Resolver.e51(fnExpression) !== 'function')
          return;
      bindToElement.addEventListener(eventType, () => {
          Resolver.x32(scope, fnExpression, bindToElement);
      });
  };
  const x63 = (element, component, instance) => {
      return new Promise(async (resolve, reject) => {
          try {
              const events = [{
                      type: 'click',
                      attr: CLICK_EVENT_ATTR
                  },
                  {
                      type: 'change',
                      attr: CHANGE_EVENT_ATTR
                  },
                  {
                      type: 'keyup',
                      attr: TOUCH_EVENT_ATTR
                  }
              ];
              for (let i = 0; i < events.length; i++) {
                  const event = events[i];
                  const nodes = XAttr.a31(element, instance, event.attr);
                  for (let k = 0; k < nodes.length; k++) {
                      const node = nodes[k];
                      const fnExpression = XAttr.e80(node, instance, event.attr);
                      if (e17(node, event.type, instance))
                          continue;
                      const scope = component.e84();
                      if (scope === null || fnExpression == null)
                          continue;
                      x29(scope, node, fnExpression, event.type);
                      x36(node, event.type, instance);
                  }
              }
              resolve();
          } catch (error) {
              reject(error);
          }
      });
  };




  const a60 = (element, component, instance, skipEvents = false) => {
      return new Promise(async (resolve, reject) => {
          try {
              await a58(element, component, instance);
              await a28(element, component, instance);
              await e30(element, component, instance);
              await e62(element, component, instance);
              await a64(element, component, instance);
              await a65(element, component, instance);
              await a53(element, component, instance);
              if (!skipEvents) {
                  await x63(element, component, instance);
              }
              resolve();
          } catch (error) {
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
  function x37(date) {
      var _a, _b, _c;
      const message = `models assigned to Date input elements ` +
          `must follow standard HTML5 format YYYY-MM-DD`;
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
  function a38(time) {
      var _a, _b;
      const message = `models assigned to Time input elements ` +
          `must follow standard HTML5 format HH:MM`;
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
  const a39 = (scope, expression, value) => {
      const parentObj = Resolver.e18(scope, expression);
      const childObjExpression = Resolver.x33(expression);
      if (undefined !== parentObj)
          parentObj[childObjExpression] = value;
  };
  const e40 = (element, state) => {
      (typeof state == 'boolean' && state) ?
      element.setAttribute('checked', ''):
          element.removeAttribute('checked');
  };
  const a54 = () => {
      const date = new Date(Date.now());
      const nmonth = (date.getMonth() + 1);
      const month = (nmonth < 10) ? `0${nmonth}` : nmonth;
      const result = `${date.getFullYear()}-${month}-${date.getDate()}`;
      x37(result);
      return result;
  };
  const a55 = () => {
      const input = new Date(Date.now());
      const hours = (input.getHours() < 10) ? `0${input.getHours()}` : input.getHours();
      const minutes = (input.getMinutes() < 10) ? `0${input.getMinutes()}` : input.getMinutes();
      const result = hours + ':' + minutes;
      a38(result);
      return result;
  };
  const a65 = (element, component, instance) => {
      return new Promise(async (resolve, reject) => {
          try {
              const attribute = MODEL_ELEMENT_ATTR;
              const nodes = XAttr.a31(element, instance, attribute);
              for (let i = 0; i < nodes.length; i++) {
                  const node = nodes[i];
                  if (node === null)
                      continue;
                  const argument = XAttr.e80(node, instance, attribute);
                  const scope = component.e84();
                  if (scope === null || argument === null || argument.trim() === '')
                      continue;
                  const evaluated = Resolver.x32(scope, argument);
                  let IsValueTypeOfString = true;
                  if (node.tagName === 'INPUT' || node.tagName === 'SELECT') {
                      if ((node instanceof HTMLInputElement)) {
                          const type = node.type;
                          /** Radio buttons and checkboxes */
                          if (type === 'radio' || type === 'checkbox') {
                              IsValueTypeOfString = false;
                              (evaluated === undefined) ?
                              a39(scope, argument, false):
                                  e40(node, evaluated);
                          }
                          /** Text inputs, but not textarea */
                          if (type === 'text' || type === 'password' || type === ' email') {
                              (evaluated === undefined) ?
                              a39(scope, argument, node.value):
                                  node.value = evaluated;
                          }
                          /** Date input */
                          if (type === 'date') {
                              /** When evaluated is undefined, we will assign Date today */
                              let inputDate = a54();
                              if (evaluated !== undefined) {
                                  x37(evaluated);
                                  inputDate = evaluated;
                              } else {
                                  a39(scope, argument, inputDate);
                              }
                              node.value = inputDate;
                          }
                          /** Time input */
                          if (type === 'time') {
                              /** When evaluated is undefined, we will assign Date today */
                              let inputTime = a55();
                              if (evaluated !== undefined) {
                                  a38(evaluated);
                                  inputTime = evaluated;
                              } else {
                                  a39(scope, argument, inputTime);
                              }
                              node.value = inputTime;
                          }
                      }
                      /** Select element */
                      if ((node instanceof HTMLSelectElement)) {
                          (evaluated === undefined) ?
                          a39(scope, argument, node.value):
                              node.value = evaluated;
                      }
                      node.addEventListener('change', (event) => {
                          const target = event.target;
                          if (target instanceof HTMLInputElement) {
                              const value = (IsValueTypeOfString) ? target.value : target.checked;
                              a39(scope, argument, value);
                          }
                          if (target instanceof HTMLSelectElement) {
                              a39(scope, argument, target.value);
                          }
                      });
                  }
              }
              resolve();
          } catch (error) {
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
                      const scope = component.e84();
                      if (scope === null)
                          continue;
                      let resolvedExp = Resolver.x32(scope, placeholders[i].trim());
                      if (resolvedExp === undefined) {
                          resolvedExp = '';
                      }
                      template = template.replace('{{' + placeholders[i] + '}}', resolvedExp);
                  }
              }
              element.innerHTML = template;
              resolve();
          } catch (error) {
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
  const e34 = (expression) => {
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
  const x22 = (repetitions) => {
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
  const x14 = (value) => {
      return value !== null && (typeof value === 'object' || Array.isArray(value));
  };
  const a58 = (element, component, instance) => {
      return new Promise(async (resolve, reject) => {
          try {
              /** Retrieving all repeatable elements */
              const repeatables = XAttr.a31(element, instance, REPEAT_ELEMENT_ATTR);
              const scope = component.e84();
              if (scope === null)
                  return resolve();
              for (let i = 0; i < repeatables.length; i++) {
                  const repeatable = repeatables[i];
                  const template = repeatable.innerHTML;
                  repeatable.innerHTML = '';
                  let expression = XAttr.e80(repeatable, instance, REPEAT_ELEMENT_ATTR);
                  if (expression === null || expression.trim() === '')
                      continue;
                  let [refObjName, aliasObjName] = e34(expression);
                  if (refObjName === REPEAT_REFERENCE_TOKEN) {
                      /** This creates a new object that we can loop through **/
                      let repetitions = Resolver.x32(scope, aliasObjName);
                      /** How many repitions to be made */
                      let times = x22(repetitions);
                      scope['$$index'] = {};
                      let k = 0;
                      while (k < times)
                          scope['$$index']['props' + (k++)] = new Object;
                  }
                  const repeatableObj = Resolver.x32(scope, refObjName);
                  if (x14(repeatableObj)) {
                      let indexNumber = 0;
                      for (const [key, value] of Object.entries(repeatableObj)) {
                          /** Creating an invidual component for each repititions **/
                          const id = 'any';
                          let dummy = new Component(id, 'any');
                          dummy.x69({
                              $parent: scope,
                              $index: indexNumber++,
                              [aliasObjName]: repeatableObj[key]
                          });
                          const child = e43();
                          child.innerHTML = template;
                          await a60(child, dummy, instance, true);
                          e45(child, repeatable);
                      }
                  }
              }
              resolve();
          } catch (error) {
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
  const a64 = (element, component, instance) => {
      return new Promise(async (resolve, reject) => {
          try {
              const attribute = STYLE_ELEMENT_ATTR;
              const nodes = XAttr.a31(element, instance, attribute);
              for (let i = 0; i < nodes.length; i++) {
                  const node = nodes[i];
                  if (a46(node, instance))
                      continue;
                  const argument = XAttr.e80(node, instance, attribute);
                  const scope = component.e84();
                  if (scope === null || argument === null || argument.trim() === '')
                      continue;
                  const evaluated = Resolver.x32(scope, argument);
                  if (evaluated !== null && evaluated !== '' && evaluated !== undefined) {
                      node.classList.add(evaluated);
                  }
                  a67(node, instance);
              }
              resolve();
          } catch (error) {
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
          const reqConf = e61(config);
          const instance = new PluncApp(applName, instanceId++, reqConf);
          instances.push(instance);
          return {
              /**
               * @see PluncAppInstance.component for definition
               * @param name
               * @param handler
               */
              component: (name, handler) => {
                  instance.a89()
                      .e82(name, 'component', handler);
              },
              /**
               * @see PluncAppInstance.service for definition
               * @param name
               * @param handler
               */
              service: (name, handler) => {
                  instance.a89()
                      .e82(name, 'service', handler);
              },
              /**
               * @see PluncAppInstance.factory for definition
               * @param name
               * @param handler
               */
              factory: (name, handler) => {
                  instance.a89()
                      .e82(name, 'factory', handler);
              },
              /**
               * @see PluncAppInstance.helper for definition
               * @param name
               * @param handler
               */
              helper: (name, handler) => {
                  instance.a89()
                      .e82(name, 'helper', handler);
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
              const name = instance.x86();
              const shouldProceed = await a68(instance);
              if (!shouldProceed)
                  continue;
              /**
               * Creating a new document object where we operate on
               * templates and render all components.
               */
              const implementation = (document.implementation.createHTMLDocument(name));
              implementation.body.innerHTML = e81(instance, name);
              /**
               * Compiling all the components in the app template, as well
               * as the dependencies of these components.
               */
              const cAttr = XAttr.a95(COMPONENT_ELEMENT_ATTR, instance);
              const cEls = implementation.body.querySelectorAll(`[${cAttr}]`);
              let cId = 0;
              /** Creating a new lineage of components */
              const lineage = new Lineage();
              let compiledHtml = '';
              for (let j = 0; j < cEls.length; j++) {
                  const cEl = cEls[j];
                  const cName = XAttr.e80(cEl, instance, COMPONENT_ELEMENT_ATTR);
                  /**
                   * Component without names will not be rendered
                   */
                  if (cName === null)
                      continue;
                  /** Component IDs would have to be embedded to the plunc-id attribute */
                  const cElId = a44(instance, cId++);
                  const cElAttr = XAttr.a95('id', instance);
                  cEl.setAttribute(cElAttr, cElId);
                  lineage.begat(cElId, null);
                  /** Registering the component object */
                  const cObject = new Component(cElId, cName);
                  instance.x78().e82(cElId, cObject);
                  /**
                   * Retrieving component templates, as well as the templates of their dependencies,
                   * and the dependencies of their dependencies.
                   */
                  cEl.innerHTML = await a49(cElId, cEl, instance, lineage);
              }
              /** All registered components */
              const cRegistered = instance.x78().e97();
              for (const id in cRegistered) {
                  await e9(cRegistered[id], instance, lineage);
              }
              const appEl = e43();
              appEl.innerHTML = implementation.body.innerHTML;
              for (const id in cRegistered) {
                  const component = cRegistered[id];
                  if (!(component instanceof Component))
                      continue;
                  const cId = component.e98();
                  const targetEl = XAttr.x42(appEl, instance, cId);
                  /**
                   * This happens for the following circumstances:
                   * - When the component is added inside an xif element
                   */
                  if (targetEl === null)
                      continue;
                  const tempEl = e43();
                  tempEl.innerHTML = targetEl.innerHTML;
                  e15(tempEl, lineage.children(cId), instance);
                  await a60(tempEl, component, instance);
                  e35(tempEl, targetEl, instance, lineage.children(cId));
              }
              const appElement = x47(instance);
              e45(appEl, appElement);
              instance.x85();
              const readys = instance.x93().a59('ready');
              for (let o = 0; o < readys.length; o++) {
                  readys[o]();
              }
          } catch (error) {
              console.error(`plunc.js error: ${error.message}`);
          }
      }
  });
})();