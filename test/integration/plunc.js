"use strict";
(() => {
  var __async = (n, t, e) =>
    new Promise((r, o) => {
      var i = (n) => {
          try {
            c(e.next(n));
          } catch (n) {
            o(n);
          }
        },
        u = (n) => {
          try {
            c(e.throw(n));
          } catch (n) {
            o(n);
          }
        },
        c = (n) => (n.done ? r(n.value) : Promise.resolve(n.value).then(i, u));
      c((e = e.apply(n, t)).next());
    });
  function o4(n) {
    var t, e, r;
    return {
      prefix:
        null !== (t = null == n ? void 0 : n.prefix) && void 0 !== t
          ? t
          : "plunc-",
      startFn:
        null !== (e = null == n ? void 0 : n.startFn) && void 0 !== e
          ? e
          : () => new Promise((n) => n(!0)),
      endFn:
        null !== (r = null == n ? void 0 : n.endFn) && void 0 !== r
          ? r
          : () => new Promise((n) => n()),
    };
  }
  function i2(
    n,
    t,
    e,
    r,
    o,
    i,
    u,
    c,
    s,
    l,
    a,
    f,
    d,
    p,
    m,
    h,
    g,
    v,
    w,
    y,
    b,
    E,
    $,
    x,
    C,
    L,
    R,
    T,
    M,
    j,
    P,
    A,
    S,
    k,
    H,
    q,
    F,
    O,
    I,
    N,
    B,
    D,
    X,
    _,
  ) {
    return function (U, Y, z = null) {
      const J = o4(z),
        K = t(),
        W = l(),
        G = h(),
        Q = n(U, Y, J, W, K),
        V = E(J),
        Z = $(V),
        nn = x(V),
        tn = F(V, T),
        en = O(C),
        rn = M(V, R),
        on = I();
      return {
        c9: () => Q,
        f5: function (n, t, e) {
          a(W, n, t, e);
        },
        f6: function (n) {
          return f(W, n);
        },
        f7: function (n) {
          return d(W, n);
        },
        f8: function (n) {
          return p(W, n);
        },
        f9: function (n) {
          return m(W, n);
        },
        g0: function (n, t) {
          e(K, n, t);
        },
        d7: function (n) {
          return r(K, n);
        },
        g1: function (n) {
          return o(K, n);
        },
        f0: function () {
          return i(K);
        },
        g2: function (n, t) {
          u(K, n, t);
        },
        g3: function (n) {
          return c(K, n);
        },
        g4: function (n) {
          return s(K, n);
        },
        g5: function (n, t) {
          g(G, n, t);
        },
        g6: function (n) {
          return v(G, n);
        },
        f1: function (n) {
          return w(G, n);
        },
        d6: function (n) {
          return y(G, n);
        },
        g7: function (n) {
          return b(G, n);
        },
        e4: V,
        g8: Z,
        g9: nn,
        h0: C,
        h1: L(Q),
        h2: R,
        e5: T,
        d3: rn,
        h3: j(T, V),
        h4: P(V),
        h5: A(V),
        h6: k(V),
        h7: S(V),
        h8: H,
        f2: q(rn),
        d4: tn,
        h9: en,
        d8: on,
        i0: N,
        e0: B,
        e1: D,
        i1: X,
        e3: _,
      };
    };
  }
  function l9(n) {
    var t;
    return {
      name: n.split(" as ")[0],
      alias: null !== (t = n.split(" as ")[1]) && void 0 !== t ? t : null,
    };
  }
  var a2 = "plunc-app",
    a0 = "plunc-name",
    a7 = "plunc-set",
    a1 = "true",
    a4 = "plunc-event",
    a5 = "[PREFIX]component",
    b4 = "[PREFIX]cid",
    a8 = "[PREFIX]repeat",
    c3 = "[PREFIX]if",
    a9 = "[PREFIX]check",
    b0 = "[PREFIX]style",
    b1 = "[PREFIX]model",
    a6 = "[PREFIX]disable",
    c0 = "[PREFIX]click",
    b7 = "[PREFIX]change",
    c1 = "[PREFIX]touch",
    b2 = "[PREFIX]block",
    a3 = "[PREFIX]rid",
    c5 = "$scope",
    c6 = "$block",
    c4 = "$parent",
    c7 = "$patch",
    c8 = "$app",
    b8 = "$this",
    b9 = "$$index";
  function w2(n) {
    const t = n.prefix;
    return function (n) {
      return n.replace("[PREFIX]", t);
    };
  }
  function m0(n, t, e) {
    return `[${e(b2)}="${n}"][${e(a3)}="${t.id}"]`;
  }
  function m1(n, t) {
    return function (e, r) {
      const o = m0(e, r, n);
      return function (n) {
        return t(n, o);
      };
    };
  }
  function m5() {
    return function (n) {
      return new Proxy(n, {
        get: function (n, t) {
          for (const e in n) {
            const r = n[e],
              o = r.m4();
            if (null === o) {
              const n = r.name;
              throw new Error(
                `Cannot invoke component "${n}}" before $app is ready`,
              );
            }
            if (!(t in o))
              throw new Error(
                `Calling undefined member "${t}" in component "${r.name}"`,
              );
            return o[t];
          }
        },
      });
    };
  }
  function m9(n) {
    return function (t, e) {
      const { name: r, alias: o } = n(e);
      let i = null,
        u = `\x3c!-- Component ${t} Template --\x3e`;
      return {
        id: t,
        name: r,
        alias: o,
        scope: {},
        m7: function (n) {
          i = n;
        },
        m4: function () {
          return i;
        },
        m8: function (n) {
          u = n;
        },
        e2: function () {
          return u;
        },
      };
    };
  }
  function n2(n) {
    return function (t, e) {
      return "" !== e
        ? `${e}.${t.toString()}`
        : `${n.id.toString()}.${t.toString()}`;
    };
  }
  function n3(n, t, e, r, o) {
    function i(u, c) {
      const s = n6(u, n, e);
      let l = 0;
      s.forEach((e) => {
        const u = r(l, c);
        (l++,
          (function (e, r, u) {
            const c = n9(n, e);
            (n.g9(e, b4, r), n.g5(u, r));
            const s = o3(r, c, o0(n, e), n);
            (o2(n, s), n.g0(r, s));
            const l = t.get(c);
            if (void 0 === l)
              throw new Error(`Template not found for component: ${c}`);
            ((e.innerHTML = l), o(r, e), i(e, r), s.m8(e.innerHTML));
          })(e, u, c));
      });
    }
    return i;
  }
  function n6(n, t, e) {
    return e(n, `[${t.e4(a5)}]`);
  }
  function n7(n, t) {
    return function (e, r) {
      const o = n(b4);
      return t(e, `[${o}="${r}"]`);
    };
  }
  function n9(n, t) {
    const e = o1(n, t);
    return n.h0(e).name;
  }
  function o0(n, t) {
    const e = o1(n, t);
    return n.h0(e).alias;
  }
  function o1(n, t) {
    const e = n.g8(t, a5);
    if (!e)
      throw new Error(`Component element is missing the ${a5} attribute.`);
    return e;
  }
  function o2(n, t) {
    const e = t.name,
      r = n.g6(t.id);
    n.g1(r).forEach((n) => {
      if (n && "name" in n && n.name === e)
        throw new Error(`Circular dependency detected for component: ${e}`);
    });
  }
  function o3(n, t, e, r) {
    const o = r.d7(n);
    return null !== o ? o : r.h9(n, e ? `${t}:${e}` : t);
  }
  function i4(n) {
    return function (t, e) {
      n.h3(t, a9).forEach((t) => {
        if (n.h5(t)) return;
        const r = n.g8(t, a9);
        if (null === r || "" === r.trim()) return;
        const o = n.i0(e, r);
        ("boolean" == typeof o &&
          (o
            ? t.setAttribute("checked", "true")
            : t.removeAttribute("checked")),
          n.h4(t));
      });
    };
  }
  function i6(n) {
    return function (t, e) {
      n.h3(t, c3).forEach((t) => {
        if (n.h5(t)) return;
        const r = n.g8(t, c3);
        if (null === r || "" === r.trim()) return;
        const o = n.i0(e, r);
        ("boolean" == typeof o &&
          !1 === o &&
          n.h8(t, "condition evaluated to false"),
          n.h4(t));
      });
    };
  }
  function i8(n) {
    return function (t, e) {
      n.h3(t, a6).forEach((t) => {
        if (n.h5(t)) return;
        const r = n.g8(t, a6);
        if (null === r || "" === r.trim()) return;
        const o = n.i0(e, r);
        ("boolean" == typeof o &&
          (o
            ? t.setAttribute("disabled", "true")
            : t.removeAttribute("disabled")),
          n.h4(t));
      });
    };
  }
  function p9(n, t, e = null) {
    return q1(n, t, q0(t), e);
  }
  function q0(n) {
    return /^'.*'$/.test(n)
      ? "S"
      : isNaN(n)
        ? (n.includes("(") && n.includes("==")) ||
          (n.includes("(") && n.includes("is ")) ||
          (n.includes("(") && n.includes(">")) ||
          (n.includes("(") && n.includes("<"))
          ? "C"
          : n.includes("(")
            ? "F"
            : n.includes("==") ||
                n.includes("is ") ||
                n.includes(">") ||
                n.includes("<")
              ? "C"
              : n.includes("+") ||
                  n.includes("-") ||
                  n.includes("/") ||
                  n.includes("*") ||
                  n.includes("%")
                ? "OP"
                : "false" == n || "true" == n || "null" == n
                  ? "B"
                  : "OB"
        : "N";
  }
  function q1(dataCtx, expression, resolveType, element = null) {
    switch (resolveType) {
      case "S":
        return expression.slice(1, -1);
      case "B":
        if ("true" == expression) return !0;
        if ("false" == expression) return !1;
        if ("null" == expression) return null;
        break;
      case "OB":
        return q2(dataCtx, expression);
      case "F":
        let structure = expression.split("("),
          expressionTest = structure[0].split(".");
        if (expressionTest.length > 1) {
          let n = p9(dataCtx, q4(structure[0])),
            t = expression
              .split(".")
              .slice(expressionTest.length - 1)
              .join(".");
          return q3(n, dataCtx, t, element);
        }
        return Object.prototype.hasOwnProperty.call(dataCtx, structure[0])
          ? q3(dataCtx, dataCtx, expression, element)
          : "";
      case "C":
        const evaluatorMap = {
          "!==": q8,
          "==": q7,
          "is not ": q8,
          "is ": q7,
          ">=": r0,
          ">": q9,
          "<=": r2,
          "<": r1,
        };
        for (const n in evaluatorMap)
          if (expression.includes(n))
            return evaluatorMap[n](dataCtx, expression, n);
        return !1;
      case "N":
        return Number(expression);
      case "OP":
        let finalExpression = expression,
          operations = ["+", "-", "*", "/", "%"];
        for (var i = 0; i < operations.length; i++)
          if (expression.includes(operations[i])) {
            let n = expression.split(operations[i]),
              t = p9(dataCtx, n[0].trim());
            var right = p9(dataCtx, n[1].trim());
            finalExpression = t + operations[i] + right;
          }
        return eval(finalExpression);
    }
  }
  function q2(n, t) {
    return "$dataCtx" === t
      ? n
      : t.split(".").reduce(function (n, t) {
          if (null != n && void 0 !== n[t]) return n[t];
        }, n);
  }
  function q3(n, t, e, r) {
    if (void 0 === n) return "";
    const o = e.match(/\(([^)]+)\)/);
    let i = e.split("(")[0];
    if (null !== o) {
      const e = new Array(),
        u = o[1].split(",");
      for (let n = 0; n < u.length; n++) e.push(p9(t, u[n].trim()));
      return (
        null !== r && e.push(r),
        n[i] instanceof Function ? n[i](...e) : ""
      );
    }
    if (null !== r) {
      const t = new Array();
      return (t.push(r), n[i](...t));
    }
    return n[i] instanceof Function ? n[i]() : "";
  }
  function q4(n) {
    let t = n.split(".");
    return t.length < 2 ? "$dataCtx" : (t.pop(), t.join("."));
  }
  function q5(n, t) {
    return p9(n, q4(t));
  }
  function q6(n) {
    let t = n.split(".");
    return t[t.length - 1];
  }
  function q7(n, t, e) {
    const [r, o] = t.split(e).map((t) => p9(n, t.trim()));
    return r === o;
  }
  function q8(n, t, e) {
    const [r, o] = t.split(e).map((t) => p9(n, t.trim()));
    return r !== o;
  }
  function q9(n, t, e) {
    const [r, o] = t.split(e).map((t) => p9(n, t.trim()));
    return r > o;
  }
  function r0(n, t, e) {
    const [r, o] = t.split(e).map((t) => p9(n, t.trim()));
    return r >= o;
  }
  function r1(n, t, e) {
    const [r, o] = t.split(e).map((t) => p9(n, t.trim()));
    return r < o;
  }
  function r2(n, t, e) {
    const [r, o] = t.split(e).map((t) => p9(n, t.trim()));
    return r <= o;
  }
  var PluncElement = class n {
    constructor(n, t = null) {
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
        this.w5(null != t ? t : 1));
    }
    w5(t) {
      const e = this.$element.parentElement;
      t > 3 || null === e || (this.$parent = new n(e, t++));
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
      const t = this.listClass();
      for (var e = 0; e < t.length; e++) {
        t[e] === n ? this.removeClass(n) : this.addClass(n);
      }
    }
  };
  function j0(n, t, e, r) {
    "F" === q0(e) &&
      t.addEventListener(r, () => {
        const r = new PluncElement(t);
        p9(n, e, r);
      });
  }
  function j1(n) {
    return function (t, e) {
      [
        { t: "click", a: c0 },
        { t: "change", a: b7 },
        { t: "keyup", a: c1 },
      ].forEach((r) => {
        n.h3(t, r.a).forEach((t) => {
          if (n.h7(t, r.t)) return;
          const o = n.g8(t, r.a);
          null !== o && "" !== o.trim() && (j0(e, t, o, r.t), n.h6(t, r.t));
        });
      });
    };
  }
  function j3(n) {
    var t, e, r;
    const o = n.split("-"),
      i = null !== (t = o[0]) && void 0 !== t ? t : null;
    if (null === i || i.length < 4)
      throw new Error(
        "models assigned to Date input elements must follow standard HTML5 format YYYY-MM-DD",
      );
    const u = null !== (e = o[1]) && void 0 !== e ? e : null;
    if (null === u || parseInt(u) > 12) throw new Error(u);
    const c = null !== (r = o[2]) && void 0 !== r ? r : null;
    if (null === c || parseInt(c) > 31) throw new Error(c);
  }
  function j4(n) {
    var t, e;
    const r =
        "models assigned to Time input elements must follow standard HTML5 format HH:MM",
      o = n.split(":"),
      i = null !== (t = o[0]) && void 0 !== t ? t : null;
    if (null === i || i.length < 2 || parseInt(i) > 23) throw new Error(r);
    const u = null !== (e = o[1]) && void 0 !== e ? e : null;
    if (null === u || u.length < 2 || parseInt(u) > 59) throw new Error(r);
  }
  function j5(n, t, e) {
    const r = q5(n, t),
      o = q6(t);
    void 0 !== r && (r[o] = e);
  }
  function j6(n, t) {
    "boolean" == typeof t && t
      ? n.setAttribute("checked", "")
      : n.removeAttribute("checked");
  }
  function j7() {
    const n = new Date(Date.now()),
      t = n.getMonth() + 1,
      e = t < 10 ? `0${t}` : t,
      r = `${n.getFullYear()}-${e}-${n.getDate()}`;
    return (j3(r), r);
  }
  function j8() {
    const n = new Date(Date.now()),
      t =
        (n.getHours() < 10 ? `0${n.getHours()}` : n.getHours()) +
        ":" +
        (n.getMinutes() < 10 ? `0${n.getMinutes()}` : n.getMinutes());
    return (j4(t), t);
  }
  function j9(n) {
    return null == n
      ? ""
      : "object" == typeof n
        ? JSON.stringify(n)
        : String(n);
  }
  function k0(n, t, e, r) {
    const o = n.type.toLowerCase();
    if ("radio" !== o && "checkbox" !== o) return;
    const i = n;
    void 0 === r
      ? (j5(t, e, !1), j6(i, !1))
      : "boolean" == typeof r
        ? j6(i, r)
        : console.warn(
            "Model directive assigned to checkbox/radio input elements must be of boolean type.",
          );
  }
  function k1(n, t, e, r) {
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
      void 0 === r ? j5(t, e, o.value) : (o.value = j9(r));
    }
  }
  function k2(n, t, e, r) {
    if ("number" === n.type.toLowerCase()) {
      const o = n;
      void 0 === r ? (j5(t, e, 0), (o.value = "0")) : (o.value = j9(r));
    }
  }
  function k3(n, t, e, r) {
    return function (o) {
      o(n, t, e, r);
    };
  }
  function k5(n, t, e, r) {
    if ("date" === n.type.toLowerCase()) {
      const o = n;
      if (void 0 === r) {
        const n = j7();
        (j5(t, e, n), (o.value = n));
      } else {
        const n = j9(r);
        (j3(n), (o.value = n));
      }
    }
  }
  function k6(n, t, e, r) {
    if ("time" === n.type.toLowerCase()) {
      const o = n;
      if (void 0 === r) {
        const n = j8();
        (j5(t, e, n), (o.value = n));
      } else {
        const n = j9(r);
        (j4(n), (o.value = n));
      }
    }
  }
  function k7(n) {
    return function (t, e) {
      n.h3(t, b1).forEach((t) => {
        const r = n.g8(t, b1);
        if (null === r || "" === r.trim()) return;
        if (n.h5(t)) return;
        let o = n.i0(e, r);
        if ("INPUT" === t.tagName || "SELECT" === t.tagName) {
          if (t instanceof HTMLInputElement) {
            const n = k3(t, e, r, o);
            (n(k0), n(k1), n(k2), n(k5), n(k6));
          }
          (t instanceof HTMLSelectElement &&
            (void 0 === o ? j5(e, r, t.value) : (t.value = j9(o))),
            t.addEventListener("change", (n) => {
              const t = n.target;
              if (t instanceof HTMLInputElement) {
                const n = t.type.toLowerCase();
                if ("radio" === n || "checkbox" === n) {
                  const n = t.checked;
                  return void j5(e, r, n);
                }
                j5(e, r, t.value);
              }
              t instanceof HTMLSelectElement && j5(e, r, t.value);
            }));
        } else
          "TEXTAREA" === t.tagName &&
            t instanceof HTMLTextAreaElement &&
            (void 0 === o ? j5(e, r, t.value) : (t.value = j9(o)),
            t.addEventListener("change", (n) => {
              const t = n.target;
              if (!(t instanceof HTMLTextAreaElement)) return;
              const o = t.value;
              j5(e, r, o);
            }));
        n.h4(t);
      });
    };
  }
  function k9(n) {
    return function (t, e) {
      const r = new RegExp("(?<=\\{{).+?(?=\\}})", "g"),
        o = t.innerHTML.match(r);
      null !== o &&
        o.forEach((r) => {
          const o = r.trim();
          let i = n.i0(e, o);
          null == i && (i = "");
          const u = `{{${r}}}`;
          t.innerHTML = t.innerHTML.replace(u, String(i));
        });
    };
  }
  function l1(n) {
    return n.includes("until ")
      ? [b9, n.split("until")[1].trim()]
      : [n.split(" as ")[0].trim(), n.split(" as ")[1].trim()];
  }
  function l2(n) {
    if (n instanceof Array) return n.length;
    if ("number" == typeof n && Number.isInteger(n)) return n;
    throw new Error("Repeatable elements must have repeatable values");
  }
  function l3(n) {
    return null !== n && ("object" == typeof n || Array.isArray(n));
  }
  function l4(n) {
    let t = () => {};
    function e(e, r) {
      const o = Object.assign({}, r),
        i = e.innerHTML;
      e.replaceChildren();
      let u = n.g8(e, a8);
      if (null === u || "" === u.trim()) return;
      let [c, s] = l1(u);
      if (c === b9) {
        let t = l2(n.i0(o, s));
        o.$$index = {};
        let e = 0;
        for (; e < t; ) o.$$index["props" + e++] = new Object();
      }
      const l = n.i0(o, c);
      if (!l3(l)) return;
      let a = 0;
      for (const [o, u] of Object.entries(l)) {
        const o = { $parent: r, $index: a, [s]: u },
          c = n.e0(i);
        (t(c, o), n.e3(c, e), a++);
      }
    }
    return function (r, o, i) {
      const u = n.h3(r, a8);
      t = i;
      for (const n of u) e(n, o);
    };
  }
  function l7(n) {
    return function (t, e) {
      n.h3(t, b0).forEach((t) => {
        if (n.h5(t)) return;
        const r = n.g8(t, b0);
        if (null === r || "" === r.trim()) return;
        const o = n.i0(e, r);
        if ("string" == typeof o && "" !== o.trim()) {
          o.split(" ")
            .map((n) => n.trim())
            .forEach((n) => {
              "" !== n && t.classList.add(n);
            });
        }
        n.h4(t);
      });
    };
  }
  function o5(n) {
    const t = l4(n),
      e = i4(n),
      r = i6(n),
      o = i8(n),
      i = j1(n),
      u = k7(n),
      c = k9(n),
      s = l7(n);
    return function n(l, a, f = !0) {
      (t(l, a, n),
        r(l, a),
        c(l, a),
        e(l, a),
        s(l, a),
        u(l, a),
        o(l, a),
        !1 === f && i(l, a));
    };
  }
  function o7(n, t) {
    null !== n &&
      ((n.innerHTML = ""),
      null !== n.parentNode &&
        (n.outerHTML =
          "\x3c!-- plunc.js: " + n.outerHTML + " | " + t + " --\x3e"));
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
    var t = window.onload;
    "function" != typeof window.onload
      ? (window.onload = n)
      : (window.onload = function () {
          (t && t(), n());
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
              } catch (t) {
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
                for (var t = 0; t < document.styleSheets.length; t++)
                  if (document.styleSheets[t].disabled)
                    return void setTimeout(n, 0);
                domReady();
              }
            },
            !1,
          ),
        browser.safari)
      )
        !(function t() {
          if (!isReady)
            if (
              "loaded" == document.readyState ||
              "complete" == document.readyState
            ) {
              if (void 0 === n) {
                for (
                  var e = document.getElementsByTagName("link"), r = 0;
                  r < e.length;
                  r++
                )
                  "stylesheet" == e[r].getAttribute("rel") && n++;
                var o = document.getElementsByTagName("style");
                n += o.length;
              }
              document.styleSheets.length == n ? domReady() : setTimeout(t, 0);
            } else setTimeout(t, 0);
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
  function o8(n, t) {
    return n.querySelector(t);
  }
  function o9(n, t) {
    return Array.from(n.querySelectorAll(t));
  }
  function p0(n, t) {
    return function (e, r, o) {
      const i = t(r);
      return n(e, `[${i}${o ? `="${o}"` : ""}]`);
    };
  }
  function p2(n) {
    return function (t, e) {
      const r = n(e);
      return t.getAttribute(r);
    };
  }
  function p4(n) {
    return function (t, e, r) {
      const o = n(e);
      t.setAttribute(o, r);
    };
  }
  function p6(n) {
    return function (t, e) {
      for (let r = 0; r < e.length; r++) {
        const o = e[r],
          i = n(t, o);
        null !== i && (i.innerHTML = "");
      }
    };
  }
  function p8(n) {
    const t = `[${`${a2}`}="${n}"]`,
      e = document.querySelector(t);
    if (!e) throw new Error(`Cannot find the app root element for app: ${n}`);
    return e;
  }
  function r3(n) {
    return function (t, e) {
      n.f5(t, "component", e);
    };
  }
  function r5(n) {
    return function (t, e) {
      n.f5(t, "service", e);
    };
  }
  function r7(n) {
    return function (t, e) {
      n.f5(t, "factory", e);
    };
  }
  function r9(n) {
    return function (t, e) {
      n.f5(t, "helper", e);
    };
  }
  function d1(n) {
    return {
      ready: (t) => {
        n.c9().d0(t);
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
  function d5(n, t) {
    return function (e, r) {
      if (!n.c9().d2()) throw new PluncError("ERR8");
      const o = n.d3(document.body, t.id);
      if (!o) throw new PluncError("ERR9");
      const i = n.d4(e, t)(o);
      0 !== i.length
        ? i.forEach((n) => {
            r(new PluncElement(n));
          })
        : r(null);
    };
  }
  function d9(n, t) {
    return function () {
      const e = n.d6(t.id);
      if (null === e) return null;
      const r = n.d7(e);
      if (!r) return null;
      const o = {};
      return ((o[e] = r), n.d8(o));
    };
  }
  function e6(n, t) {
    return function (e = null) {
      return __async(this, null, function* () {
        if (!n.c9().d2()) throw new PluncError("ERR10");
        const r = n.d3(document.body, t.id);
        if (!r) throw new PluncError("ERR9");
        const { targetType: o, patchTargetNodes: i } = e7(e, r, t, n);
        for (const r of i) {
          const i = r;
          if (null === i) continue;
          let u = n.e0();
          if ("COMPONENT" === o) n.e1(u, t.e2());
          else {
            if (null === e) continue;
            const r = e8(n, t, e);
            n.e1(u, r);
          }
          (o5(n)(u, t.scope, !1), (i.innerHTML = ""), n.e3(u, i));
        }
      });
    };
  }
  function e7(n, t, e, r) {
    if (null !== n) {
      return { targetType: "BLOCK", patchTargetNodes: r.d4(n, e)(t) };
    }
    return { targetType: "COMPONENT", patchTargetNodes: [t] };
  }
  function e8(n, t, e) {
    const r = n.e0(t.e2()),
      o = `[${n.e4(b2)}="${e}"][${n.e4(a3)}="${t.id}"]`,
      i = n.e5(r, o);
    if (0 === i.length) throw new PluncError("ERR11");
    return i[0].innerHTML;
  }
  function e9(n, t) {
    return function () {
      return {
        id: t.id,
        name: t.name,
        alias: t.alias,
        element: () => {
          if (!n.c9().d2()) throw new PluncError("ERR12");
          const e = n.d3(document.body, t.id);
          return null === e ? null : new PluncElement(e);
        },
      };
    };
  }
  function s1(n) {
    const t = n.toString().split("{")[0];
    if ("(" !== t.charAt(0)) {
      const n = t.split("=>")[0];
      return n === t ? [] : [n.trim()];
    }
    const e = t.match(new RegExp("(?<=\\().+?(?=\\))", "g"));
    return null === e || /[(={})]/g.test(e[0])
      ? []
      : e[0].split(",").map((n) => n.trim());
  }
  function s2(n, t) {
    return function e(r) {
      const o = [];
      return (
        r.dependencies.forEach((i) => {
          if (s4(i)) o.push(s9(r));
          else if (s5(i)) o.push(t0(i, r, n));
          else if (s6(n, i)) {
            const r = t8(i, n, t, e);
            o.push(r);
          } else if (s7(n, i)) {
            const r = t7(i, n, t, e);
            o.push(r);
          } else {
            if (s8(n, i)) {
              if ("component" === r.type || "helper" === r.type) {
                const u = t9(i, n, t, e, r.component);
                return void o.push(u);
              }
              throw new Error(
                `Helper dependency "${i}" can only be injected into components or helpers`,
              );
            }
            if ("component" !== r.type)
              (console.warn(`Unresolved dependency: "${i}"`), o.push(null));
            else {
              const t = t3(i, r.component, n);
              o.push(t);
            }
          }
        }),
        o
      );
    };
  }
  function s4(n) {
    return n === c5;
  }
  function s5(n) {
    return n.startsWith("$");
  }
  function s6(n, t) {
    return null !== n.f6(t);
  }
  function s7(n, t) {
    return null !== n.f8(t);
  }
  function s8(n, t) {
    return null !== n.f9(t);
  }
  function s9(n) {
    return "component" === n.type || "helper" === n.type
      ? n.component.scope
      : null;
  }
  function t0(n, t, e) {
    if ("service" === t.type || "factory" === t.type) return {};
    switch (n) {
      case c6:
        return d5(e, t.component);
      case c7:
        return e6(e, t.component);
      case c4:
        return d9(e, t.component);
      case c8:
        return d1(e);
      case b8:
        return e9(e, t.component);
      default:
        return {};
    }
  }
  function t1(n, t, e, r) {
    if (t2(e, n.id, r).has(t))
      throw new Error(
        `Circular dependency detected: Component "${n.name}" cannot depend on its parent "${t}".`,
      );
  }
  function t2(n, t, e) {
    const r = new Set(),
      o = n.d6(t);
    if (null !== o) {
      const t = n.d7(o);
      if (null !== t) {
        e.tryAlias ? null !== t.alias && r.add(t.alias) : r.add(t.name);
        t2(n, o, e).forEach((n) => r.add(n));
      }
    }
    return r;
  }
  function t3(n, t, e) {
    function r({ withAlias: r }) {
      return (
        t1(t, n, e, { tryAlias: r }),
        t4(n, t, e, { matchUsingAlias: r })
      );
    }
    const o = r({ withAlias: !1 });
    return null !== o ? o : r({ withAlias: !0 });
  }
  function t4(n, t, e, r) {
    if (t.name === n)
      throw new Error(
        `Circular dependency detected: Component "${t.name}" cannot depend on itself.`,
      );
    const o = t5(t, n, e, r);
    if (o.length > 0) {
      const n = {};
      for (let t = 0; t < o.length; t++) {
        const r = o[t];
        t6(r.name, r, e, s1, s2(e, s1));
        n[r.id] = r;
      }
      return e.d8(n);
    }
    return null;
  }
  function t5(n, t, e, r) {
    const o = e.f1(n.id),
      i = [];
    return (
      o.forEach((n) => {
        const o = e.d7(n);
        if (null !== o) {
          if (r.matchUsingAlias && o.alias === t) return void i.push(o);
          if (!r.matchUsingAlias && o.name === t) return void i.push(o);
        }
      }),
      i
    );
  }
  function t6(n, t, e, r, o) {
    const i = t.m4();
    if (null !== i) return i;
    const u = e.f7(n);
    if (null === u) throw new Error(`Missing component handler ${n}`);
    const c = u(...o({ dependencies: r(u), type: "component", component: t }));
    return (t.m7(c), c);
  }
  function t7(n, t, e, r) {
    let o = t.f8(n);
    if (null === o) throw new Error(`Missing factory handler ${n}`);
    const i = o(...r({ dependencies: e(o), type: "factory" }));
    if ("function" == typeof i) return i;
    throw new Error(`Factory ${n} handler must return class reference`);
  }
  function t8(n, t, e, r) {
    t.g3(n);
    const o = t.f6(n);
    if (null === o) throw new Error(`Missing service handler ${n}`);
    let i = o(...r({ dependencies: e(o), type: "service" }));
    return (null == i && (i = {}), t.g2(n, i), i);
  }
  function t9(n, t, e, r, o) {
    let i = t.f9(n);
    if (null === i) throw new Error(`Missing helper handler ${n}`);
    const u = i(...r({ component: o, dependencies: e(i), type: "helper" }));
    if (null != u && "object" != typeof u)
      throw new Error(`Helper ${n} must return an object`);
    return u;
  }
  var LibraryBrand = Symbol("LibraryBrand"),
    ComponentFamilyTreeBrand = Symbol("ComponentFamilyTreeBrand"),
    RegistryBrand = Symbol("RegistryBrand");
  function u0() {
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
  function u1(n) {
    if ("data" in n) return n;
    throw new PluncError("ERR4");
  }
  function u2(n, t, e, r) {
    const o = u1(n);
    switch (e) {
      case "component":
        o.data.component.set(t, r);
        break;
      case "service":
        o.data.service.set(t, r);
        break;
      case "factory":
        o.data.factory.set(t, r);
        break;
      case "helper":
        o.data.helper.set(t, r);
    }
  }
  function u3(n, t) {
    var e;
    return null !== (e = u1(n).data.component.get(t)) && void 0 !== e
      ? e
      : null;
  }
  function u4(n, t) {
    var e;
    return null !== (e = u1(n).data.service.get(t)) && void 0 !== e ? e : null;
  }
  function u5(n, t) {
    var e;
    return null !== (e = u1(n).data.factory.get(t)) && void 0 !== e ? e : null;
  }
  function u6(n, t) {
    var e;
    return null !== (e = u1(n).data.helper.get(t)) && void 0 !== e ? e : null;
  }
  function u7(n) {
    if ("data" in n) return n;
    throw new PluncError("ERR5");
  }
  function u8() {
    return { data: {}, [ComponentFamilyTreeBrand]: !0 };
  }
  function u9(n, t, e) {
    const r = u7(n);
    (void 0 === r.data[t] && (r.data[t] = { parent: null, children: [] }),
      r.data[t].children.push(e),
      void 0 === r.data[e] && (r.data[e] = { parent: t, children: [] }));
  }
  function v0(n, t) {
    const e = u7(n);
    if (void 0 === e.data[t]) return [];
    const r = [];
    let o = e.data[t].parent;
    for (; null !== o; ) (r.push(o), (o = e.data[o].parent));
    return r;
  }
  function v1(n, t) {
    const e = u7(n);
    return void 0 === e.data[t] ? [] : e.data[t].children;
  }
  function v2(n, t) {
    const e = u7(n);
    return void 0 === e.data[t] ? null : e.data[t].parent;
  }
  function v3(n, t) {
    const e = u7(n);
    if (void 0 === e.data[t]) return [];
    const r = e.data[t].parent;
    if (null === r) return [];
    return e.data[r].children.filter((n) => n !== t);
  }
  function v4(n) {
    return function (t) {
      const e = n(a7);
      t.setAttribute(e, a1);
    };
  }
  function v5(n) {
    return function (t) {
      const e = n(a7);
      return null !== t.getAttribute(e);
    };
  }
  function v6(n) {
    return function (t, e) {
      const r = n(a4),
        o = t.getAttribute(r);
      if (null === o) return !1;
      return o.split(",").includes(e);
    };
  }
  function v7(n) {
    return function (t, e) {
      const r = n(a4),
        o = t.getAttribute(r);
      if (null === o) return void t.setAttribute(r, e);
      let i = o.split(",");
      for (let n = 0; n < i.length; n++) {
        i[n] !== e && i.push(e);
      }
      t.setAttribute(r, i.join(","));
    };
  }
  function v8(n, t) {
    return function (e, r) {
      [b2].forEach((o) => {
        const i = n.e4(o);
        t(r, `[${i}]`).forEach((t) => {
          n.g9(t, a3, e);
        });
      });
    };
  }
  function w0(n, t, e, r, o) {
    const i = [];
    let u = !1;
    return {
      config: e,
      library: r,
      registry: o,
      name: t,
      id: n,
      f4: function () {
        return i;
      },
      f3: function () {
        u = !0;
        for (const n of i) n();
      },
      d2: function () {
        return u;
      },
      d0: function (n) {
        i.push(n);
      },
    };
  }
  function w6() {
    return {
      data: { components: new Map(), services: new Map() },
      [RegistryBrand]: !0,
    };
  }
  function w7(n) {
    if ("data" in n) return n;
    throw new PluncError("ERR6");
  }
  function g0(n, t, e) {
    w7(n).data.components.set(t, e);
  }
  function d7(n, t) {
    var e;
    return null !== (e = w7(n).data.components.get(t)) && void 0 !== e
      ? e
      : null;
  }
  function g1(n, t) {
    const e = w7(n),
      r = [];
    return (
      t.forEach((n) => {
        const t = e.data.components.get(n);
        t && r.push(t);
      }),
      r
    );
  }
  function f0(n) {
    const t = w7(n);
    return Array.from(t.data.components.values());
  }
  function g2(n, t, e) {
    w7(n).data.services.set(t, e);
  }
  function g3(n, t) {
    var e;
    return null !== (e = w7(n).data.services.get(t)) && void 0 !== e ? e : null;
  }
  function g4(n, t) {
    const e = w7(n),
      r = [];
    return (
      t.forEach((n) => {
        const t = e.data.services.get(n);
        t && r.push(t);
      }),
      r
    );
  }
  function w8(n, t) {
    if (null !== n)
      for (; n.childNodes.length > 0; ) t.appendChild(n.childNodes[0]);
  }
  function x0(n, t) {
    return function (e, r, o) {
      const i = {};
      for (let e = 0; e < o.length; e++) {
        const u = o[e],
          c = document.implementation.createHTMLDocument().body,
          s = t(r, u);
        null !== s && (n(s, c), (i[u] = c));
      }
      ((r.innerHTML = ""), n(e, r));
      for (const e in i) {
        const o = t(r, e);
        if (null === o) continue;
        const u = i[e];
        n(u, o);
      }
    };
  }
  function e0(n) {
    const t = document.implementation.createHTMLDocument().body;
    return (
      Object.defineProperty(t, "$plStgCS", {
        value: !1,
        writable: !0,
        enumerable: !1,
        configurable: !1,
      }),
      n && (t.innerHTML = n),
      t
    );
  }
  function e1(n, t) {
    if (n.$plStgCS) throw new PluncError("ERR1");
    n.innerHTML = t;
  }
  function i1(n) {
    if (n.$plStgCS) throw new PluncError("ERR2");
    return n.innerHTML;
  }
  function e3(n, t) {
    if (n.$plStgCS) throw new PluncError("ERR3");
    for (; n.firstChild; ) t.appendChild(n.firstChild);
    n.$plStgCS = !0;
  }
  function x2(n) {
    const t = new Map(),
      e = Array.from(n.querySelectorAll("template")),
      r = `${a0}`;
    for (const n of e) {
      const e = n.getAttribute(r);
      e && t.set(e, n.innerHTML);
    }
    return t;
  }
  var contexts = [],
    createContainer = i2(
      w0,
      w6,
      g0,
      d7,
      g1,
      f0,
      g2,
      g3,
      g4,
      u0,
      u2,
      u4,
      u3,
      u5,
      u6,
      u8,
      u9,
      v0,
      v1,
      v2,
      v3,
      w2,
      p2,
      p4,
      l9,
      n2,
      o8,
      o9,
      n7,
      p0,
      v4,
      v5,
      v6,
      v7,
      o7,
      p6,
      m1,
      m9,
      m5,
      p9,
      e0,
      e1,
      i1,
      e3,
    ),
    plunc = (window.plunc = {
      create: (n, t = null) => {
        const e = contexts.length + 1,
          r = createContainer(e, n, t);
        return (
          contexts.push(r),
          { component: r3(r), service: r5(r), factory: r7(r), helper: r9(r) }
        );
      },
    });
  function shouldInit(n) {
    return __async(this, null, function* () {
      return n.c9().config.startFn();
    });
  }
  function bootstrap(n) {
    return __async(this, null, function* () {
      if (0 === n.length) return;
      const [t, ...e] = n;
      if (!(yield shouldInit(t))) return;
      const r = x2(document.body),
        o = e0(r.get(t.c9().name)),
        i = n2(t.c9());
      n3(t, r, o9, i, v8(t, o9))(o, "");
      const u = t.f0();
      for (const n in u) {
        const e = u[n],
          r = s2(t, s1);
        t6(e.name, e, t, s1, r);
      }
      for (const n in u) {
        const e = u[n],
          r = t.d3(o, e.id);
        if (null === r) continue;
        const i = document.implementation.createHTMLDocument().body;
        i.innerHTML = r.innerHTML;
        const c = t.f1(e.id);
        t.f2(i, c);
        o5(t)(i, e.scope, !1);
        x0(w8, t.d3)(i, r, c);
      }
      const c = p8(t.c9().name);
      (c.replaceChildren(), t.e3(o, c), t.c9().f3());
      const s = t.c9().f4();
      for (let n = 0; n < s.length; n++) {
        (0, s[n])();
      }
      bootstrap(e);
    });
  }
  DOMHelper.ready(bootstrap.bind(null, contexts));
})();
