"use strict";
(() => {
  var __async = (n, e, t) =>
    new Promise((r, o) => {
      var c = (n) => {
          try {
            u(t.next(n));
          } catch (n) {
            o(n);
          }
        },
        i = (n) => {
          try {
            u(t.throw(n));
          } catch (n) {
            o(n);
          }
        },
        u = (n) => (n.done ? r(n.value) : Promise.resolve(n.value).then(c, i));
      u((t = t.apply(n, e)).next());
    });
  function be4(n) {
    var e, t, r;
    return {
      prefix:
        null !== (e = null == n ? void 0 : n.prefix) && void 0 !== e
          ? e
          : "plunc-",
      startFn:
        null !== (t = null == n ? void 0 : n.startFn) && void 0 !== t
          ? t
          : () => new Promise((n) => n(!0)),
      endFn:
        null !== (r = null == n ? void 0 : n.endFn) && void 0 !== r
          ? r
          : () => new Promise((n) => n()),
    };
  }
  function ad1(
    n,
    e,
    t,
    r,
    o,
    c,
    i,
    u,
    a,
    s,
    l,
    f,
    d,
    E,
    p,
    g,
    b,
    m,
    h,
    T,
    y,
    C,
    R,
    _,
    v,
    I,
    w,
    L,
    M,
    N,
    A,
    O,
    P,
    $,
    D,
    V,
    x,
    H,
    S,
    F,
    B,
    K,
    G,
    k,
  ) {
    return function (j, U, Y = null) {
      const X = be4(Y),
        q = e(),
        z = s(),
        J = g(),
        W = n(j, U, X, z, q),
        Q = C(X),
        Z = R(Q),
        nn = _(Q),
        en = x(Q, L),
        tn = H(v),
        rn = M(Q, w),
        on = S();
      return {
        dc0: () => W,
        ac0: function (n, e, t) {
          l(z, n, e, t);
        },
        dg0: function (n) {
          return f(z, n);
        },
        ag0: function (n) {
          return d(z, n);
        },
        ac1: function (n) {
          return E(z, n);
        },
        af1: function (n) {
          return p(z, n);
        },
        gd0: function (n, e) {
          t(q, n, e);
        },
        be0: function (n) {
          return r(q, n);
        },
        cd0: function (n) {
          return o(q, n);
        },
        cg0: function () {
          return c(q);
        },
        ac2: function (n, e) {
          i(q, n, e);
        },
        be2: function (n) {
          return u(q, n);
        },
        cd1: function (n) {
          return a(q, n);
        },
        cb0: function (n, e) {
          b(J, n, e);
        },
        gg0: function (n) {
          return m(J, n);
        },
        ea0: function (n) {
          return h(J, n);
        },
        ce0: function (n) {
          return T(J, n);
        },
        ge0: function (n) {
          return y(J, n);
        },
        gf0: Q,
        ba0: Z,
        ca1: nn,
        bg1: v,
        ag1: I(W),
        dg1: w,
        af0: L,
        bd0: rn,
        ee0: N(L, Q),
        df1: A(Q),
        de0: O(Q),
        gc1: $(Q),
        ag2: P(Q),
        fc1: D,
        ec0: V(rn),
        da0: en,
        ga0: tn,
        gc0: on,
        fe0: F,
        fc0: B,
        ae0: K,
        bc0: G,
        bf1: k,
      };
    };
  }
  function de3(n) {
    var e;
    return {
      name: n.split(" as ")[0],
      alias: null !== (e = n.split(" as ")[1]) && void 0 !== e ? e : null,
    };
  }
  var GLOBAL_DIRECTIVE_FOR_APP_NAME = "plunc-app",
    GLOBAL_DIRECTIVE_FOR_TEMPLATE_NAME = "plunc-name",
    GLOBAL_LOCK_ID_DIRECTIVE = "plunc-set",
    GLOBAL_LOCK_ID_DIRECTIVE_VALUE = "true",
    GLOBAL_EVENT_LOCK_DIRECTIVE = "plunc-event",
    COMPONENT_ELEMENT_DIRECTIVE = "[PREFIX]component",
    COMPONENT_ID_DIRECTIVE = "[PREFIX]cid",
    REPEAT_ELEMENT_DIRECTIVE = "[PREFIX]repeat",
    IF_ELEMENT_DIRECTIVE = "[PREFIX]if",
    CHECK_ELEMENT_DIRECTIVE = "[PREFIX]check",
    STYLE_ELEMENT_DIRECTIVE = "[PREFIX]style",
    MODEL_ELEMENT_DIRECTIVE = "[PREFIX]model",
    DISABLE_ELEMENT_DIRECTIVE = "[PREFIX]disable",
    CLICK_EVENT_DIRECTIVE = "[PREFIX]click",
    CHANGE_EVENT_DIRECTIVE = "[PREFIX]change",
    TOUCH_EVENT_DIRECTIVE = "[PREFIX]touch",
    BLOCK_ELEMENT_DIRECTIVE = "[PREFIX]block",
    COMPONENT_REFERENCE_DIRECTIVE = "[PREFIX]rid",
    SCOPE_ARGUMENT_KEY = "$scope",
    BLOCK_ARGUMENT_KEY = "$block",
    PARENT_ARGUMENT_KEY = "$parent",
    PATCH_ARGUMENT_KEY = "$patch",
    APP_ARGUMENT_KEY = "$app",
    COMPONENT_ARGUMENT_KEY = "$this",
    REPEAT_REFERENCE_TOKEN = "$$index";
  function fd1(n) {
    const e = n.prefix;
    return function (n) {
      return n.replace("[PREFIX]", e);
    };
  }
  function ga1(n, e, t) {
    return `[${t(BLOCK_ELEMENT_DIRECTIVE)}="${n}"][${t(COMPONENT_REFERENCE_DIRECTIVE)}="${e.id}"]`;
  }
  function be3(n, e) {
    return function (t, r) {
      const o = ga1(t, r, n);
      return function (n) {
        return e(n, o);
      };
    };
  }
  function gf1() {
    return function (n) {
      return new Proxy(n, {
        get: function (n, e) {
          for (const t in n) {
            const r = n[t],
              o = r.getProxy();
            if (null === o) {
              const n = r.name;
              throw new Error(
                `Cannot invoke component "${n}}" before $app is ready`,
              );
            }
            if (!(e in o))
              throw new Error(
                `Calling undefined member "${e}" in component "${r.name}"`,
              );
            return o[e];
          }
        },
      });
    };
  }
  function ae1(n) {
    return function (e, t) {
      const { name: r, alias: o } = n(t);
      let c = null,
        i = `\x3c!-- Component ${e} Template --\x3e`;
      return {
        id: e,
        name: r,
        alias: o,
        scope: {},
        setProxy: function (n) {
          c = n;
        },
        getProxy: function () {
          return c;
        },
        setTemplate: function (n) {
          i = n;
        },
        getTemplate: function () {
          return i;
        },
      };
    };
  }
  function fe2(n) {
    return function (e, t) {
      return "" !== t
        ? `${t}.${e.toString()}`
        : `${n.id.toString()}.${e.toString()}`;
    };
  }
  function bd2(n, e, t, r, o) {
    function c(i, u) {
      const a = bb1(i, n, t);
      let s = 0;
      a.forEach((t) => {
        const i = r(s, u);
        (s++,
          (function (t, r, i) {
            const u = cg2(n, t);
            (n.ca1(t, COMPONENT_ID_DIRECTIVE, r), n.cb0(i, r));
            const a = db1(r, u, ee2(n, t), n);
            (cb2(n, a), n.gd0(r, a));
            const s = e.get(u);
            if (void 0 === s)
              throw new Error(`Template not found for component: ${u}`);
            ((t.innerHTML = s), o(r, t), c(t, r), a.setTemplate(t.innerHTML));
          })(t, i, u));
      });
    }
    return c;
  }
  function bb1(n, e, t) {
    return t(n, `[${e.gf0(COMPONENT_ELEMENT_DIRECTIVE)}]`);
  }
  function bd3(n, e) {
    return function (t, r) {
      const o = n(COMPONENT_ID_DIRECTIVE);
      return e(t, `[${o}="${r}"]`);
    };
  }
  function cg2(n, e) {
    const t = fb2(n, e);
    return n.bg1(t).name;
  }
  function ee2(n, e) {
    const t = fb2(n, e);
    return n.bg1(t).alias;
  }
  function fb2(n, e) {
    const t = n.ba0(e, COMPONENT_ELEMENT_DIRECTIVE);
    if (!t)
      throw new Error(
        `Component element is missing the ${COMPONENT_ELEMENT_DIRECTIVE} attribute.`,
      );
    return t;
  }
  function cb2(n, e) {
    const t = e.name,
      r = n.gg0(e.id);
    n.cd0(r).forEach((n) => {
      if (n && "name" in n && n.name === t)
        throw new Error(`Circular dependency detected for component: ${t}`);
    });
  }
  function db1(n, e, t, r) {
    const o = r.be0(n);
    return null !== o ? o : r.ga0(n, t ? `${e}:${t}` : e);
  }
  function gg1(n) {
    return function (e, t) {
      n.ee0(e, CHECK_ELEMENT_DIRECTIVE).forEach((e) => {
        if (n.de0(e)) return;
        const r = n.ba0(e, CHECK_ELEMENT_DIRECTIVE);
        if (null === r || "" === r.trim()) return;
        const o = n.fe0(t, r);
        ("boolean" == typeof o &&
          (o
            ? e.setAttribute("checked", "true")
            : e.removeAttribute("checked")),
          n.df1(e));
      });
    };
  }
  function fe1(n) {
    return function (e, t) {
      n.ee0(e, IF_ELEMENT_DIRECTIVE).forEach((e) => {
        if (n.de0(e)) return;
        const r = n.ba0(e, IF_ELEMENT_DIRECTIVE);
        if (null === r || "" === r.trim()) return;
        const o = n.fe0(t, r);
        ("boolean" == typeof o &&
          !1 === o &&
          n.fc1(e, "condition evaluated to false"),
          n.df1(e));
      });
    };
  }
  function gb0(n) {
    return function (e, t) {
      n.ee0(e, DISABLE_ELEMENT_DIRECTIVE).forEach((e) => {
        if (n.de0(e)) return;
        const r = n.ba0(e, DISABLE_ELEMENT_DIRECTIVE);
        if (null === r || "" === r.trim()) return;
        const o = n.fe0(t, r);
        ("boolean" == typeof o &&
          (o
            ? e.setAttribute("disabled", "true")
            : e.removeAttribute("disabled")),
          n.df1(e));
      });
    };
  }
  function cd3(n, e, t = null) {
    return gf2(n, e, ac6(e), t);
  }
  function ac6(n) {
    return /^'.*'$/.test(n)
      ? "string"
      : isNaN(n)
        ? (n.includes("(") && n.includes("==")) ||
          (n.includes("(") && n.includes("is ")) ||
          (n.includes("(") && n.includes(">")) ||
          (n.includes("(") && n.includes("<"))
          ? "conditional"
          : n.includes("(")
            ? "function"
            : n.includes("==") ||
                n.includes("is ") ||
                n.includes(">") ||
                n.includes("<")
              ? "conditional"
              : n.includes("+") ||
                  n.includes("-") ||
                  n.includes("/") ||
                  n.includes("*") ||
                  n.includes("%")
                ? "operation"
                : "false" == n || "true" == n || "null" == n
                  ? "boolean"
                  : "object"
        : "number";
  }
  function gf2(dataCtx, expression, resolveType, element = null) {
    switch (resolveType) {
      case "string":
        return expression.slice(1, -1);
      case "boolean":
        if ("true" == expression) return !0;
        if ("false" == expression) return !1;
        if ("null" == expression) return null;
        break;
      case "object":
        return ca2(dataCtx, expression);
      case "function":
        let structure = expression.split("("),
          expressionTest = structure[0].split(".");
        if (expressionTest.length > 1) {
          let n = cd3(dataCtx, bb2(structure[0])),
            e = expression
              .split(".")
              .slice(expressionTest.length - 1)
              .join(".");
          return ae2(n, dataCtx, e, element);
        }
        return Object.prototype.hasOwnProperty.call(dataCtx, structure[0])
          ? ae2(dataCtx, dataCtx, expression, element)
          : "";
      case "conditional":
        const evaluatorMap = {
          "!==": be5,
          "==": ad2,
          "is not ": be5,
          "is ": ad2,
          ">=": ad3,
          ">": fc3,
          "<=": ce4,
          "<": fc4,
        };
        for (const n in evaluatorMap)
          if (expression.includes(n))
            return evaluatorMap[n](dataCtx, expression, n);
        return !1;
      case "number":
        return Number(expression);
      case "operation":
        let finalExpression = expression,
          operations = ["+", "-", "*", "/", "%"];
        for (var i = 0; i < operations.length; i++)
          if (expression.includes(operations[i])) {
            let n = expression.split(operations[i]),
              e = cd3(dataCtx, n[0].trim());
            var right = cd3(dataCtx, n[1].trim());
            finalExpression = e + operations[i] + right;
          }
        return eval(finalExpression);
    }
  }
  function ca2(n, e) {
    return "$dataCtx" === e
      ? n
      : e.split(".").reduce(function (n, e) {
          if (null != n && void 0 !== n[e]) return n[e];
        }, n);
  }
  function ae2(n, e, t, r) {
    if (void 0 === n) return "";
    const o = t.match(/\(([^)]+)\)/);
    let c = t.split("(")[0];
    if (null !== o) {
      const t = new Array(),
        i = o[1].split(",");
      for (let n = 0; n < i.length; n++) t.push(cd3(e, i[n].trim()));
      return (
        null !== r && t.push(r),
        n[c] instanceof Function ? n[c](...t) : ""
      );
    }
    if (null !== r) {
      const e = new Array();
      return (e.push(r), n[c](...e));
    }
    return n[c] instanceof Function ? n[c]() : "";
  }
  function bb2(n) {
    let e = n.split(".");
    return e.length < 2 ? "$dataCtx" : (e.pop(), e.join("."));
  }
  function gf3(n, e) {
    return cd3(n, bb2(e));
  }
  function ga2(n) {
    let e = n.split(".");
    return e[e.length - 1];
  }
  function ad2(n, e, t) {
    const [r, o] = e.split(t).map((e) => cd3(n, e.trim()));
    return r === o;
  }
  function be5(n, e, t) {
    const [r, o] = e.split(t).map((e) => cd3(n, e.trim()));
    return r !== o;
  }
  function fc3(n, e, t) {
    const [r, o] = e.split(t).map((e) => cd3(n, e.trim()));
    return r > o;
  }
  function ad3(n, e, t) {
    const [r, o] = e.split(t).map((e) => cd3(n, e.trim()));
    return r >= o;
  }
  function fc4(n, e, t) {
    const [r, o] = e.split(t).map((e) => cd3(n, e.trim()));
    return r < o;
  }
  function ce4(n, e, t) {
    const [r, o] = e.split(t).map((e) => cd3(n, e.trim()));
    return r <= o;
  }
  var PluncElement = class n {
    constructor(n, e = null) {
      (Object.defineProperty(this, "$element", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
        Object.defineProperty(this, "$parent", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "state", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "scope", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        (this.$element = n),
        (this.state = null),
        this.ed3(null != e ? e : 1));
    }
    ed3(e) {
      const t = this.$element.parentElement;
      e > 3 || null === t || (this.$parent = new n(t, e++));
    }
    get() {
      return this.$element;
    }
    getState() {
      return this.state;
    }
    setState(n) {
      null !== n && (this.state = n);
    }
    setScope(n) {
      this.scope = n;
    }
    getScope() {
      return this.scope;
    }
    addClass(n) {
      this.$element.classList.add(n);
    }
    listClass() {
      return this.$element.className.split(" ");
    }
    removeClass(n) {
      this.$element.classList.remove(n);
    }
    toggleClass(n) {
      const e = this.listClass();
      for (var t = 0; t < e.length; t++) {
        e[t] === n ? this.removeClass(n) : this.addClass(n);
      }
    }
  };
  function fg0(n, e, t, r) {
    "function" === ac6(t) &&
      e.addEventListener(r, () => {
        const r = new PluncElement(e);
        cd3(n, t, r);
      });
  }
  function dd0(n) {
    return function (e, t) {
      [
        { type: "click", attr: CLICK_EVENT_DIRECTIVE },
        { type: "change", attr: CHANGE_EVENT_DIRECTIVE },
        { type: "keyup", attr: TOUCH_EVENT_DIRECTIVE },
      ].forEach((r) => {
        n.ee0(e, r.attr).forEach((e) => {
          if (n.ag2(e, r.type)) return;
          const o = n.ba0(e, r.attr);
          null !== o &&
            "" !== o.trim() &&
            (fg0(t, e, o, r.type), n.gc1(e, r.type));
        });
      });
    };
  }
  function ef0(n) {
    var e, t, r;
    const o = n.split("-"),
      c = null !== (e = o[0]) && void 0 !== e ? e : null;
    if (null === c || c.length < 4)
      throw new Error(
        "models assigned to Date input elements must follow standard HTML5 format YYYY-MM-DD",
      );
    const i = null !== (t = o[1]) && void 0 !== t ? t : null;
    if (null === i || parseInt(i) > 12) throw new Error(i);
    const u = null !== (r = o[2]) && void 0 !== r ? r : null;
    if (null === u || parseInt(u) > 31) throw new Error(u);
  }
  function ce1(n) {
    var e, t;
    const r =
        "models assigned to Time input elements must follow standard HTML5 format HH:MM",
      o = n.split(":"),
      c = null !== (e = o[0]) && void 0 !== e ? e : null;
    if (null === c || c.length < 2 || parseInt(c) > 23) throw new Error(r);
    const i = null !== (t = o[1]) && void 0 !== t ? t : null;
    if (null === i || i.length < 2 || parseInt(i) > 59) throw new Error(r);
  }
  var assignModelValue = (n, e, t) => {
    const r = gf3(n, e),
      o = ga2(e);
    void 0 !== r && (r[o] = t);
  };
  function fa0(n, e) {
    "boolean" == typeof e && e
      ? n.setAttribute("checked", "")
      : n.removeAttribute("checked");
  }
  function de1() {
    const n = new Date(Date.now()),
      e = n.getMonth() + 1,
      t = e < 10 ? `0${e}` : e,
      r = `${n.getFullYear()}-${t}-${n.getDate()}`;
    return (ef0(r), r);
  }
  function da1() {
    const n = new Date(Date.now()),
      e =
        (n.getHours() < 10 ? `0${n.getHours()}` : n.getHours()) +
        ":" +
        (n.getMinutes() < 10 ? `0${n.getMinutes()}` : n.getMinutes());
    return (ce1(e), e);
  }
  function fc2(n) {
    return null == n
      ? ""
      : "object" == typeof n
        ? JSON.stringify(n)
        : String(n);
  }
  function cg1(n, e, t, r) {
    const o = n.type.toLowerCase();
    if ("radio" !== o && "checkbox" !== o) return;
    const c = n;
    void 0 === r
      ? (assignModelValue(e, t, !1), fa0(c, !1))
      : "boolean" == typeof r
        ? fa0(c, r)
        : console.warn(
            "Model directive assigned to checkbox/radio input elements must be of boolean type.",
          );
  }
  function ac3(n, e, t, r) {
    const o = n.type.toLowerCase();
    if (
      "text" === o ||
      "email" === o ||
      "password" === o ||
      "search" === o ||
      "url" === o ||
      "tel" === o
    ) {
      const o = n;
      void 0 === r ? assignModelValue(e, t, o.value) : (o.value = fc2(r));
    }
  }
  function bb0(n, e, t, r) {
    if ("number" === n.type.toLowerCase()) {
      const o = n;
      void 0 === r
        ? (assignModelValue(e, t, 0), (o.value = "0"))
        : (o.value = fc2(r));
    }
  }
  function bf2(n, e, t, r) {
    return function (o) {
      o(n, e, t, r);
    };
  }
  function fd0(n, e, t, r) {
    if ("date" === n.type.toLowerCase()) {
      const o = n;
      if (void 0 === r) {
        const n = de1();
        (assignModelValue(e, t, n), (o.value = n));
      } else {
        const n = fc2(r);
        (ef0(n), (o.value = n));
      }
    }
  }
  function bd1(n, e, t, r) {
    if ("time" === n.type.toLowerCase()) {
      const o = n;
      if (void 0 === r) {
        const n = da1();
        (assignModelValue(e, t, n), (o.value = n));
      } else {
        const n = fc2(r);
        (ce1(n), (o.value = n));
      }
    }
  }
  function gb1(n) {
    return function (e, t) {
      n.ee0(e, MODEL_ELEMENT_DIRECTIVE).forEach((e) => {
        const r = n.ba0(e, MODEL_ELEMENT_DIRECTIVE);
        if (null === r || "" === r.trim()) return;
        if (n.de0(e)) return;
        let o = n.fe0(t, r);
        if ("INPUT" === e.tagName || "SELECT" === e.tagName) {
          if (e instanceof HTMLInputElement) {
            const n = bf2(e, t, r, o);
            (n(cg1), n(ac3), n(bb0), n(fd0), n(bd1));
          }
          (e instanceof HTMLSelectElement &&
            (void 0 === o
              ? assignModelValue(t, r, e.value)
              : (e.value = fc2(o))),
            e.addEventListener("change", (n) => {
              const e = n.target;
              if (e instanceof HTMLInputElement) {
                const n = e.type.toLowerCase();
                if ("radio" === n || "checkbox" === n) {
                  const n = e.checked;
                  return void assignModelValue(t, r, n);
                }
                assignModelValue(t, r, e.value);
              }
              e instanceof HTMLSelectElement && assignModelValue(t, r, e.value);
            }));
        } else
          "TEXTAREA" === e.tagName &&
            e instanceof HTMLTextAreaElement &&
            (void 0 === o
              ? assignModelValue(t, r, e.value)
              : (e.value = fc2(o)),
            e.addEventListener("change", (n) => {
              const e = n.target;
              if (!(e instanceof HTMLTextAreaElement)) return;
              const o = e.value;
              assignModelValue(t, r, o);
            }));
        n.df1(e);
      });
    };
  }
  function de2(n) {
    return function (e, t) {
      const r = new RegExp("(?<=\\{{).+?(?=\\}})", "g"),
        o = e.innerHTML.match(r);
      null !== o &&
        o.forEach((r) => {
          const o = r.trim();
          let c = n.fe0(t, o);
          null == c && (c = "");
          const i = `{{${r}}}`;
          e.innerHTML = e.innerHTML.replace(i, String(c));
        });
    };
  }
  function eg0(n) {
    return n.includes("until ")
      ? [REPEAT_REFERENCE_TOKEN, n.split("until")[1].trim()]
      : [n.split(" as ")[0].trim(), n.split(" as ")[1].trim()];
  }
  function ce2(n) {
    if (n instanceof Array) return n.length;
    if ("number" == typeof n && Number.isInteger(n)) return n;
    throw new Error("Repeatable elements must have repeatable values");
  }
  function bc1(n) {
    return null !== n && ("object" == typeof n || Array.isArray(n));
  }
  function ea1(n) {
    let e = () => {};
    function t(t, r) {
      const o = Object.assign({}, r),
        c = t.innerHTML;
      t.replaceChildren();
      let i = n.ba0(t, REPEAT_ELEMENT_DIRECTIVE);
      if (null === i || "" === i.trim()) return;
      let [u, a] = eg0(i);
      if (u === REPEAT_REFERENCE_TOKEN) {
        let e = ce2(n.fe0(o, a));
        o.$$index = {};
        let t = 0;
        for (; t < e; ) o.$$index["props" + t++] = new Object();
      }
      const s = n.fe0(o, u);
      if (!bc1(s)) return;
      let l = 0;
      for (const [o, i] of Object.entries(s)) {
        const o = { $parent: r, $index: l, [a]: i },
          u = n.fc0(c);
        (e(u, o), n.bf1(u, t), l++);
      }
    }
    return function (r, o, c) {
      const i = n.ee0(r, REPEAT_ELEMENT_DIRECTIVE);
      e = c;
      for (const n of i) t(n, o);
    };
  }
  function ba2(n) {
    return function (e, t) {
      n.ee0(e, STYLE_ELEMENT_DIRECTIVE).forEach((e) => {
        if (n.de0(e)) return;
        const r = n.ba0(e, STYLE_ELEMENT_DIRECTIVE);
        if (null === r || "" === r.trim()) return;
        const o = n.fe0(t, r);
        if ("string" == typeof o && "" !== o.trim()) {
          o.split(" ")
            .map((n) => n.trim())
            .forEach((n) => {
              "" !== n && e.classList.add(n);
            });
        }
        n.df1(e);
      });
    };
  }
  function ac4(n) {
    const e = ea1(n),
      t = gg1(n),
      r = fe1(n),
      o = gb0(n),
      c = dd0(n),
      i = gb1(n),
      u = de2(n),
      a = ba2(n);
    return function n(s, l, f = !0) {
      (e(s, l, n),
        r(s, l),
        u(s, l),
        t(s, l),
        a(s, l),
        i(s, l),
        o(s, l),
        !1 === f && c(s, l));
    };
  }
  function eg1(n, e) {
    null !== n &&
      ((n.innerHTML = ""),
      null !== n.parentNode &&
        (n.outerHTML =
          "\x3c!-- plunc.js: " + n.outerHTML + " | " + e + " --\x3e"));
  }
  var userAgent = navigator.userAgent.toLowerCase(),
    browser = {
      version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
      safari: /webkit/.test(userAgent),
      opera: /opera/.test(userAgent),
      msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
      mozilla:
        /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent),
    },
    readyBound = !1,
    isReady = !1,
    readyList = [];
  function domReady() {
    if (!isReady && ((isReady = !0), readyList)) {
      for (var n = 0; n < readyList.length; n++) readyList[n].call(window, []);
      readyList = [];
    }
  }
  function addLoadEvent(n) {
    var e = window.onload;
    "function" != typeof window.onload
      ? (window.onload = n)
      : (window.onload = function () {
          (e && e(), n());
        });
  }
  function bindReady() {
    if (!readyBound) {
      var n;
      if (
        ((readyBound = !0),
        document.addEventListener &&
          !browser.opera &&
          document.addEventListener("DOMContentLoaded", domReady, !1),
        browser.msie &&
          window == top &&
          (function n() {
            if (!isReady) {
              try {
                document.documentElement.doScroll("left");
              } catch (e) {
                return void setTimeout(n, 0);
              }
              domReady();
            }
          })(),
        browser.opera &&
          document.addEventListener(
            "DOMContentLoaded",
            function n() {
              if (!isReady) {
                for (var e = 0; e < document.styleSheets.length; e++)
                  if (document.styleSheets[e].disabled)
                    return void setTimeout(n, 0);
                domReady();
              }
            },
            !1,
          ),
        browser.safari)
      )
        !(function e() {
          if (!isReady)
            if (
              "loaded" == document.readyState ||
              "complete" == document.readyState
            ) {
              if (void 0 === n) {
                for (
                  var t = document.getElementsByTagName("link"), r = 0;
                  r < t.length;
                  r++
                )
                  "stylesheet" == t[r].getAttribute("rel") && n++;
                var o = document.getElementsByTagName("style");
                n += o.length;
              }
              document.styleSheets.length == n ? domReady() : setTimeout(e, 0);
            } else setTimeout(e, 0);
        })();
      addLoadEvent(domReady);
    }
  }
  var DOMHelper = {
    ready: function (n) {
      if ((bindReady(), isReady)) return n.call(window, []);
      readyList.push(function () {
        return n.call(window, []);
      });
    },
  };
  function bc2(n, e) {
    return n.querySelector(e);
  }
  function db2(n, e) {
    return Array.from(n.querySelectorAll(e));
  }
  function ef1(n, e) {
    return function (t, r, o) {
      const c = e(r);
      return n(t, `[${c}${o ? `="${o}"` : ""}]`);
    };
  }
  function bf3(n) {
    return function (e, t) {
      const r = n(t);
      return e.getAttribute(r);
    };
  }
  function gg2(n) {
    return function (e, t, r) {
      const o = n(t);
      e.setAttribute(o, r);
    };
  }
  function ee3(n) {
    return function (e, t) {
      for (let r = 0; r < t.length; r++) {
        const o = t[r],
          c = n(e, o);
        null !== c && (c.innerHTML = "");
      }
    };
  }
  function gb2(n) {
    const e = `[${`${GLOBAL_DIRECTIVE_FOR_APP_NAME}`}="${n}"]`,
      t = document.querySelector(e);
    if (!t) throw new Error(`Cannot find the app root element for app: ${n}`);
    return t;
  }
  function ac7(n) {
    return function (e, t) {
      n.ac0(e, "component", t);
    };
  }
  function bc3(n) {
    return function (e, t) {
      n.ac0(e, "service", t);
    };
  }
  function de4(n) {
    return function (e, t) {
      n.ac0(e, "factory", t);
    };
  }
  function ca3(n) {
    return function (e, t) {
      n.ac0(e, "helper", t);
    };
  }
  function bf0(n) {
    return {
      ready: (e) => {
        n.dc0().onReady(e);
      },
    };
  }
  bindReady();
  var PluncError = class extends Error {
    constructor(n) {
      (super(
        `Plunc: An error has occured! Please see https://kenjiefx.github.io/plunc/errors/${n}.html for more details.`,
      ),
        Object.setPrototypeOf(this, Error.prototype));
    }
  };
  function ca0(n, e) {
    return function (t, r) {
      if (!n.dc0().isReady()) throw new PluncError("ERR8");
      const o = n.bd0(document.body, e.id);
      if (!o) throw new PluncError("ERR9");
      const c = n.da0(t, e)(o);
      0 !== c.length
        ? c.forEach((n) => {
            r(new PluncElement(n));
          })
        : r(null);
    };
  }
  function ad0(n, e) {
    return function () {
      const t = n.ce0(e.id);
      if (null === t) return null;
      const r = n.be0(t);
      if (!r) return null;
      const o = {};
      return ((o[t] = r), n.gc0(o));
    };
  }
  function df0(n, e) {
    return function (t = null) {
      return __async(this, null, function* () {
        if (!n.dc0().isReady()) throw new PluncError("ERR10");
        const r = n.bd0(document.body, e.id);
        if (!r) throw new PluncError("ERR9");
        const { targetType: o, patchTargetNodes: c } = dc1(t, r, e, n);
        for (const r of c) {
          const c = r;
          if (null === c) continue;
          let i = n.fc0();
          if ("COMPONENT" === o) n.ae0(i, e.getTemplate());
          else {
            if (null === t) continue;
            const r = be1(n, e, t);
            n.ae0(i, r);
          }
          (ac4(n)(i, e.scope, !1), (c.innerHTML = ""), n.bf1(i, c));
        }
      });
    };
  }
  function dc1(n, e, t, r) {
    if (null !== n) {
      return { targetType: "BLOCK", patchTargetNodes: r.da0(n, t)(e) };
    }
    return { targetType: "COMPONENT", patchTargetNodes: [e] };
  }
  function be1(n, e, t) {
    const r = n.fc0(e.getTemplate()),
      o = `[${n.gf0(BLOCK_ELEMENT_DIRECTIVE)}="${t}"][${n.gf0(COMPONENT_REFERENCE_DIRECTIVE)}="${e.id}"]`,
      c = n.af0(r, o);
    if (0 === c.length) throw new PluncError("ERR11");
    return c[0].innerHTML;
  }
  function bg0(n, e) {
    return function () {
      return {
        id: e.id,
        name: e.name,
        alias: e.alias,
        element: () => {
          if (!n.dc0().isReady()) throw new PluncError("ERR12");
          const t = n.bd0(document.body, e.id);
          return null === t ? null : new PluncElement(t);
        },
      };
    };
  }
  function fg1(n) {
    const e = n.toString().split("{")[0];
    if ("(" !== e.charAt(0)) {
      const n = e.split("=>")[0];
      return n === e ? [] : [n.trim()];
    }
    const t = e.match(new RegExp("(?<=\\().+?(?=\\))", "g"));
    return null === t || /[(={})]/g.test(t[0])
      ? []
      : t[0].split(",").map((n) => n.trim());
  }
  function fb3(n, e) {
    return function t(r) {
      const o = [];
      return (
        r.dependencies.forEach((c) => {
          if (ed1(c)) o.push(ag3(r));
          else if (cf1(c)) o.push(gb3(c, r, n));
          else if (ca4(n, c)) {
            const r = bc4(c, n, e, t);
            o.push(r);
          } else if (dc2(n, c)) {
            const r = gg3(c, n, e, t);
            o.push(r);
          } else {
            if (cf2(n, c)) {
              if ("component" === r.type || "helper" === r.type) {
                const i = ff2(c, n, e, t, r.component);
                return void o.push(i);
              }
              throw new Error(
                `Helper dependency "${c}" can only be injected into components or helpers`,
              );
            }
            if ("component" !== r.type)
              (console.warn(`Unresolved dependency: "${c}"`), o.push(null));
            else {
              const e = ab0(c, r.component, n);
              o.push(e);
            }
          }
        }),
        o
      );
    };
  }
  function ed1(n) {
    return n === SCOPE_ARGUMENT_KEY;
  }
  function cf1(n) {
    return n.startsWith("$");
  }
  function ca4(n, e) {
    return null !== n.dg0(e);
  }
  function dc2(n, e) {
    return null !== n.ac1(e);
  }
  function cf2(n, e) {
    return null !== n.af1(e);
  }
  function ag3(n) {
    return "component" === n.type || "helper" === n.type
      ? n.component.scope
      : null;
  }
  function gb3(n, e, t) {
    if ("service" === e.type || "factory" === e.type) return {};
    switch (n) {
      case BLOCK_ARGUMENT_KEY:
        return ca0(t, e.component);
      case PATCH_ARGUMENT_KEY:
        return df0(t, e.component);
      case PARENT_ARGUMENT_KEY:
        return ad0(t, e.component);
      case APP_ARGUMENT_KEY:
        return bf0(t);
      case COMPONENT_ARGUMENT_KEY:
        return bg0(t, e.component);
      default:
        return {};
    }
  }
  function fe3(n, e, t, r) {
    if (ca5(t, n.id, r).has(e))
      throw new Error(
        `Circular dependency detected: Component "${n.name}" cannot depend on its parent "${e}".`,
      );
  }
  function ca5(n, e, t) {
    const r = new Set(),
      o = n.ce0(e);
    if (null !== o) {
      const e = n.be0(o);
      if (null !== e) {
        t.tryAlias ? null !== e.alias && r.add(e.alias) : r.add(e.name);
        ca5(n, o, t).forEach((n) => r.add(n));
      }
    }
    return r;
  }
  function ab0(n, e, t) {
    function r({ withAlias: r }) {
      return (
        fe3(e, n, t, { tryAlias: r }),
        dg3(n, e, t, { matchUsingAlias: r })
      );
    }
    const o = r({ withAlias: !1 });
    return null !== o ? o : r({ withAlias: !0 });
  }
  function dg3(n, e, t, r) {
    if (e.name === n)
      throw new Error(
        `Circular dependency detected: Component "${e.name}" cannot depend on itself.`,
      );
    const o = ad4(e, n, t, r);
    if (o.length > 0) {
      const n = {};
      for (let e = 0; e < o.length; e++) {
        const r = o[e];
        ac8(r.name, r, t, fg1, fb3(t, fg1));
        n[r.id] = r;
      }
      return t.gc0(n);
    }
    return null;
  }
  function ad4(n, e, t, r) {
    const o = t.ea0(n.id),
      c = [];
    return (
      o.forEach((n) => {
        const o = t.be0(n);
        if (null !== o) {
          if (r.matchUsingAlias && o.alias === e) return void c.push(o);
          if (!r.matchUsingAlias && o.name === e) return void c.push(o);
        }
      }),
      c
    );
  }
  function ac8(n, e, t, r, o) {
    const c = e.getProxy();
    if (null !== c) return c;
    const i = t.ag0(n);
    if (null === i) throw new Error(`Missing component handler ${n}`);
    const u = i(...o({ dependencies: r(i), type: "component", component: e }));
    return (e.setProxy(u), u);
  }
  function gg3(n, e, t, r) {
    let o = e.ac1(n);
    if (null === o) throw new Error(`Missing factory handler ${n}`);
    const c = o(...r({ dependencies: t(o), type: "factory" }));
    if ("function" == typeof c) return c;
    throw new Error(`Factory ${n} handler must return class reference`);
  }
  function bc4(n, e, t, r) {
    e.be2(n);
    const o = e.dg0(n);
    if (null === o) throw new Error(`Missing service handler ${n}`);
    let c = o(...r({ dependencies: t(o), type: "service" }));
    return (null == c && (c = {}), e.ac2(n, c), c);
  }
  function ff2(n, e, t, r, o) {
    let c = e.af1(n);
    if (null === c) throw new Error(`Missing helper handler ${n}`);
    const i = c(...r({ component: o, dependencies: t(c), type: "helper" }));
    if (null != i && "object" != typeof i)
      throw new Error(`Helper ${n} must return an object`);
    return i;
  }
  var LibraryBrand = Symbol("LibraryBrand"),
    ComponentFamilyTreeBrand = Symbol("ComponentFamilyTreeBrand"),
    RegistryBrand = Symbol("RegistryBrand");
  function dg4() {
    return {
      data: {
        component: new Map(),
        service: new Map(),
        factory: new Map(),
        helper: new Map(),
      },
      [LibraryBrand]: !0,
    };
  }
  function eb0(n) {
    if ("data" in n) return n;
    throw new PluncError("ERR4");
  }
  function gf6(n, e, t, r) {
    const o = eb0(n);
    switch (t) {
      case "component":
        o.data.component.set(e, r);
        break;
      case "service":
        o.data.service.set(e, r);
        break;
      case "factory":
        o.data.factory.set(e, r);
        break;
      case "helper":
        o.data.helper.set(e, r);
    }
  }
  function dc3(n, e) {
    var t;
    return null !== (t = eb0(n).data.component.get(e)) && void 0 !== t
      ? t
      : null;
  }
  function dg5(n, e) {
    var t;
    return null !== (t = eb0(n).data.service.get(e)) && void 0 !== t ? t : null;
  }
  function aa0(n, e) {
    var t;
    return null !== (t = eb0(n).data.factory.get(e)) && void 0 !== t ? t : null;
  }
  function ba3(n, e) {
    var t;
    return null !== (t = eb0(n).data.helper.get(e)) && void 0 !== t ? t : null;
  }
  function ec2(n) {
    if ("data" in n) return n;
    throw new PluncError("ERR5");
  }
  function cc1() {
    return { data: {}, [ComponentFamilyTreeBrand]: !0 };
  }
  function be6(n, e, t) {
    const r = ec2(n);
    (void 0 === r.data[e] && (r.data[e] = { parent: null, children: [] }),
      r.data[e].children.push(t),
      void 0 === r.data[t] && (r.data[t] = { parent: e, children: [] }));
  }
  function eb1(n, e) {
    const t = ec2(n);
    if (void 0 === t.data[e]) return [];
    const r = [];
    let o = t.data[e].parent;
    for (; null !== o; ) (r.push(o), (o = t.data[o].parent));
    return r;
  }
  function df2(n, e) {
    const t = ec2(n);
    return void 0 === t.data[e] ? [] : t.data[e].children;
  }
  function cb3(n, e) {
    const t = ec2(n);
    return void 0 === t.data[e] ? null : t.data[e].parent;
  }
  function ed2(n, e) {
    const t = ec2(n);
    if (void 0 === t.data[e]) return [];
    const r = t.data[e].parent;
    if (null === r) return [];
    return t.data[r].children.filter((n) => n !== e);
  }
  function bd4(n) {
    return function (e) {
      const t = n(GLOBAL_LOCK_ID_DIRECTIVE);
      e.setAttribute(t, GLOBAL_LOCK_ID_DIRECTIVE_VALUE);
    };
  }
  function ad5(n) {
    return function (e) {
      const t = n(GLOBAL_LOCK_ID_DIRECTIVE);
      return null !== e.getAttribute(t);
    };
  }
  function dc4(n) {
    return function (e, t) {
      const r = n(GLOBAL_EVENT_LOCK_DIRECTIVE),
        o = e.getAttribute(r);
      if (null === o) return !1;
      return o.split(",").includes(t);
    };
  }
  function dd3(n) {
    return function (e, t) {
      const r = n(GLOBAL_EVENT_LOCK_DIRECTIVE),
        o = e.getAttribute(r);
      if (null === o) return void e.setAttribute(r, t);
      let c = o.split(",");
      for (let n = 0; n < c.length; n++) {
        c[n] !== t && c.push(t);
      }
      e.setAttribute(r, c.join(","));
    };
  }
  function eb2(n, e) {
    return function (t, r) {
      [BLOCK_ELEMENT_DIRECTIVE].forEach((o) => {
        const c = n.gf0(o);
        e(r, `[${c}]`).forEach((e) => {
          n.ca1(e, COMPONENT_REFERENCE_DIRECTIVE, t);
        });
      });
    };
  }
  function fe4(n, e, t, r, o) {
    const c = [];
    let i = !1;
    return {
      config: t,
      library: r,
      registry: o,
      name: e,
      id: n,
      ad6: function () {
        return c;
      },
      emitReady: function () {
        i = !0;
        for (const n of c) n();
      },
      isReady: function () {
        return i;
      },
      onReady: function (n) {
        c.push(n);
      },
    };
  }
  function df3() {
    return {
      data: { components: new Map(), services: new Map() },
      [RegistryBrand]: !0,
    };
  }
  function gb4(n) {
    if ("data" in n) return n;
    throw new PluncError("ERR6");
  }
  function gd0(n, e, t) {
    gb4(n).data.components.set(e, t);
  }
  function be0(n, e) {
    var t;
    return null !== (t = gb4(n).data.components.get(e)) && void 0 !== t
      ? t
      : null;
  }
  function cd0(n, e) {
    const t = gb4(n),
      r = [];
    return (
      e.forEach((n) => {
        const e = t.data.components.get(n);
        e && r.push(e);
      }),
      r
    );
  }
  function cg0(n) {
    const e = gb4(n);
    return Array.from(e.data.components.values());
  }
  function ac2(n, e, t) {
    gb4(n).data.services.set(e, t);
  }
  function be2(n, e) {
    var t;
    return null !== (t = gb4(n).data.services.get(e)) && void 0 !== t
      ? t
      : null;
  }
  function cd1(n, e) {
    const t = gb4(n),
      r = [];
    return (
      e.forEach((n) => {
        const e = t.data.services.get(n);
        e && r.push(e);
      }),
      r
    );
  }
  function gc2(n, e) {
    if (null !== n)
      for (; n.childNodes.length > 0; ) e.appendChild(n.childNodes[0]);
  }
  function ed4(n, e) {
    return function (t, r, o) {
      const c = {};
      for (let t = 0; t < o.length; t++) {
        const i = o[t],
          u = document.implementation.createHTMLDocument().body,
          a = e(r, i);
        null !== a && (n(a, u), (c[i] = u));
      }
      ((r.innerHTML = ""), n(t, r));
      for (const t in c) {
        const o = e(r, t);
        if (null === o) continue;
        const i = c[t];
        n(i, o);
      }
    };
  }
  function fc0(n) {
    const e = document.implementation.createHTMLDocument().body;
    return (
      Object.defineProperty(e, "$plStgCS", {
        value: !1,
        writable: !0,
        enumerable: !1,
        configurable: !1,
      }),
      n && (e.innerHTML = n),
      e
    );
  }
  function ae0(n, e) {
    if (n.$plStgCS) throw new PluncError("ERR1");
    n.innerHTML = e;
  }
  function bc0(n) {
    if (n.$plStgCS) throw new PluncError("ERR2");
    return n.innerHTML;
  }
  function bf1(n, e) {
    if (n.$plStgCS) throw new PluncError("ERR3");
    for (; n.firstChild; ) e.appendChild(n.firstChild);
    n.$plStgCS = !0;
  }
  function dc5(n) {
    const e = new Map(),
      t = Array.from(n.querySelectorAll("template")),
      r = `${GLOBAL_DIRECTIVE_FOR_TEMPLATE_NAME}`;
    for (const n of t) {
      const t = n.getAttribute(r);
      t && e.set(t, n.innerHTML);
    }
    return e;
  }
  var contexts = [],
    createContainer = ad1(
      fe4,
      df3,
      gd0,
      be0,
      cd0,
      cg0,
      ac2,
      be2,
      cd1,
      dg4,
      gf6,
      dg5,
      dc3,
      aa0,
      ba3,
      cc1,
      be6,
      eb1,
      df2,
      cb3,
      ed2,
      fd1,
      bf3,
      gg2,
      de3,
      fe2,
      bc2,
      db2,
      bd3,
      ef1,
      bd4,
      ad5,
      dc4,
      dd3,
      eg1,
      ee3,
      be3,
      ae1,
      gf1,
      cd3,
      fc0,
      ae0,
      bc0,
      bf1,
    ),
    plunc = (window.plunc = {
      create: (n, e = null) => {
        const t = contexts.length + 1,
          r = createContainer(t, n, e);
        return (
          contexts.push(r),
          {
            component: ac7(r),
            service: bc3(r),
            factory: de4(r),
            helper: ca3(r),
          }
        );
      },
    });
  function shouldInit(n) {
    return __async(this, null, function* () {
      return n.dc0().config.startFn();
    });
  }
  function bootstrap(n) {
    return __async(this, null, function* () {
      if (0 === n.length) return;
      const [e, ...t] = n;
      if (!(yield shouldInit(e))) return;
      const r = dc5(document.body),
        o = fc0(r.get(e.dc0().name)),
        c = fe2(e.dc0());
      bd2(e, r, db2, c, eb2(e, db2))(o, "");
      const i = e.cg0();
      for (const n in i) {
        const t = i[n],
          r = fb3(e, fg1);
        ac8(t.name, t, e, fg1, r);
      }
      for (const n in i) {
        const t = i[n],
          r = e.bd0(o, t.id);
        if (null === r) continue;
        const c = document.implementation.createHTMLDocument().body;
        c.innerHTML = r.innerHTML;
        const u = e.ea0(t.id);
        e.ec0(c, u);
        ac4(e)(c, t.scope, !1);
        ed4(gc2, e.bd0)(c, r, u);
      }
      const u = gb2(e.dc0().name);
      (u.replaceChildren(), e.bf1(o, u), e.dc0().emitReady());
      const a = e.dc0().ad6();
      for (let n = 0; n < a.length; n++) {
        (0, a[n])();
      }
      bootstrap(t);
    });
  }
  DOMHelper.ready(bootstrap.bind(null, contexts));
})();
